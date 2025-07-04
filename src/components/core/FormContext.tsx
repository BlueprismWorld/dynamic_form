'use client';

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { FormContextType, ValidationRule } from '../../lib/types/form';
import { validateField } from '../../lib/utils/validation';

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useFormContext(): FormContextType {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

interface FormProviderProps {
  children: React.ReactNode;
  initialValues?: Record<string, any>;
  validationRules?: Record<string, ValidationRule[]>;
  onSubmit?: (data: Record<string, any>) => void;
}

export function FormProvider({ 
  children, 
  initialValues = {}, 
  validationRules = {},
  onSubmit 
}: FormProviderProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const validateFieldCallback = useCallback((name: string, value: any): string | null => {
    const rules = validationRules[name];
    if (!rules) return null;
    
    return validateField(value, rules);
  }, [validationRules]);

  const setError = useCallback((field: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const validateAllFields = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    for (const [fieldName, rules] of Object.entries(validationRules)) {
      const error = validateField(formData[fieldName], rules);
      if (error) {
        newErrors[fieldName] = error;
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    return !hasErrors;
  }, [formData, validationRules]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const isValid = validateAllFields();
      
      if (isValid && onSubmit) {
        await onSubmit(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, validateAllFields, onSubmit]);

  const contextValue: FormContextType = {
    formData,
    updateField,
    errors,
    setError,
    clearError,
    isSubmitting,
    validateField: validateFieldCallback,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
}

export { FormContext };
