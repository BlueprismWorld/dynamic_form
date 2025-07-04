'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileConfig } from '../../lib/types/form';
import { useFormContext } from '../core/FormContext';
import { cn, formatFileSize, validateFileType } from '../../lib/utils/helpers';

interface FileInputProps {
  config: FileConfig;
}

export function FileInput({ config }: FileInputProps) {
  const { formData, updateField, errors, validateField } = useFormContext();
  const [localValue, setLocalValue] = useState<File[]>(formData[config.name] || []);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(formData[config.name] || []);
  }, [formData[config.name]]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    newFiles.forEach(file => {
      // Validate file type
      if (config.accept && !validateFileType(file, config.accept)) {
        errors.push(`${file.name}: Invalid file type`);
        return;
      }

      // Validate file size
      if (config.maxSize && file.size > config.maxSize) {
        errors.push(`${file.name}: File too large (max ${formatFileSize(config.maxSize)})`);
        return;
      }

      validFiles.push(file);
    });

    let finalFiles: File[];
    if (config.multiple) {
      finalFiles = [...localValue, ...validFiles];
      
      // Check max files limit
      if (config.maxFiles && finalFiles.length > config.maxFiles) {
        finalFiles = finalFiles.slice(0, config.maxFiles);
        errors.push(`Maximum ${config.maxFiles} files allowed`);
      }
    } else {
      finalFiles = validFiles.slice(0, 1);
    }

    setLocalValue(finalFiles);
    updateField(config.name, finalFiles);

    // Show validation errors
    if (errors.length > 0) {
      console.warn('File validation errors:', errors);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const newFiles = localValue.filter((_, i) => i !== index);
    setLocalValue(newFiles);
    updateField(config.name, newFiles);
  };

  const handleBlur = () => {
    if (config.validation) {
      const error = validateField(config.name, localValue);
      // Error is automatically handled by FormContext
    }
  };

  const hasError = errors[config.name];

  return (
    <div className={cn('file-input-container', config.className)} style={config.style}>
      {config.label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {config.label}
          {config.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* File Drop Zone */}
      <div
        className={cn(
          'border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors',
          dragActive && 'border-blue-500 bg-blue-50',
          hasError && 'border-red-500',
          config.disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !config.disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id={config.id}
          name={config.name}
          type="file"
          multiple={config.multiple}
          accept={config.accept}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={config.disabled}
          required={config.required}
          className="hidden"
        />
        
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
              Click to upload
            </span>
            <span> or drag and drop</span>
          </div>
          
          <p className="text-xs text-gray-500">
            {config.accept ? `Accepted formats: ${config.accept}` : 'All file types accepted'}
            {config.maxSize && (
              <span className="block">Maximum file size: {formatFileSize(config.maxSize)}</span>
            )}
            {config.multiple && config.maxFiles && (
              <span className="block">Maximum {config.maxFiles} files</span>
            )}
          </p>
        </div>
      </div>
      
      {/* Selected Files List */}
      {localValue.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          {localValue.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 p-1"
                disabled={config.disabled}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{hasError}</p>
      )}
    </div>
  );
}

// Example usage
export const FileInputExample = {
  basic: {
    id: 'document',
    type: 'file' as const,
    name: 'document',
    label: 'Upload Document',
    required: true,
    validation: [
      { type: 'required' as const, message: 'Document is required' }
    ]
  },
  
  image: {
    id: 'avatar',
    type: 'file' as const,
    name: 'avatar',
    label: 'Profile Picture',
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024, // 5MB
    validation: [
      { type: 'required' as const, message: 'Profile picture is required' }
    ]
  },
  
  multiple: {
    id: 'gallery',
    type: 'file' as const,
    name: 'gallery',
    label: 'Photo Gallery',
    multiple: true,
    accept: 'image/jpeg,image/png,image/gif',
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB per file
    validation: [
      { 
        type: 'custom' as const, 
        message: 'Please select at least one image',
        validator: (value: any) => Array.isArray(value) && value.length > 0
      }
    ]
  },
  
  specificTypes: {
    id: 'resume',
    type: 'file' as const,
    name: 'resume',
    label: 'Resume',
    accept: '.pdf,.doc,.docx',
    maxSize: 2 * 1024 * 1024, // 2MB
    required: true,
    validation: [
      { type: 'required' as const, message: 'Resume is required' }
    ]
  },
  
  withConditionalVisibility: {
    id: 'certificate',
    type: 'file' as const,
    name: 'certificate',
    label: 'Certificate',
    accept: 'image/*,.pdf',
    maxSize: 5 * 1024 * 1024, // 5MB
    visibleIf: {
      field: 'hasCertificate',
      operator: 'equals' as const,
      value: true
    },
    validation: [
      { type: 'required' as const, message: 'Certificate is required' }
    ]
  }
};
