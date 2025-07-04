'use client';

import React, { useState } from 'react';
import { TabsConfig } from '../../lib/types/form';
import { ComponentListRenderer } from '../core/ComponentRenderer';
import { cn } from '../../lib/utils/helpers';

interface TabsProps {
  config: TabsConfig;
}

export function Tabs({ config }: TabsProps) {
  const [activeTab, setActiveTab] = useState(config.defaultTab || config.tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (config.onTabChange) {
      config.onTabChange(tabId);
    }
  };

  const activeTabData = config.tabs?.find(tab => tab.id === activeTab);

  return (
    <div className={cn('tabs-container', config.className)} style={config.style}>
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {config.tabs?.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.icon && (
                <span className="mr-2">{tab.icon}</span>
              )}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTabData && (
          <ComponentListRenderer 
            components={activeTabData.content} 
            className="tab-content"
          />
        )}
      </div>
    </div>
  );
}

// Example usage
export const TabsExample = {
  basic: {
    id: 'basicTabs',
    type: 'tabs' as const,
    defaultTab: 'personal',
    tabs: [
      {
        id: 'personal',
        label: 'Personal Info',
        content: [
          {
            id: 'firstName',
            type: 'text' as const,
            name: 'firstName',
            label: 'First Name',
            required: true
          },
          {
            id: 'lastName',
            type: 'text' as const,
            name: 'lastName',
            label: 'Last Name',
            required: true
          },
          {
            id: 'email',
            type: 'email' as const,
            name: 'email',
            label: 'Email',
            required: true
          }
        ]
      },
      {
        id: 'address',
        label: 'Address',
        content: [
          {
            id: 'street',
            type: 'text' as const,
            name: 'street',
            label: 'Street Address',
            required: true
          },
          {
            id: 'city',
            type: 'text' as const,
            name: 'city',
            label: 'City',
            required: true
          },
          {
            id: 'zipCode',
            type: 'text' as const,
            name: 'zipCode',
            label: 'ZIP Code',
            required: true
          }
        ]
      },
      {
        id: 'preferences',
        label: 'Preferences',
        content: [
          {
            id: 'newsletter',
            type: 'checkbox' as const,
            name: 'newsletter',
            label: 'Subscribe to newsletter',
            single: true
          },
          {
            id: 'theme',
            type: 'radio' as const,
            name: 'theme',
            label: 'Theme Preference',
            options: [
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'auto', label: 'Auto' }
            ]
          }
        ]
      }
    ]
  },
  
  withIcons: {
    id: 'iconTabs',
    type: 'tabs' as const,
    defaultTab: 'account',
    tabs: [
      {
        id: 'account',
        label: 'Account',
        icon: '👤',
        content: [
          {
            id: 'username',
            type: 'text' as const,
            name: 'username',
            label: 'Username',
            required: true
          },
          {
            id: 'password',
            type: 'password' as const,
            name: 'password',
            label: 'Password',
            required: true
          }
        ]
      },
      {
        id: 'security',
        label: 'Security',
        icon: '🔒',
        content: [
          {
            id: 'twoFactor',
            type: 'checkbox' as const,
            name: 'twoFactor',
            label: 'Enable Two-Factor Authentication',
            single: true
          },
          {
            id: 'securityQuestion',
            type: 'text' as const,
            name: 'securityQuestion',
            label: 'Security Question'
          }
        ]
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: '🔔',
        content: [
          {
            id: 'emailNotifs',
            type: 'checkbox' as const,
            name: 'emailNotifs',
            label: 'Email Notifications',
            single: true
          },
          {
            id: 'pushNotifs',
            type: 'checkbox' as const,
            name: 'pushNotifs',
            label: 'Push Notifications',
            single: true
          }
        ]
      }
    ]
  },
  
  withDisabledTab: {
    id: 'disabledTabs',
    type: 'tabs' as const,
    defaultTab: 'basic',
    tabs: [
      {
        id: 'basic',
        label: 'Basic Info',
        content: [
          {
            id: 'name',
            type: 'text' as const,
            name: 'name',
            label: 'Name',
            required: true
          }
        ]
      },
      {
        id: 'advanced',
        label: 'Advanced',
        disabled: true,
        content: [
          {
            id: 'advanced-setting',
            type: 'text' as const,
            name: 'advancedSetting',
            label: 'Advanced Setting'
          }
        ]
      }
    ]
  },
  
  withCallback: {
    id: 'callbackTabs',
    type: 'tabs' as const,
    defaultTab: 'step1',
    onTabChange: (tabId: string) => console.log(`Tab changed to: ${tabId}`),
    tabs: [
      {
        id: 'step1',
        label: 'Step 1',
        content: [
          {
            id: 'step1-field',
            type: 'text' as const,
            name: 'step1Field',
            label: 'Step 1 Field'
          }
        ]
      },
      {
        id: 'step2',
        label: 'Step 2',
        content: [
          {
            id: 'step2-field',
            type: 'text' as const,
            name: 'step2Field',
            label: 'Step 2 Field'
          }
        ]
      }
    ]
  }
};
