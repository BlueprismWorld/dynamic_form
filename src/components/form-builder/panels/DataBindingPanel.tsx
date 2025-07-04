'use client';

import React, { useState, useEffect } from 'react';
import { DataSource, DataSourceSchema, ColumnSchema } from '../../../lib/types/datasource';
import { ColumnMapping } from '../../../lib/utils/schema-generator';
import { fetchSampleData } from '../../../lib/utils/data-source-connection';
import { FiLoader, FiAlertCircle, FiDatabase } from 'react-icons/fi';

interface DataBindingPanelProps {
  selectedDataSource: DataSource | null | undefined;
  dataSourceSchema?: DataSourceSchema;
  selectedTable: string;
  onTableSelect: (tableName: string) => void;
  onGenerateSchema: (config: any) => void;
}

export function DataBindingPanel({ 
  selectedDataSource, 
  dataSourceSchema,
  selectedTable, 
  onTableSelect,
  onGenerateSchema
}: DataBindingPanelProps) {
  const [schema, setSchema] = useState<DataSourceSchema | null>(dataSourceSchema || null);
  const [sampleData, setSampleData] = useState<Record<string, any> | null>(null);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formConfig, setFormConfig] = useState({
    title: 'Generated Form',
    description: 'Form generated from data source',
    submitAction: 'create' as const,
    includeValidation: true,
    includeDefaultValues: true,
  });

  useEffect(() => {
    if (dataSourceSchema) {
      setSchema(dataSourceSchema);
    }
  }, [dataSourceSchema]);

  useEffect(() => {
    if (selectedDataSource && selectedTable && schema) {
      loadSampleData();
    }
  }, [selectedDataSource, selectedTable, schema]);

  const loadSampleData = async () => {
    if (!selectedDataSource || !selectedTable) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const sampleRow = await fetchSampleData(selectedDataSource, selectedTable);
      setSampleData(sampleRow);
      
      // Generate initial mappings
      const table = schema?.tables.find(t => t.name === selectedTable);
      if (table) {
        const initialMappings = table.columns.map(column => ({
          column,
          componentType: getDefaultComponentType(column),
          label: formatColumnLabel(column.name),
          required: !column.nullable,
          options: generateOptionsForColumn(column, sampleRow)
        }));
        setMappings(initialMappings);
      }
    } catch (err) {
      console.error('Error loading sample data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sample data');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultComponentType = (column: ColumnSchema): string => {
    // Handle array types with multi-select
    if (column.type === 'array' || column.type.includes('[]')) {
      return 'select'; // Will be set to multiple in the component
    }
    
    // Handle specific types
    switch (column.type.toLowerCase()) {
      case 'text':
      case 'varchar':
      case 'char':
      case 'string':
        return 'text';
      case 'email':
        return 'email';
      case 'number':
      case 'int':
      case 'integer':
      case 'decimal':
      case 'float':
        return 'number';
      case 'boolean':
        return 'checkbox';
      case 'date':
        return 'date';
      case 'datetime':
      case 'timestamp':
        return 'datetime-local';
      case 'json':
        return 'textarea';
      default:
        return 'text';
    }
  };

  const formatColumnLabel = (columnName: string): string => {
    return columnName
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const generateOptionsForColumn = (column: ColumnSchema, sampleRow: Record<string, any> | null): { value: string; label: string }[] | undefined => {
    // For enum types, use the enum values
    if (column.constraints?.enum) {
      return column.constraints.enum.map(value => ({
        value: String(value),
        label: String(value)
      }));
    }

    // For array types, try to extract unique values from sample data
    if ((column.type === 'array' || column.type.includes('[]')) && sampleRow) {
      const sampleValue = sampleRow[column.name];
      if (Array.isArray(sampleValue) && sampleValue.length > 0) {
        return sampleValue.map(value => ({
          value: String(value),
          label: String(value)
        }));
      }
    }

    return undefined;
  };

  const updateMapping = (index: number, updates: Partial<ColumnMapping>) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], ...updates };
    setMappings(newMappings);
  };

  const isArrayType = (column: ColumnSchema): boolean => {
    return column.type === 'array' || column.type.includes('[]');
  };

  const handleGenerateForm = () => {
    if (!selectedDataSource || !selectedTable || mappings.length === 0) return;
    
    const config = {
      dataSource: selectedDataSource,
      table: selectedTable,
      columns: mappings,
      formConfig: formConfig
    };
    
    onGenerateSchema(config);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="flex items-center gap-2 text-gray-500">
          <FiLoader className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading schema...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex items-center gap-2 text-red-500 mb-4">
          <FiAlertCircle className="w-4 h-4" />
          <span className="text-sm">Error loading data</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadSampleData}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!selectedDataSource || !schema) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center text-gray-500">
          <FiDatabase className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No data source selected</p>
          <p className="text-xs mt-1">Select a data source to generate forms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="text-lg font-medium text-gray-900">Schema Generator</h3>
        <p className="text-sm text-gray-500">Generate forms from your data source</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Table Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Table
          </label>
          <select
            value={selectedTable}
            onChange={(e) => onTableSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a table...</option>
            {schema.tables.map(table => (
              <option key={table.name} value={table.name}>
                {table.name} ({table.columns.length} columns)
              </option>
            ))}
          </select>
        </div>

        {/* Form Configuration */}
        {selectedTable && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Configuration
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Form Title"
                  value={formConfig.title}
                  onChange={(e) => setFormConfig({...formConfig, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  placeholder="Form Description"
                  value={formConfig.description}
                  onChange={(e) => setFormConfig({...formConfig, description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  value={formConfig.submitAction}
                  onChange={(e) => setFormConfig({...formConfig, submitAction: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="create">Create Record</option>
                  <option value="update">Update Record</option>
                  <option value="delete">Delete Record</option>
                </select>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formConfig.includeValidation}
                      onChange={(e) => setFormConfig({...formConfig, includeValidation: e.target.checked})}
                      className="mr-2"
                    />
                    Include Validation
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formConfig.includeDefaultValues}
                      onChange={(e) => setFormConfig({...formConfig, includeDefaultValues: e.target.checked})}
                      className="mr-2"
                    />
                    Default Values
                  </label>
                </div>
              </div>
            </div>

            {/* Sample Data Preview */}
            {sampleData && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Data
                </label>
                <div className="p-3 bg-gray-100 rounded border max-h-32 overflow-y-auto">
                  <pre className="text-xs text-gray-600">
                    {JSON.stringify(sampleData, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Field Mappings */}
            {mappings.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Mappings ({mappings.length} fields)
                </label>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {mappings.map((mapping, index) => (
                    <div key={mapping.column.name} className="p-2 border border-gray-200 rounded bg-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {mapping.column.name}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {mapping.column.type}
                          {isArrayType(mapping.column) && ' (multi-select)'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={mapping.componentType}
                          onChange={(e) => updateMapping(index, { componentType: e.target.value })}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="number">Number</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                          <option value="radio">Radio</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="date">Date</option>
                          <option value="datetime-local">DateTime</option>
                        </select>
                        <input
                          type="text"
                          value={mapping.label}
                          onChange={(e) => updateMapping(index, { label: e.target.value })}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                          placeholder="Label"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateForm}
              disabled={!selectedTable || mappings.length === 0}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Generate Form Schema
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
