import React from 'react';
import { BadgeConfig } from '@/lib/types/form';

interface BadgeProps {
  config: BadgeConfig;
}

const Badge: React.FC<BadgeProps> = ({ config }) => {
  const { text, variant = 'default', size = 'md' } = config;

  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const baseClasses = `inline-flex items-center border rounded-full font-medium ${getVariantClasses()} ${getSizeClasses()}`;
  const classes = config.className 
    ? `${baseClasses} ${config.className}` 
    : baseClasses;

  return (
    <span className={classes} style={config.style}>
      {text}
    </span>
  );
};

export default Badge;

// Example usage:
/*
const badgeConfig: BadgeConfig = {
  id: 'status-badge',
  type: 'badge',
  text: 'Active',
  variant: 'success',
  size: 'md',
  className: 'mr-2',
};

<Badge config={badgeConfig} />
*/
