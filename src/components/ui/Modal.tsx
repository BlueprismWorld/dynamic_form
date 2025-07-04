'use client';

import React, { useState, useEffect } from 'react';
import { ModalConfig } from '../../lib/types/form';
import { ComponentRenderer } from '../core/ComponentRenderer';

interface ModalProps {
  config: ModalConfig;
  className?: string;
  style?: React.CSSProperties;
}

export function Modal({ config, className, style }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (config.onClose) {
      config.onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && config.closeOnOverlay) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getSizeClass = () => {
    switch (config.size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      default:
        return 'max-w-md';
    }
  };

  return (
    <>
      {/* Trigger element */}
      <div onClick={handleOpen}>
        <ComponentRenderer config={config.trigger} />
      </div>

      {/* Modal overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleBackdropClick}
        >
          <div 
            className={`bg-white rounded-lg shadow-xl ${getSizeClass()} w-full mx-4 max-h-[90vh] overflow-y-auto ${className || ''}`}
            style={style}
          >
            {config.title && (
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={handleClose}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            <div className="px-6 py-4">
              {config.content?.map((component, index) => (
                <ComponentRenderer key={component.id || `modal-content-${index}`} config={component} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Example usage:
export const ModalExample = () => {
  const modalConfig: ModalConfig = {
    type: 'modal',
    id: 'confirmation-modal',
    title: 'Confirm Action',
    size: 'md',
    closeOnOverlay: true,
    onClose: () => console.log('Modal closed'),
    trigger: {
      type: 'button',
      id: 'open-modal-btn',
      label: 'Open Modal',
      variant: 'primary'
    },
    content: [
      {
        type: 'text',
        id: 'modal-message',
        name: 'message',
        label: 'Message',
        value: 'Are you sure you want to proceed with this action?',
        readOnly: true
      },
      {
        type: 'button',
        id: 'confirm-btn',
        label: 'Confirm',
        variant: 'primary',
        onClick: () => console.log('Action confirmed!')
      }
    ]
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Modal Component Example</h2>
      <Modal config={modalConfig} />
    </div>
  );
};
