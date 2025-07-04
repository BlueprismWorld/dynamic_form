import React, { useState, useEffect } from 'react';
import { NotificationConfig } from '@/lib/types/form';

interface NotificationProps {
  config: NotificationConfig;
}

const Notification: React.FC<NotificationProps> = ({ config }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { variant = 'info', message, title, duration, onClose } = config;

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const getTypeClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIconClasses = () => {
    switch (variant) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      case 'info':
      default:
        return 'text-blue-400';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  if (!isVisible) return null;

  const baseClasses = `border rounded-lg p-4 transition-all duration-300 ${getTypeClasses()}`;
  const classes = config.className 
    ? `${baseClasses} ${config.className}` 
    : baseClasses;

  return (
    <div className={classes} style={config.style}>
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${getIconClasses()}`}>
          <span className="text-xl">{getIcon()}</span>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {message}
          </div>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-transparent rounded-md inline-flex text-current hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <span className="text-lg">×</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;

// Example usage:
/*
const notificationConfig: NotificationConfig = {
  id: 'success-notification',
  type: 'notification',
  variant: 'success',
  title: 'Success!',
  message: 'Your changes have been saved successfully.',
  duration: 5000,
  onClose: () => console.log('Notification closed'),
  className: 'mb-4',
};

<Notification config={notificationConfig} />
*/
