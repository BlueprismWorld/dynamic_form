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

// Helper function to convert styleConfig to CSS styles
function convertStyleConfigToCSS(styleConfig: ComponentConfig['styleConfig']): React.CSSProperties {
  if (!styleConfig) return {};
  
  const styles: React.CSSProperties = {};
  
  // Layout
  if (styleConfig.width) styles.width = styleConfig.width;
  if (styleConfig.height) styles.height = styleConfig.height;
  if (styleConfig.margin) styles.margin = styleConfig.margin;
  if (styleConfig.padding) styles.padding = styleConfig.padding;
  if (styleConfig.display) styles.display = styleConfig.display;
  if (styleConfig.position) styles.position = styleConfig.position;
  if (styleConfig.top) styles.top = styleConfig.top;
  if (styleConfig.right) styles.right = styleConfig.right;
  if (styleConfig.bottom) styles.bottom = styleConfig.bottom;
  if (styleConfig.left) styles.left = styleConfig.left;
  if (styleConfig.zIndex) styles.zIndex = styleConfig.zIndex;
  
  // Typography
  if (styleConfig.fontSize) styles.fontSize = styleConfig.fontSize;
  if (styleConfig.fontWeight) styles.fontWeight = styleConfig.fontWeight;
  if (styleConfig.fontFamily) styles.fontFamily = styleConfig.fontFamily;
  if (styleConfig.color) styles.color = styleConfig.color;
  if (styleConfig.textAlign) styles.textAlign = styleConfig.textAlign;
  if (styleConfig.lineHeight) styles.lineHeight = styleConfig.lineHeight;
  
  // Background
  if (styleConfig.backgroundColor) styles.backgroundColor = styleConfig.backgroundColor;
  if (styleConfig.backgroundImage) styles.backgroundImage = styleConfig.backgroundImage;
  if (styleConfig.backgroundSize) styles.backgroundSize = styleConfig.backgroundSize;
  if (styleConfig.backgroundPosition) styles.backgroundPosition = styleConfig.backgroundPosition;
  
  // Border
  if (styleConfig.border) styles.border = styleConfig.border;
  if (styleConfig.borderRadius) styles.borderRadius = styleConfig.borderRadius;
  if (styleConfig.borderWidth) styles.borderWidth = styleConfig.borderWidth;
  if (styleConfig.borderStyle) styles.borderStyle = styleConfig.borderStyle;
  if (styleConfig.borderColor) styles.borderColor = styleConfig.borderColor;
  
  // Shadow
  if (styleConfig.boxShadow) styles.boxShadow = styleConfig.boxShadow;
  
  // Flexbox
  if (styleConfig.flexDirection) styles.flexDirection = styleConfig.flexDirection;
  if (styleConfig.justifyContent) styles.justifyContent = styleConfig.justifyContent;
  if (styleConfig.alignItems) styles.alignItems = styleConfig.alignItems;
  if (styleConfig.flexWrap) styles.flexWrap = styleConfig.flexWrap;
  if (styleConfig.gap) styles.gap = styleConfig.gap;
  
  // Grid
  if (styleConfig.gridTemplateColumns) styles.gridTemplateColumns = styleConfig.gridTemplateColumns;
  if (styleConfig.gridTemplateRows) styles.gridTemplateRows = styleConfig.gridTemplateRows;
  if (styleConfig.gridGap) styles.gridGap = styleConfig.gridGap;
  
  // Other
  if (styleConfig.opacity) styles.opacity = styleConfig.opacity;
  if (styleConfig.transform) styles.transform = styleConfig.transform;
  if (styleConfig.transition) styles.transition = styleConfig.transition;
  if (styleConfig.overflow) styles.overflow = styleConfig.overflow;
  if (styleConfig.visibility) styles.visibility = styleConfig.visibility;
  
  return styles;
}

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

  // Convert styleConfig to CSS styles
  const appliedStyles = convertStyleConfigToCSS(config.styleConfig);
  
  // Merge with existing inline styles
  const finalStyles = { ...appliedStyles, ...config.style };

  // Function to render the component with applied styles
  const renderComponent = () => {
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
  };

  const component = renderComponent();
  
  // If there are no custom styles, return the component as-is
  if (Object.keys(finalStyles).length === 0) {
    return component;
  }
  
  // Otherwise, wrap the component in a styled div
  return (
    <div style={finalStyles} className={config.className}>
      {component}
    </div>
  );
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
