'use client';

import React from 'react';
import { FormSchema } from '../../lib/types/form';
import { FormProvider } from './FormContext';
import { ComponentListRenderer } from './ComponentRenderer';
import { cn } from '../../lib/utils/helpers';

interface FormRendererProps {
  schema: FormSchema;
  className?: string;
  style?: React.CSSProperties;
}

export function FormRenderer({ schema, className, style }: FormRendererProps) {
  const validationRules = schema.components.reduce((acc, component) => {
    if ('name' in component && 'validation' in component && component.validation) {
      acc[component.name] = component.validation;
    }
    return acc;
  }, {} as Record<string, any>);

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      if (schema.onSubmit) {
         schema.onSubmit(data);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <FormProvider
      initialValues={schema.initialValues}
      validationRules={validationRules}
      onSubmit={handleSubmit}
    >
      <div className={cn('form-renderer', className)} style={style}>
        {schema.title && (
          <h2 className="text-2xl font-bold mb-4">{schema.title}</h2>
        )}
        {schema.description && (
          <p className="text-gray-600 mb-6">{schema.description}</p>
        )}
        <ComponentListRenderer components={schema.components} />
      </div>
    </FormProvider>
  );
}

