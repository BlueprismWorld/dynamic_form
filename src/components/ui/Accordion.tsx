'use client';

import React, { useState } from 'react';
import { AccordionConfig } from '../../lib/types/form';
import { ComponentListRenderer } from '../core/ComponentRenderer';

interface AccordionProps {
  config: AccordionConfig;
  className?: string;
  style?: React.CSSProperties;
}

export function Accordion({ config, className, style }: AccordionProps) {
  const [openPanels, setOpenPanels] = useState<string[]>(
    config.defaultOpen || []
  );

  const togglePanel = (panelId: string) => {
    if (config.allowMultiple) {
      setOpenPanels(prev => 
        prev.includes(panelId) 
          ? prev.filter(id => id !== panelId)
          : [...prev, panelId]
      );
    } else {
      setOpenPanels(prev => 
        prev.includes(panelId) ? [] : [panelId]
      );
    }
  };

  const isPanelOpen = (panelId: string) => openPanels.includes(panelId);

  return (
    <div 
      className={`border border-gray-200 rounded-lg divide-y divide-gray-200 ${className || ''}`}
      style={style}
    >
      {config.panels?.map((panel) => (
        <div key={panel.id} className="accordion-panel">
          <button
            type="button"
            className={`w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset flex items-center justify-between ${
              panel.disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => !panel.disabled && togglePanel(panel.id)}
            aria-expanded={isPanelOpen(panel.id)}
            disabled={panel.disabled}
          >
            <span className="font-medium text-gray-900">{panel.title}</span>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                isPanelOpen(panel.id) ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          
          {isPanelOpen(panel.id) && (
            <div className="px-4 py-3 bg-white">
              <ComponentListRenderer components={panel.content} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Example usage:
export const AccordionExample = () => {
  const accordionConfig: AccordionConfig = {
    type: 'accordion',
    id: 'faq-accordion',
    allowMultiple: true,
    panels: [
      {
        id: 'panel-1',
        title: 'What is this form renderer?',
        content: [
          {
            type: 'text',
            id: 'description',
            name: 'description',
            label: 'Description',
            placeholder: 'Enter description...',
            required: true
          }
        ]
      },
      {
        id: 'panel-2',
        title: 'How do I use it?',
        content: [
          {
            type: 'textarea',
            id: 'usage',
            name: 'usage',
            label: 'Usage Instructions',
            placeholder: 'Describe how to use...',
            rows: 3
          }
        ]
      },
      {
        id: 'panel-3',
        title: 'Advanced Features',
        content: [
          {
            type: 'checkbox',
            id: 'features',
            name: 'features',
            label: 'Available Features',
            options: [
              { value: 'validation', label: 'Form Validation' },
              { value: 'conditional', label: 'Conditional Rendering' },
              { value: 'dynamic', label: 'Dynamic Data Fetching' }
            ]
          }
        ]
      }
    ]
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Accordion Component Example</h2>
      <Accordion config={accordionConfig} />
    </div>
  );
};
