import React from 'react';
import { ProgressBarConfig } from '@/lib/types/form';

interface ProgressBarProps {
  config: ProgressBarConfig;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ config }) => {
  const { value, max = 100, label, variant = 'default', showPercentage = false } = config;
  
  const percentage = Math.min((value / max) * 100, 100);
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const baseClasses = "w-full bg-gray-200 rounded-full h-2";
  const classes = config.className 
    ? `${baseClasses} ${config.className}` 
    : baseClasses;

  return (
    <div className="w-full" style={config.style}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={classes}>
        <div
          className={`h-2 rounded-full transition-all duration-300 ease-in-out ${getVariantClasses()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

// Example usage:
/*
const progressConfig: ProgressBarConfig = {
  id: 'upload-progress',
  type: 'progress-bar',
  value: 65,
  max: 100,
  label: 'Upload Progress',
  variant: 'success',
  showPercentage: true,
  className: 'mb-4',
};

<ProgressBar config={progressConfig} />
*/
