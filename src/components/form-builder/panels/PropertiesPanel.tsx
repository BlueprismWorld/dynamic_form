'use client';

import React, { useState, useEffect } from 'react';
import { FiSettings, FiLink, FiEye, FiEyeOff, FiPlus, FiTrash2 } from 'react-icons/fi';
import { ComponentConfig } from '../../../lib/types/form';
import { DataSource, DataSourceSchema } from '../../../lib/types/datasource';

interface PropertiesPanelProps {
  selectedComponent: ComponentConfig | null;
  selectedComponentIndex: number | null;
  dataSources: DataSource[];
  dataSourceSchemas: Record<string, DataSourceSchema>;
  onUpdateComponent: (updates: Record<string, any>) => void;
}

export function PropertiesPanel({
  selectedComponent,
  selectedComponentIndex,
  dataSources,
  dataSourceSchemas,
  onUpdateComponent,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'properties' | 'data' | 'validation' | 'style'>('properties');
  const [localUpdates, setLocalUpdates] = useState<Record<string, any>>({});

  // Reset local updates when component changes
  useEffect(() => {
    setLocalUpdates({});
  }, [selectedComponent?.id]);

  const handleUpdateComponent = (updates: Record<string, any>) => {
    setLocalUpdates(prev => ({ ...prev, ...updates }));
    onUpdateComponent(updates);
  };

  const getCurrentValue = (key: string) => {
    const componentAny = selectedComponent as any;
    return localUpdates[key] !== undefined ? localUpdates[key] : componentAny?.[key];
  };

  if (!selectedComponent) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-2 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-700">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <FiSettings className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              No component selected
            </h4>
            <p className="text-xs text-gray-500">
              Select a component from the canvas to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const componentAny = selectedComponent as any;

  const renderBasicProperties = () => (
    <div className="space-y-2">
      {/* Component Type */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Component Type
        </label>
        <div className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
          {selectedComponent.type}
        </div>
      </div>

      {/* Component ID */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Component ID
        </label>
        <input
          type="text"
          value={getCurrentValue('id') || ''}
          onChange={(e) => handleUpdateComponent({ id: e.target.value })}
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>

      {/* Label */}
      {componentAny.label !== undefined && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Label
          </label>
          <input
            type="text"
            value={getCurrentValue('label') || ''}
            onChange={(e) => handleUpdateComponent({ label: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      )}

      {/* Name */}
      {componentAny.name !== undefined && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Field Name
          </label>
          <input
            type="text"
            value={getCurrentValue('name') || ''}
            onChange={(e) => handleUpdateComponent({ name: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      )}

      {/* Placeholder */}
      {componentAny.placeholder !== undefined && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Placeholder
          </label>
          <input
            type="text"
            value={getCurrentValue('placeholder') || ''}
            onChange={(e) => handleUpdateComponent({ placeholder: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      )}

      {/* Text Content */}
      {componentAny.text !== undefined && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Text Content
          </label>
          <textarea
            value={getCurrentValue('text') || ''}
            onChange={(e) => handleUpdateComponent({ text: e.target.value })}
            rows={2}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      )}

      {/* Button Label */}
      {selectedComponent.type === 'button' && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Button Label
          </label>
          <input
            type="text"
            value={getCurrentValue('label') || ''}
            onChange={(e) => handleUpdateComponent({ label: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          />
        </div>
      )}

      {/* Button Variant */}
      {selectedComponent.type === 'button' && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Variant
          </label>
          <div className="grid grid-cols-5 gap-1">
            {['primary', 'secondary', 'danger', 'success', 'warning'].map((variant) => (
              <button
                key={variant}
                type="button"
                onClick={() => handleUpdateComponent({ variant })}
                className={`
                  px-1 py-0.5 text-[10px] rounded capitalize
                  ${getCurrentValue('variant') === variant 
                    ? 'ring-1 ring-blue-400 font-medium' 
                    : 'hover:bg-gray-50'
                  }
                  ${variant === 'primary' ? 'bg-blue-100 text-blue-800' : ''}
                  ${variant === 'secondary' ? 'bg-gray-100 text-gray-800' : ''}
                  ${variant === 'danger' ? 'bg-red-100 text-red-800' : ''}
                  ${variant === 'success' ? 'bg-green-100 text-green-800' : ''}
                  ${variant === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''}
                `}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle switches for Required/Disabled/ReadOnly */}
      <div className="flex flex-wrap gap-2 mt-1">
        {/* Required */}
        {componentAny.required !== undefined && (
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
            <label 
              htmlFor="required" 
              className={`text-xs mr-2 ${getCurrentValue('required') ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
            >
              Required
            </label>
            <div className="relative inline-block w-8 align-middle select-none">
              <input
                type="checkbox"
                id="required"
                checked={getCurrentValue('required') || false}
                onChange={(e) => handleUpdateComponent({ required: e.target.checked })}
                className="opacity-0 absolute block w-0 h-0"
              />
              <label
                htmlFor="required"
                className={`
                  block overflow-hidden h-4 rounded-full cursor-pointer
                  ${getCurrentValue('required') ? 'bg-blue-500' : 'bg-gray-300'}
                `}
              >
                <span 
                  className={`
                    block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
                    ${getCurrentValue('required') ? 'translate-x-4' : 'translate-x-0'}
                  `}
                ></span>
              </label>
            </div>
          </div>
        )}

        {/* Disabled */}
        {componentAny.disabled !== undefined && (
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
            <label 
              htmlFor="disabled" 
              className={`text-xs mr-2 ${getCurrentValue('disabled') ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
            >
              Disabled
            </label>
            <div className="relative inline-block w-8 align-middle select-none">
              <input
                type="checkbox"
                id="disabled"
                checked={getCurrentValue('disabled') || false}
                onChange={(e) => handleUpdateComponent({ disabled: e.target.checked })}
                className="opacity-0 absolute block w-0 h-0"
              />
              <label
                htmlFor="disabled"
                className={`
                  block overflow-hidden h-4 rounded-full cursor-pointer
                  ${getCurrentValue('disabled') ? 'bg-blue-500' : 'bg-gray-300'}
                `}
              >
                <span 
                  className={`
                    block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
                    ${getCurrentValue('disabled') ? 'translate-x-4' : 'translate-x-0'}
                  `}
                ></span>
              </label>
            </div>
          </div>
        )}

        {/* Read Only */}
        {componentAny.readOnly !== undefined && (
          <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
            <label 
              htmlFor="readOnly" 
              className={`text-xs mr-2 ${getCurrentValue('readOnly') ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
            >
              Read Only
            </label>
            <div className="relative inline-block w-8 align-middle select-none">
              <input
                type="checkbox"
                id="readOnly"
                checked={getCurrentValue('readOnly') || false}
                onChange={(e) => handleUpdateComponent({ readOnly: e.target.checked })}
                className="opacity-0 absolute block w-0 h-0"
              />
              <label
                htmlFor="readOnly"
                className={`
                  block overflow-hidden h-4 rounded-full cursor-pointer
                  ${getCurrentValue('readOnly') ? 'bg-blue-500' : 'bg-gray-300'}
                `}
              >
                <span 
                  className={`
                    block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out
                    ${getCurrentValue('readOnly') ? 'translate-x-4' : 'translate-x-0'}
                  `}
                ></span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Options for select, radio, checkbox */}
      {componentAny.options !== undefined && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-gray-600">
              Options
            </label>
            <button
              onClick={() => {
                const newOptions = [...(getCurrentValue('options') || []), { value: '', label: '' }];
                handleUpdateComponent({ options: newOptions });
              }}
              className="flex items-center text-[10px] text-blue-600 hover:text-blue-800 px-1 py-0.5 hover:bg-blue-50 rounded"
            >
              <FiPlus className="w-2.5 h-2.5 mr-0.5" />
              Add
            </button>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {(getCurrentValue('options') || []).map((option: any, index: number) => (
              <div key={index} className="flex items-center gap-1 bg-gray-50 p-1 rounded">
                <input
                  type="text"
                  placeholder="Value"
                  value={option.value || ''}
                  onChange={(e) => {
                    const newOptions = [...(getCurrentValue('options') || [])];
                    newOptions[index] = { ...option, value: e.target.value };
                    handleUpdateComponent({ options: newOptions });
                  }}
                  className="flex-1 px-1.5 py-0.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                />
                <input
                  type="text"
                  placeholder="Label"
                  value={option.label || ''}
                  onChange={(e) => {
                    const newOptions = [...(getCurrentValue('options') || [])];
                    newOptions[index] = { ...option, label: e.target.value };
                    handleUpdateComponent({ options: newOptions });
                  }}
                  className="flex-1 px-1.5 py-0.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                />
                <button
                  onClick={() => {
                    const newOptions = [...(getCurrentValue('options') || [])];
                    newOptions.splice(index, 1);
                    handleUpdateComponent({ options: newOptions });
                  }}
                  className="p-0.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  <FiTrash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {(getCurrentValue('options') || []).length === 0 && (
              <div 
                onClick={() => {
                  handleUpdateComponent({ options: [{ value: '', label: '' }] });
                }}
                className="text-center py-2 border border-dashed border-gray-200 rounded text-xs text-gray-400 hover:text-gray-600 hover:border-gray-300 cursor-pointer"
              >
                No options added
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderDataBinding = () => (
    <div className="space-y-2">
      {/* Data Source Selection */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Data Source
        </label>
        <select
          value={getCurrentValue('dataSource') || ''}
          onChange={(e) => handleUpdateComponent({ dataSource: e.target.value })}
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
        >
          <option value="">Select a data source</option>
          {dataSources.map((ds) => (
            <option key={ds.id} value={ds.id}>
              {ds.name} ({ds.type})
            </option>
          ))}
        </select>
      </div>

      {/* Table/Collection Selection */}
      {getCurrentValue('dataSource') && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Table/Collection
          </label>
          <select
            value={getCurrentValue('dataTable') || ''}
            onChange={(e) => handleUpdateComponent({ dataTable: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="">Select a table</option>
            {dataSourceSchemas[getCurrentValue('dataSource')]?.tables.map((table) => (
              <option key={table.name} value={table.name}>
                {table.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Column/Field Selection */}
      {getCurrentValue('dataSource') && getCurrentValue('dataTable') && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Column/Field
          </label>
          <select
            value={getCurrentValue('dataColumn') || ''}
            onChange={(e) => handleUpdateComponent({ dataColumn: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          >
            <option value="">Select a column</option>
            {dataSourceSchemas[getCurrentValue('dataSource')]?.tables
              .find(t => t.name === getCurrentValue('dataTable'))
              ?.columns.map((column) => (
                <option key={column.name} value={column.name}>
                  {column.name} ({column.type})
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Data Binding Preview */}
      {getCurrentValue('dataSource') && getCurrentValue('dataTable') && getCurrentValue('dataColumn') && (
        <div className="p-2 bg-blue-50 border border-blue-100 rounded-md mt-1">
          <div className="flex items-center gap-1 mb-1">
            <FiLink className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-800">Data Binding</span>
          </div>
          <div className="flex items-center space-x-1 text-[10px] text-blue-700">
            <span className="bg-blue-100 px-1 py-0.5 rounded">{getCurrentValue('dataSource')}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="bg-blue-100 px-1 py-0.5 rounded">{getCurrentValue('dataTable')}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="bg-blue-100 px-1 py-0.5 rounded">{getCurrentValue('dataColumn')}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderValidation = () => (
    <div className="space-y-2">
      {/* Text validation fields in a 2-column grid */}
      {(['text', 'email', 'password', 'textarea'].includes(selectedComponent.type)) && (
        <div className="grid grid-cols-2 gap-2">
          {/* Min Length */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Min Length
            </label>
            <input
              type="number"
              value={getCurrentValue('minLength') || ''}
              onChange={(e) => handleUpdateComponent({ minLength: parseInt(e.target.value) || undefined })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* Max Length */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Max Length
            </label>
            <input
              type="number"
              value={getCurrentValue('maxLength') || ''}
              onChange={(e) => handleUpdateComponent({ maxLength: parseInt(e.target.value) || undefined })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
        </div>
      )}

      {/* Pattern */}
      {(['text', 'email', 'password'].includes(selectedComponent.type)) && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Pattern (RegEx)
          </label>
          <input
            type="text"
            value={getCurrentValue('pattern') || ''}
            onChange={(e) => handleUpdateComponent({ pattern: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            placeholder="e.g., ^[a-zA-Z0-9]+$"
          />
        </div>
      )}

      {/* Min/Max for number inputs */}
      {selectedComponent.type === 'number' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Min Value
            </label>
            <input
              type="number"
              value={getCurrentValue('min') || ''}
              onChange={(e) => handleUpdateComponent({ min: parseFloat(e.target.value) || undefined })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Max Value
            </label>
            <input
              type="number"
              value={getCurrentValue('max') || ''}
              onChange={(e) => handleUpdateComponent({ max: parseFloat(e.target.value) || undefined })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
        </div>
      )}

      {/* Custom validation message */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Error Message
        </label>
        <input
          type="text"
          value={getCurrentValue('validationMessage') || ''}
          onChange={(e) => handleUpdateComponent({ validationMessage: e.target.value })}
          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
          placeholder="This field is required"
        />
      </div>
    </div>
  );

  const renderStyling = () => (
    <div className="space-y-4">
      {/* Layout & Dimensions */}
      <div className="space-y-2">
        <h5 className="text-xs font-semibold text-gray-800 border-b border-gray-200 pb-1">Layout & Dimensions</h5>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
            <input
              type="text"
              value={getCurrentValue('styleConfig')?.width || ''}
              onChange={(e) => handleUpdateComponent({ 
                styleConfig: { ...getCurrentValue('styleConfig'), width: e.target.value }
              })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="auto, 100px, 50%"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Height</label>
            <input
              type="text"
              value={getCurrentValue('styleConfig')?.height || ''}
              onChange={(e) => handleUpdateComponent({ 
                styleConfig: { ...getCurrentValue('styleConfig'), height: e.target.value }
              })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="auto, 100px, 50%"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Margin</label>
            <input
              type="text"
              value={getCurrentValue('styleConfig')?.margin || ''}
              onChange={(e) => handleUpdateComponent({ 
                styleConfig: { ...getCurrentValue('styleConfig'), margin: e.target.value }
              })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="0, 8px, 1rem"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Padding</label>
            <input
              type="text"
              value={getCurrentValue('styleConfig')?.padding || ''}
              onChange={(e) => handleUpdateComponent({ 
                styleConfig: { ...getCurrentValue('styleConfig'), padding: e.target.value }
              })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="0, 8px, 1rem"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-2">
        <h5 className="text-xs font-semibold text-gray-800 border-b border-gray-200 pb-1">Typography</h5>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Font Size</label>
            <input
              type="text"
              value={getCurrentValue('styleConfig')?.fontSize || ''}
              onChange={(e) => handleUpdateComponent({ 
                styleConfig: { ...getCurrentValue('styleConfig'), fontSize: e.target.value }
              })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="14px, 1rem, small"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Font Weight</label>
            <select
              value={getCurrentValue('styleConfig')?.fontWeight || ''}
              onChange={(e) => handleUpdateComponent({ 
                styleConfig: { ...getCurrentValue('styleConfig'), fontWeight: e.target.value }
              })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">Default</option>
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Lighter</option>
              <option value="bolder">Bolder</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
              <option value="900">900</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
            <div className="flex gap-1">
              <input
                type="color"
                value={getCurrentValue('styleConfig')?.color || '#000000'}
                onChange={(e) => handleUpdateComponent({ 
                  styleConfig: { ...getCurrentValue('styleConfig'), color: e.target.value }
                })}
                className="w-8 h-6 border border-gray-200 rounded cursor-pointer"
              />
              <input
                type="text"
                value={getCurrentValue('styleConfig')?.color || ''}
                onChange={(e) => handleUpdateComponent({ 
                  styleConfig: { ...getCurrentValue('styleConfig'), color: e.target.value }
                })}
                className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="#000000"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Text Align</label>
            <select
              value={getCurrentValue('styleConfig')?.textAlign || ''}
              onChange={(e) => handleUpdateComponent({ 
                styleConfig: { ...getCurrentValue('styleConfig'), textAlign: e.target.value as any }
              })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">Default</option>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="space-y-2">
        <h5 className="text-xs font-semibold text-gray-800 border-b border-gray-200 pb-1">Background</h5>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Background Color</label>
          <div className="flex gap-1">
            <input
              type="color"
              value={getCurrentValue('styleConfig')?.backgroundColor || '#ffffff'}
              onChange={(e) => handleUpdateComponent({ 
                styleConfig: { ...getCurrentValue('styleConfig'), backgroundColor: e.target.value }
              })}
              className="w-8 h-6 border border-gray-200 rounded cursor-pointer"
            />
            <input
              type="text"
              value={getCurrentValue('styleConfig')?.backgroundColor || ''}
              onChange={(e) => handleUpdateComponent({ 
                styleConfig: { ...getCurrentValue('styleConfig'), backgroundColor: e.target.value }
              })}
              className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="#ffffff, transparent"
            />
          </div>
        </div>
      </div>

      {/* Border */}
      <div className="space-y-2">
        <h5 className="text-xs font-semibold text-gray-800 border-b border-gray-200 pb-1">Border</h5>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Border Width</label>
            <input
              type="text"
              value={getCurrentValue('styleConfig')?.borderWidth || ''}
              onChange={(e) => handleUpdateComponent({ 
                styleConfig: { ...getCurrentValue('styleConfig'), borderWidth: e.target.value }
              })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="1px, 2px"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Border Style</label>
            <select
              value={getCurrentValue('styleConfig')?.borderStyle || ''}
              onChange={(e) => handleUpdateComponent({ 
                styleConfig: { ...getCurrentValue('styleConfig'), borderStyle: e.target.value }
              })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option value="">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Border Color</label>
            <div className="flex gap-1">
              <input
                type="color"
                value={getCurrentValue('styleConfig')?.borderColor || '#d1d5db'}
                onChange={(e) => handleUpdateComponent({ 
                  styleConfig: { ...getCurrentValue('styleConfig'), borderColor: e.target.value }
                })}
                className="w-8 h-6 border border-gray-200 rounded cursor-pointer"
              />
              <input
                type="text"
                value={getCurrentValue('styleConfig')?.borderColor || ''}
                onChange={(e) => handleUpdateComponent({ 
                  styleConfig: { ...getCurrentValue('styleConfig'), borderColor: e.target.value }
                })}
                className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="#d1d5db"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Border Radius</label>
            <input
              type="text"
              value={getCurrentValue('styleConfig')?.borderRadius || ''}
              onChange={(e) => handleUpdateComponent({ 
                styleConfig: { ...getCurrentValue('styleConfig'), borderRadius: e.target.value }
              })}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="0, 4px, 50%"
            />
          </div>
        </div>
      </div>

      {/* Box Shadow */}
      <div className="space-y-2">
        <h5 className="text-xs font-semibold text-gray-800 border-b border-gray-200 pb-1">Shadow</h5>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Box Shadow</label>
          <input
            type="text"
            value={getCurrentValue('styleConfig')?.boxShadow || ''}
            onChange={(e) => handleUpdateComponent({ 
              styleConfig: { ...getCurrentValue('styleConfig'), boxShadow: e.target.value }
            })}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="0 1px 3px rgba(0,0,0,0.1)"
          />
        </div>
      </div>

      {/* CSS Classes (existing functionality) */}
      <div className="space-y-2">
        <h5 className="text-xs font-semibold text-gray-800 border-b border-gray-200 pb-1">CSS Classes</h5>
        
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">CSS Classes</label>
          <input
            type="text"
            value={getCurrentValue('className') || ''}
            onChange={(e) => handleUpdateComponent({ className: e.target.value })}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="e.g., text-lg font-bold"
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'properties', label: 'Props', icon: FiSettings },
    { id: 'data', label: 'Data', icon: FiLink },
    { id: 'validation', label: 'Valid', icon: FiSettings },
    { id: 'style', label: 'Style', icon: FiSettings },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-700">Properties</h3>
          <span className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
            {selectedComponent.type} #{selectedComponentIndex! + 1}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 border-b border-gray-100 bg-gray-50">
        <nav className="flex justify-between px-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex flex-col items-center gap-0.5 px-2 py-1.5 text-xs font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <IconComponent className="w-3 h-3" />
                <span className="text-[10px]">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {activeTab === 'properties' && renderBasicProperties()}
          {activeTab === 'data' && renderDataBinding()}
          {activeTab === 'validation' && renderValidation()}
          {activeTab === 'style' && renderStyling()}
        </div>
      </div>
    </div>
  );
}
