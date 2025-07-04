'use client';

import React from 'react';
import { ComponentConfig } from '../../lib/types/form';
import { shouldShowComponent } from '../../lib/utils/validation';
import { useFormContext } from './FormContext';

// Import all component types
import { TextInput } from '../form-inputs/TextInput';
import { TextareaInput } from '../form-inputs/TextareaInput';
import { SelectInput } from '../form-inputs/SelectInput';
import { RadioInput } from '../form-inputs/RadioInput';
import { CheckboxInput } from '../form-inputs/CheckboxInput';
import { FileInput } from '../form-inputs/FileInput';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { Stepper } from '../ui/Stepper';
import { Accordion } from '../ui/Accordion';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import Table from '../ui/Table';
import ProgressBar from '../ui/ProgressBar';
import Notification from '../ui/Notification';
import Badge from '../ui/Badge';
import Breadcrumbs from '../ui/Breadcrumbs';
import Chips from '../ui/Chips';
import Tooltip from '../ui/Tooltip';
import Grid from '../ui/Grid';

interface ComponentRendererProps {
  config: ComponentConfig;
}

export function ComponentRenderer({ config }: ComponentRendererProps) {
  const { formData } = useFormContext();
  
  // Check if component should be visible based on conditional rules
  const isVisible = shouldShowComponent(config.visibleIf, formData);
  
  if (!isVisible) {
    return null;
  }

  // Render the appropriate component based on type
  switch (config.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'number':
    case 'date':
    case 'time':
    case 'datetime-local':
      return <TextInput config={config} />;

    case 'textarea':
      return <TextareaInput config={config} />;

    case 'select':
      return <SelectInput config={config} />;

    case 'radio':
      return <RadioInput config={config} />;

    case 'checkbox':
      return <CheckboxInput config={config} />;

    case 'file':
      return <FileInput config={config} />;

    case 'button':
      return <Button config={config} />;

    case 'tabs':
      return <Tabs config={config} />;

    case 'stepper':
      return <Stepper config={config} />;

    case 'accordion':
      return <Accordion config={config} />;

    case 'card':
      return <Card config={config} />;

    case 'modal':
      return <Modal config={config} />;

    case 'table':
      return <Table config={config} />;

    case 'progress-bar':
      return <ProgressBar config={config} />;

    case 'notification':
      return <Notification config={config} />;

    case 'badge':
      return <Badge config={config} />;

    case 'breadcrumbs':
      return <Breadcrumbs config={config} />;

    case 'chips':
      return <Chips config={config} />;

    case 'tooltip':
      return <Tooltip config={config} />;

    case 'grid':
      return <Grid config={config} />;

    default:
      console.warn(`Unknown component type: ${(config as any).type}`);
      return null;
  }
}

interface ComponentListRendererProps {
  components: ComponentConfig[];
  className?: string;
}

export function ComponentListRenderer({ components, className }: ComponentListRendererProps) {
    // Handle undefined or empty components arrays
    if (!components || !Array.isArray(components)) {
      return null;
    }
    
  return (
    <div className={className}>
      {components.map((config, index) => (
        <ComponentRenderer key={config.id || `item-${index}`} config={config} />
      ))}
    </div>
  );
}
