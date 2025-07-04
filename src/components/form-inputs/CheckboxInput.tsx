'use client';

import React, { useState, useEffect } from 'react';
import { CheckboxConfig } from '../../lib/types/form';
import { useFormContext } from '../core/FormContext';
import { cn } from '../../lib/utils/helpers';

interface CheckboxInputProps {
  config: CheckboxConfig;
}

export function CheckboxInput({ config }: CheckboxInputProps) {
  const { formData, updateField, errors, validateField } = useFormContext();
  const [localValue, setLocalValue] = useState(() => {
    const formValue = formData[config.name];
    if (config.single) {
      return formValue || config.value || false;
    }
    return formValue || config.value || [];
  });

  useEffect(() => {
    const formValue = formData[config.name];
    if (config.single) {
      setLocalValue(formValue || config.value || false);
    } else {
      setLocalValue(formValue || config.value || []);
    }
  }, [formData[config.name], config.value, config.single]);

  const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setLocalValue(value);
    updateField(config.name, value);
  };

  const handleMultipleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const optionValue = e.target.value;
    const isChecked = e.target.checked;
    let newValue: string[];

    if (Array.isArray(localValue)) {
      if (isChecked) {
        newValue = [...localValue, optionValue];
      } else {
        newValue = localValue.filter(v => v !== optionValue);
      }
    } else {
      newValue = isChecked ? [optionValue] : [];
    }

    setLocalValue(newValue);
    updateField(config.name, newValue);
  };

  const handleBlur = () => {
    if (config.validation) {
      const error = validateField(config.name, localValue);
      // Error is automatically handled by FormContext
    }
  };

  const hasError = errors[config.name];

  // Single checkbox
  if (config.single) {
    return (
      <div className={cn('checkbox-input-container', config.className)} style={config.style}>
        <div className="flex items-center">
          <input
            id={config.id}
            name={config.name}
            type="checkbox"
            checked={Boolean(localValue)}
            onChange={handleSingleChange}
            onBlur={handleBlur}
            disabled={config.disabled}
            required={config.required}
            className={cn(
              'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
              config.disabled && 'cursor-not-allowed opacity-50'
            )}
          />
          {config.label && (
            <label 
              htmlFor={config.id}
              className={cn(
                'ml-2 text-sm text-gray-700 cursor-pointer',
                config.disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {config.label}
              {config.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
        
        {hasError && (
          <p className="mt-1 text-sm text-red-600">{hasError}</p>
        )}
      </div>
    );
  }

  // Multiple checkboxes
  return (
    <div className={cn('checkbox-input-container', config.className)} style={config.style}>
      {config.label && (
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">
            {config.label}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </legend>
          
          <div className="space-y-2">
            {config.options?.map((option, index) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${config.id}-${index}`}
                  name={config.name}
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(localValue) && localValue.includes(String(option.value))}
                  onChange={handleMultipleChange}
                  onBlur={handleBlur}
                  disabled={config.disabled || option.disabled}
                  className={cn(
                    'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
                    (config.disabled || option.disabled) && 'cursor-not-allowed opacity-50'
                  )}
                />
                <label 
                  htmlFor={`${config.id}-${index}`}
                  className={cn(
                    'ml-2 text-sm text-gray-700 cursor-pointer',
                    (config.disabled || option.disabled) && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      )}
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{hasError}</p>
      )}
    </div>
  );
}

// Example usage
export const CheckboxInputExample = {
  single: {
    id: 'agreeTerms',
    type: 'checkbox' as const,
    name: 'agreeTerms',
    label: 'I agree to the Terms and Conditions',
    single: true,
    required: true,
    validation: [
      { 
        type: 'required' as const, 
        message: 'You must agree to the terms' 
      },
      { 
        type: 'custom' as const, 
        message: 'You must agree to the terms to continue',
        validator: (value: any) => value === true
      }
    ]
  },
  
  multiple: {
    id: 'interests',
    type: 'checkbox' as const,
    name: 'interests',
    label: 'What are your interests?',
    options: [
      { value: 'technology', label: 'Technology' },
      { value: 'sports', label: 'Sports' },
      { value: 'music', label: 'Music' },
      { value: 'travel', label: 'Travel' },
      { value: 'cooking', label: 'Cooking' },
      { value: 'reading', label: 'Reading' }
    ],
    validation: [
      { 
        type: 'custom' as const, 
        message: 'Please select at least one interest',
        validator: (value: any) => Array.isArray(value) && value.length > 0
      }
    ]
  },
  
  withDisabledOptions: {
    id: 'features',
    type: 'checkbox' as const,
    name: 'features',
    label: 'Select features to enable',
    options: [
      { value: 'notifications', label: 'Push Notifications' },
      { value: 'analytics', label: 'Analytics' },
      { value: 'sync', label: 'Cloud Sync' },
      { value: 'premium', label: 'Premium Features (Pro only)', disabled: true }
    ]
  },
  
  withPreSelectedValues: {
    id: 'permissions',
    type: 'checkbox' as const,
    name: 'permissions',
    label: 'User Permissions',
    value: ['read', 'write'],
    options: [
      { value: 'read', label: 'Read Access' },
      { value: 'write', label: 'Write Access' },
      { value: 'delete', label: 'Delete Access' },
      { value: 'admin', label: 'Admin Access' }
    ]
  },
  
  withConditionalVisibility: {
    id: 'additionalServices',
    type: 'checkbox' as const,
    name: 'additionalServices',
    label: 'Additional Services',
    options: [
      { value: 'setup', label: 'Setup Service (+$50)' },
      { value: 'training', label: 'Training (+$100)' },
      { value: 'support', label: 'Premium Support (+$25/month)' }
    ],
    visibleIf: {
      field: 'subscription',
      operator: 'notEquals' as const,
      value: 'free'
    }
  },
  
  newsletter: {
    id: 'newsletter',
    type: 'checkbox' as const,
    name: 'newsletter',
    label: 'Subscribe to our newsletter for updates and special offers',
    single: true,
    value: true
  }
};
