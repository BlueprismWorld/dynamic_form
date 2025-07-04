'use client';

import React, { useState, useEffect } from 'react';
import { SelectConfig } from '../../lib/types/form';
import { useFormContext } from '../core/FormContext';
import { cn } from '../../lib/utils/helpers';
import { dataSourceCache } from '../../lib/utils/helpers';

interface SelectInputProps {
  config: SelectConfig;
}

export function SelectInput({ config }: SelectInputProps) {
  const { formData, updateField, errors, validateField } = useFormContext();
  const [localValue, setLocalValue] = useState(formData[config.name] || config.value || (config.multiple ? [] : ''));
  const [options, setOptions] = useState(config.options || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalValue(formData[config.name] || config.value || (config.multiple ? [] : ''));
  }, [formData[config.name], config.value, config.multiple]);

  useEffect(() => {
    if (config.dataSource) {
      setLoading(true);
      dataSourceCache.get(config.dataSource)
        .then(data => {
          setOptions(data);
        })
        .catch(error => {
          console.error('Error loading select options:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setOptions(config.options || []);
    }
  }, [config.dataSource, config.options]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let value: string | string[];
    
    if (config.multiple) {
      value = Array.from(e.target.selectedOptions, option => option.value);
    } else {
      value = e.target.value;
    }
    
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

  // Group options by group property
  const groupedOptions = options.reduce((acc, option) => {
    const group = option.group || 'default';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as Record<string, typeof options>);

  const hasGroups = Object.keys(groupedOptions).length > 1 || 
                    (Object.keys(groupedOptions).length === 1 && !groupedOptions.default);

  return (
    <div className={cn('select-input-container', config.className)} style={config.style}>
      {config.label && (
        <label 
          htmlFor={config.id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={config.id}
        name={config.name}
        value={config.multiple ? undefined : localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={config.disabled || loading}
        required={config.required}
        multiple={config.multiple}
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          hasError && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          (config.disabled || loading) && 'bg-gray-50 cursor-not-allowed',
          config.multiple && 'min-h-[120px]'
        )}
      >
        {config.placeholder && !config.multiple && (
          <option value="" disabled>
            {config.placeholder}
          </option>
        )}
        
        {loading && (
          <option disabled>Loading options...</option>
        )}
        
        {!loading && hasGroups ? (
          Object.entries(groupedOptions).map(([group, groupOptions]) => (
            <optgroup key={group} label={group}>
              {groupOptions.map(option => (
                <option 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                  selected={config.multiple && Array.isArray(localValue) && localValue.includes(String(option.value))}
                >
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))
        ) : (
          !loading && options.map(option => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
              selected={config.multiple && Array.isArray(localValue) && localValue.includes(String(option.value))}
            >
              {option.label}
            </option>
          ))
        )}
      </select>
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{hasError}</p>
      )}
    </div>
  );
}

// Example usage
export const SelectInputExample = {
  basic: {
    id: 'country',
    type: 'select' as const,
    name: 'country',
    label: 'Country',
    placeholder: 'Select a country',
    required: true,
    options: [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'au', label: 'Australia' }
    ],
    validation: [
      { type: 'required' as const, message: 'Country is required' }
    ]
  },
  
  multiple: {
    id: 'skills',
    type: 'select' as const,
    name: 'skills',
    label: 'Skills',
    multiple: true,
    options: [
      { value: 'js', label: 'JavaScript' },
      { value: 'ts', label: 'TypeScript' },
      { value: 'react', label: 'React' },
      { value: 'node', label: 'Node.js' },
      { value: 'python', label: 'Python' }
    ],
    validation: [
      { type: 'required' as const, message: 'Please select at least one skill' }
    ]
  },
  
  withGroups: {
    id: 'category',
    type: 'select' as const,
    name: 'category',
    label: 'Category',
    placeholder: 'Select a category',
    options: [
      { value: 'apple', label: 'Apple', group: 'Fruits' },
      { value: 'banana', label: 'Banana', group: 'Fruits' },
      { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
      { value: 'lettuce', label: 'Lettuce', group: 'Vegetables' },
      { value: 'chicken', label: 'Chicken', group: 'Meat' },
      { value: 'beef', label: 'Beef', group: 'Meat' }
    ]
  },
  
  withDataSource: {
    id: 'city',
    type: 'select' as const,
    name: 'city',
    label: 'City',
    placeholder: 'Select a city',
    dataSource: {
      url: 'https://api.example.com/cities',
      method: 'GET',
      valueField: 'id',
      labelField: 'name'
    },
    validation: [
      { type: 'required' as const, message: 'City is required' }
    ]
  },
  
  withConditionalVisibility: {
    id: 'state',
    type: 'select' as const,
    name: 'state',
    label: 'State',
    placeholder: 'Select a state',
    options: [
      { value: 'ca', label: 'California' },
      { value: 'ny', label: 'New York' },
      { value: 'tx', label: 'Texas' }
    ],
    visibleIf: {
      field: 'country',
      operator: 'equals' as const,
      value: 'us'
    }
  }
};
