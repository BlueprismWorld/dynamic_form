'use client';

import React, { useState, useEffect } from 'react';
import { TextareaConfig } from '../../lib/types/form';
import { useFormContext } from '../core/FormContext';
import { cn } from '../../lib/utils/helpers';

interface TextareaInputProps {
  config: TextareaConfig;
}

export function TextareaInput({ config }: TextareaInputProps) {
  const { formData, updateField, errors, validateField } = useFormContext();
  const [localValue, setLocalValue] = useState(formData[config.name] || config.value || '');

  useEffect(() => {
    setLocalValue(formData[config.name] || config.value || '');
  }, [formData[config.name], config.value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <div className={cn('textarea-input-container', config.className)} style={config.style}>
      {config.label && (
        <label 
          htmlFor={config.id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={config.id}
        name={config.name}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={config.placeholder}
        disabled={config.disabled}
        readOnly={config.readOnly}
        required={config.required}
        rows={config.rows || 3}
        cols={config.cols}
        maxLength={config.maxLength}
        minLength={config.minLength}
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          hasError && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          config.disabled && 'bg-gray-50 cursor-not-allowed',
          config.readOnly && 'bg-gray-50',
          config.resize === 'none' && 'resize-none',
          config.resize === 'vertical' && 'resize-y',
          config.resize === 'horizontal' && 'resize-x',
          config.resize === 'both' && 'resize'
        )}
      />
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{hasError}</p>
      )}
    </div>
  );
}

// Example usage
export const TextareaInputExample = {
  basic: {
    id: 'description',
    type: 'textarea' as const,
    name: 'description',
    label: 'Description',
    placeholder: 'Enter a description',
    rows: 4,
    required: true,
    validation: [
      { type: 'required' as const, message: 'Description is required' },
      { type: 'min' as const, value: 10, message: 'Must be at least 10 characters' }
    ]
  },
  
  withMaxLength: {
    id: 'bio',
    type: 'textarea' as const,
    name: 'bio',
    label: 'Bio',
    placeholder: 'Tell us about yourself (max 500 characters)',
    rows: 5,
    maxLength: 500,
    validation: [
      { type: 'max' as const, value: 500, message: 'Bio cannot exceed 500 characters' }
    ]
  },
  
  noResize: {
    id: 'message',
    type: 'textarea' as const,
    name: 'message',
    label: 'Message',
    placeholder: 'Enter your message',
    rows: 3,
    resize: 'none' as const,
    validation: [
      { type: 'required' as const, message: 'Message is required' }
    ]
  },
  
  withConditionalVisibility: {
    id: 'feedback',
    type: 'textarea' as const,
    name: 'feedback',
    label: 'Additional Feedback',
    placeholder: 'Please provide additional feedback',
    rows: 4,
    visibleIf: {
      field: 'rating',
      operator: 'lessThan' as const,
      value: 4
    }
  },
  
  readOnly: {
    id: 'terms',
    type: 'textarea' as const,
    name: 'terms',
    label: 'Terms and Conditions',
    value: 'This is a read-only textarea with terms and conditions...',
    rows: 8,
    readOnly: true,
    resize: 'none' as const
  }
};
