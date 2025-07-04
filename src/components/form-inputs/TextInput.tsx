'use client';

import React, { useState, useEffect } from 'react';
import { TextInputConfig } from '../../lib/types/form';
import { useFormContext } from '../core/FormContext';
import { cn } from '../../lib/utils/helpers';

interface TextInputProps {
  config: TextInputConfig;
}

export function TextInput({ config }: TextInputProps) {
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
    <div className={cn('text-input-container', config.className)} style={config.style}>
      {config.label && (
        <label 
          htmlFor={config.id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={config.id}
        name={config.name}
        type={config.type}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={config.placeholder}
        disabled={config.disabled}
        readOnly={config.readOnly}
        required={config.required}
        min={config.min}
        max={config.max}
        step={config.step}
        maxLength={config.maxLength}
        minLength={config.minLength}
        pattern={config.pattern}
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          hasError && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          config.disabled && 'bg-gray-50 cursor-not-allowed',
          config.readOnly && 'bg-gray-50'
        )}
      />
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{hasError}</p>
      )}
    </div>
  );
}

// Example usage
export const TextInputExample = {
  basic: {
    id: 'firstName',
    type: 'text' as const,
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your first name',
    required: true,
    validation: [
      { type: 'required' as const, message: 'First name is required' },
      { type: 'min' as const, value: 2, message: 'Must be at least 2 characters' }
    ]
  },
  
  email: {
    id: 'email',
    type: 'email' as const,
    name: 'email',
    label: 'Email Address',
    placeholder: 'user@example.com',
    required: true,
    validation: [
      { type: 'required' as const, message: 'Email is required' },
      { type: 'email' as const, message: 'Please enter a valid email' }
    ]
  },
  
  password: {
    id: 'password',
    type: 'password' as const,
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
    minLength: 8,
    validation: [
      { type: 'required' as const, message: 'Password is required' },
      { type: 'min' as const, value: 8, message: 'Password must be at least 8 characters' }
    ]
  },
  
  number: {
    id: 'age',
    type: 'number' as const,
    name: 'age',
    label: 'Age',
    placeholder: 'Enter your age',
    min: 1,
    max: 120,
    validation: [
      { type: 'required' as const, message: 'Age is required' }
    ]
  },
  
  date: {
    id: 'birthDate',
    type: 'date' as const,
    name: 'birthDate',
    label: 'Birth Date',
    validation: [
      { type: 'required' as const, message: 'Birth date is required' }
    ]
  },
  
  time: {
    id: 'meetingTime',
    type: 'time' as const,
    name: 'meetingTime',
    label: 'Meeting Time',
    validation: [
      { type: 'required' as const, message: 'Meeting time is required' }
    ]
  },
  
  datetime: {
    id: 'appointmentDateTime',
    type: 'datetime-local' as const,
    name: 'appointmentDateTime',
    label: 'Appointment Date & Time',
    validation: [
      { type: 'required' as const, message: 'Appointment date & time is required' }
    ]
  },
  
  withConditionalVisibility: {
    id: 'companyName',
    type: 'text' as const,
    name: 'companyName',
    label: 'Company Name',
    placeholder: 'Enter company name',
    visibleIf: {
      field: 'employmentStatus',
      operator: 'equals' as const,
      value: 'employed'
    }
  },
  
  withCustomStyle: {
    id: 'customStyled',
    type: 'text' as const,
    name: 'customStyled',
    label: 'Custom Styled Input',
    placeholder: 'This has custom styling',
    className: 'custom-input-class',
    style: {
      backgroundColor: '#f0f8ff',
      borderRadius: '8px'
    }
  }
};
