'use client';

import React from 'react';
import { ButtonConfig } from '../../lib/types/form';
import { cn } from '../../lib/utils/helpers';

interface ButtonProps {
  config: ButtonConfig;
}

export function Button({ config }: ButtonProps) {
  const handleClick = () => {
    if (config.onClick) {
      config.onClick();
    }
  };

  const getVariantStyles = () => {
    switch (config.variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-transparent';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-300';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-transparent';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white border-transparent';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white border-transparent';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300';
    }
  };

  const getSizeStyles = () => {
    switch (config.size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      case 'md':
      default:
        return 'px-4 py-2 text-base';
    }
  };

  return (
    <button
      id={config.id}
      type={config.buttonType || 'button'}
      onClick={handleClick}
      disabled={config.loading}
      className={cn(
        'inline-flex items-center justify-center border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200',
        getVariantStyles(),
        getSizeStyles(),
        config.loading && 'opacity-50 cursor-not-allowed',
        config.className
      )}
      style={config.style}
    >
      {config.loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {config.icon && config.iconPosition === 'left' && !config.loading && (
        <span className="mr-2">{config.icon}</span>
      )}
      
      {config.label}
      
      {config.icon && config.iconPosition === 'right' && !config.loading && (
        <span className="ml-2">{config.icon}</span>
      )}
    </button>
  );
}

// Example usage
export const ButtonExample = {
  primary: {
    id: 'submit',
    type: 'button' as const,
    label: 'Submit',
    variant: 'primary' as const,
    buttonType: 'submit' as const,
    onClick: () => console.log('Form submitted')
  },
  
  secondary: {
    id: 'cancel',
    type: 'button' as const,
    label: 'Cancel',
    variant: 'secondary' as const,
    onClick: () => console.log('Cancelled')
  },
  
  danger: {
    id: 'delete',
    type: 'button' as const,
    label: 'Delete',
    variant: 'danger' as const,
    onClick: () => console.log('Deleted')
  },
  
  success: {
    id: 'save',
    type: 'button' as const,
    label: 'Save',
    variant: 'success' as const,
    onClick: () => console.log('Saved')
  },
  
  warning: {
    id: 'warning',
    type: 'button' as const,
    label: 'Warning',
    variant: 'warning' as const,
    onClick: () => console.log('Warning clicked')
  },
  
  ghost: {
    id: 'ghost',
    type: 'button' as const,
    label: 'Ghost',
    variant: 'ghost' as const,
    onClick: () => console.log('Ghost clicked')
  },
  
  withIcon: {
    id: 'download',
    type: 'button' as const,
    label: 'Download',
    variant: 'primary' as const,
    icon: '⬇️',
    iconPosition: 'left' as const,
    onClick: () => console.log('Download clicked')
  },
  
  loading: {
    id: 'loading',
    type: 'button' as const,
    label: 'Processing...',
    variant: 'primary' as const,
    loading: true,
    onClick: () => console.log('Loading clicked')
  },
  
  small: {
    id: 'small',
    type: 'button' as const,
    label: 'Small',
    variant: 'secondary' as const,
    size: 'sm' as const,
    onClick: () => console.log('Small clicked')
  },
  
  large: {
    id: 'large',
    type: 'button' as const,
    label: 'Large',
    variant: 'primary' as const,
    size: 'lg' as const,
    onClick: () => console.log('Large clicked')
  },
  
  reset: {
    id: 'reset',
    type: 'button' as const,
    label: 'Reset Form',
    variant: 'ghost' as const,
    buttonType: 'reset' as const,
    onClick: () => console.log('Form reset')
  }
};
