'use client';

import React, { useState, useEffect } from 'react';
import { RadioConfig } from '../../lib/types/form';
import { useFormContext } from '../core/FormContext';
import { cn } from '../../lib/utils/helpers';

interface RadioInputProps {
  config: RadioConfig;
}

export function RadioInput({ config }: RadioInputProps) {
  const { formData, updateField, errors, validateField } = useFormContext();
  const [localValue, setLocalValue] = useState(formData[config.name] || config.value || '');

  useEffect(() => {
    setLocalValue(formData[config.name] || config.value || '');
  }, [formData[config.name], config.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    updateField(config.name, value);
  };

  const handleBlur = () => {
    if (config.validation) {
      const error = validateField(config.name, localValue);
      // Error is automatically handled by FormContext
    }
  };

  const hasError = errors[config.name];

  return (
    <div className={cn('radio-input-container', config.className)} style={config.style}>
      {config.label && (
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700 mb-2">
            {config.label}
            {config.required && <span className="text-red-500 ml-1">*</span>}
          </legend>
          
          <div className="space-y-2">
            {config.options.map((option, index) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${config.id}-${index}`}
                  name={config.name}
                  type="radio"
                  value={option.value}
                  checked={localValue === String(option.value)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={config.disabled || option.disabled}
                  required={config.required}
                  className={cn(
                    'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300',
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
export const RadioInputExample = {
  basic: {
    id: 'gender',
    type: 'radio' as const,
    name: 'gender',
    label: 'Gender',
    required: true,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ],
    validation: [
      { type: 'required' as const, message: 'Gender is required' }
    ]
  },
  
  withDisabledOption: {
    id: 'subscription',
    type: 'radio' as const,
    name: 'subscription',
    label: 'Subscription Plan',
    required: true,
    options: [
      { value: 'free', label: 'Free' },
      { value: 'basic', label: 'Basic - $9.99/month' },
      { value: 'pro', label: 'Pro - $19.99/month' },
      { value: 'enterprise', label: 'Enterprise - Contact us', disabled: true }
    ],
    validation: [
      { type: 'required' as const, message: 'Subscription plan is required' }
    ]
  },
  
  withPreSelectedValue: {
    id: 'notification',
    type: 'radio' as const,
    name: 'notification',
    label: 'Email Notifications',
    value: 'weekly',
    options: [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
      { value: 'never', label: 'Never' }
    ]
  },
  
  withConditionalVisibility: {
    id: 'paymentMethod',
    type: 'radio' as const,
    name: 'paymentMethod',
    label: 'Payment Method',
    required: true,
    options: [
      { value: 'credit-card', label: 'Credit Card' },
      { value: 'paypal', label: 'PayPal' },
      { value: 'bank-transfer', label: 'Bank Transfer' }
    ],
    visibleIf: {
      field: 'subscription',
      operator: 'notEquals' as const,
      value: 'free'
    },
    validation: [
      { type: 'required' as const, message: 'Payment method is required' }
    ]
  },
  
  yesNoQuestion: {
    id: 'agreeTerms',
    type: 'radio' as const,
    name: 'agreeTerms',
    label: 'Do you agree to the Terms and Conditions?',
    required: true,
    options: [
      { value: 'yes', label: 'Yes, I agree' },
      { value: 'no', label: 'No, I do not agree' }
    ],
    validation: [
      { type: 'required' as const, message: 'You must agree to the terms' },
      { 
        type: 'custom' as const, 
        message: 'You must agree to the terms to continue',
        validator: (value: any) => value === 'yes'
      }
    ]
  }
};
