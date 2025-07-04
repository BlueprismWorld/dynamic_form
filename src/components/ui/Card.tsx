'use client';

import React from 'react';
import { CardConfig } from '../../lib/types/form';
import { ComponentRenderer } from '../core/ComponentRenderer';

interface CardProps {
  config: CardConfig;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ config, className, style }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${className || ''}`}
      style={style}
    >
      {config.header && (
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <ComponentRenderer config={config.header} />
        </div>
      )}
      
      <div className="px-6 py-4">
        {config.content?.map((component, index) => (
          <ComponentRenderer key={component.id || `card-content-${index}`} config={component} />
        ))}
      </div>
      
      {config.footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <ComponentRenderer config={config.footer} />
        </div>
      )}
    </div>
  );
}

// Example usage:
export const CardExample = () => {
  const cardConfig: CardConfig = {
    type: 'card',
    id: 'user-profile-card',
    header: {
      type: 'text',
      id: 'card-title',
      name: 'title',
      label: '',
      value: 'User Profile',
      className: 'text-lg font-semibold text-gray-900'
    },
    content: [
      {
        type: 'text',
        id: 'name',
        name: 'name',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true
      },
      {
        type: 'email',
        id: 'email',
        name: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true
      },
      {
        type: 'textarea',
        id: 'bio',
        name: 'bio',
        label: 'Bio',
        placeholder: 'Tell us about yourself...',
        rows: 4
      }
    ],
    footer: {
      type: 'button',
      id: 'save-profile',
      label: 'Save Profile',
      variant: 'primary',
      onClick: () => console.log('Profile saved!')
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Card Component Example</h2>
      <Card config={cardConfig} />
    </div>
  );
};
