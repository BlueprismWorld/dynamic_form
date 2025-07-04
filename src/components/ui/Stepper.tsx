'use client';

import React from 'react';
import { StepperConfig } from '../../lib/types/form';
import { ComponentListRenderer } from '../core/ComponentRenderer';
import { cn } from '../../lib/utils/helpers';

interface StepperProps {
  config: StepperConfig;
}

export function Stepper({ config }: StepperProps) {
  const handleStepChange = (stepIndex: number) => {
    if (config.onStepChange) {
      config.onStepChange(stepIndex);
    }
  };

  const canGoToStep = (stepIndex: number) => {
    if (config.allowSkip) return true;
    return stepIndex <= config.currentStep;
  };

  const getStepStatus = (stepIndex: number) => {
    if (config.steps[stepIndex].completed) return 'completed';
    if (stepIndex === config.currentStep) return 'current';
    if (stepIndex < config.currentStep) return 'completed';
    return 'pending';
  };

  const currentStepData = config.steps[config.currentStep];

  return (
    <div className={cn('stepper-container', config.className)} style={config.style}>
      {/* Step Navigation */}
      <nav className="flex items-center justify-center mb-8">
        <ol className="flex items-center space-x-2">
          {config.steps?.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = canGoToStep(index);
            
            return (
              <li key={step.id} className="flex items-center">
                {/* Step Circle */}
                <button
                  onClick={() => isClickable && handleStepChange(index)}
                  disabled={!isClickable}
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors',
                    status === 'current' && 'bg-blue-600 text-white',
                    status === 'completed' && 'bg-green-600 text-white',
                    status === 'pending' && 'bg-gray-200 text-gray-600',
                    isClickable && status !== 'current' && 'cursor-pointer hover:bg-blue-700',
                    !isClickable && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {status === 'completed' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                
                {/* Step Label */}
                <div className="ml-2 min-w-0 flex flex-col">
                  <span className={cn(
                    'text-sm font-medium',
                    status === 'current' && 'text-blue-600',
                    status === 'completed' && 'text-green-600',
                    status === 'pending' && 'text-gray-500'
                  )}>
                    {step.label}
                  </span>
                  {step.optional && (
                    <span className="text-xs text-gray-400">Optional</span>
                  )}
                </div>
                
                {/* Connector Line */}
                {index < config.steps.length - 1 && (
                  <div className={cn(
                    'flex-1 w-16 h-0.5 mx-4',
                    index < config.currentStep && 'bg-green-600',
                    index >= config.currentStep && 'bg-gray-200'
                  )} />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Current Step Content */}
      {currentStepData && (
        <div className="step-content">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentStepData.label}
            </h3>
            {currentStepData.optional && (
              <p className="text-sm text-gray-500 mt-1">This step is optional</p>
            )}
          </div>
          
          <ComponentListRenderer 
            components={currentStepData.content} 
            className="step-fields"
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => handleStepChange(config.currentStep - 1)}
          disabled={config.currentStep === 0}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            config.currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          )}
        >
          Previous
        </button>
        
        <div className="flex space-x-2">
          {currentStepData?.optional && (
            <button
              onClick={() => handleStepChange(config.currentStep + 1)}
              disabled={config.currentStep >= config.steps.length - 1}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Skip
            </button>
          )}
          
          <button
            onClick={() => handleStepChange(config.currentStep + 1)}
            disabled={config.currentStep >= config.steps.length - 1}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              config.currentStep >= config.steps.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {config.currentStep === config.steps.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Example usage
export const StepperExample = {
  basic: {
    id: 'basicStepper',
    type: 'stepper' as const,
    currentStep: 0,
    onStepChange: (step: number) => console.log(`Step changed to: ${step}`),
    steps: [
      {
        id: 'personal',
        label: 'Personal Information',
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
        label: 'Address Details',
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
        optional: true,
        content: [
          {
            id: 'newsletter',
            type: 'checkbox' as const,
            name: 'newsletter',
            label: 'Subscribe to newsletter',
            single: true
          },
          {
            id: 'notifications',
            type: 'radio' as const,
            name: 'notifications',
            label: 'Notification Frequency',
            options: [
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'never', label: 'Never' }
            ]
          }
        ]
      },
      {
        id: 'review',
        label: 'Review & Submit',
        content: [
          {
            id: 'review-note',
            type: 'textarea' as const,
            name: 'reviewNote',
            label: 'Additional Notes',
            placeholder: 'Any additional information...',
            rows: 4
          }
        ]
      }
    ]
  },
  
  withCompletedSteps: {
    id: 'completedStepper',
    type: 'stepper' as const,
    currentStep: 2,
    allowSkip: true,
    steps: [
      {
        id: 'step1',
        label: 'Step 1',
        completed: true,
        content: [
          {
            id: 'field1',
            type: 'text' as const,
            name: 'field1',
            label: 'Field 1'
          }
        ]
      },
      {
        id: 'step2',
        label: 'Step 2',
        completed: true,
        content: [
          {
            id: 'field2',
            type: 'text' as const,
            name: 'field2',
            label: 'Field 2'
          }
        ]
      },
      {
        id: 'step3',
        label: 'Step 3',
        content: [
          {
            id: 'field3',
            type: 'text' as const,
            name: 'field3',
            label: 'Field 3'
          }
        ]
      }
    ]
  },
  
  withOptionalSteps: {
    id: 'optionalStepper',
    type: 'stepper' as const,
    currentStep: 0,
    steps: [
      {
        id: 'required1',
        label: 'Required Info',
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
        id: 'optional1',
        label: 'Optional Details',
        optional: true,
        content: [
          {
            id: 'bio',
            type: 'textarea' as const,
            name: 'bio',
            label: 'Biography',
            rows: 3
          }
        ]
      },
      {
        id: 'required2',
        label: 'Final Step',
        content: [
          {
            id: 'confirmation',
            type: 'checkbox' as const,
            name: 'confirmation',
            label: 'I confirm all information is correct',
            single: true,
            required: true
          }
        ]
      }
    ]
  }
};
