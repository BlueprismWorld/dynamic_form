'use client';

import React, { useState } from 'react';
import { FiDatabase, FiPlus, FiSettings, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import { SiSupabase } from 'react-icons/si';
import { DataSource, DataSourceSchema, SupabaseConfig, RestApiConfig, SoapApiConfig } from '../../../lib/types/datasource';

interface DataSourcePanelProps {
  dataSources: DataSource[];
  selectedDataSource: DataSource | undefined;
  dataSourceSchemas: Record<string, DataSourceSchema>;
  onAddDataSource: (dataSource: DataSource) => void;
  onSelectDataSource: (dataSource: DataSource) => void;
  onUpdateSchema: (dataSourceId: string, schema: DataSourceSchema) => void;
}

export function DataSourcePanel({
  dataSources,
  selectedDataSource,
  dataSourceSchemas,
  onAddDataSource,
  onSelectDataSource,
  onUpdateSchema
}: DataSourcePanelProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDataSource, setNewDataSource] = useState<Partial<DataSource>>({
    name: '',
    type: 'supabase',
    config: {} as any,
    connected: false
  });

  const handleAddDataSource = () => {
    if (newDataSource.name && newDataSource.type && newDataSource.config) {
      const dataSource: DataSource = {
        id: `${newDataSource.type}-${Date.now()}`,
        name: newDataSource.name,
        type: newDataSource.type,
        config: newDataSource.config,
        connected: false
      };
      
      onAddDataSource(dataSource);
      setNewDataSource({
        name: '',
        type: 'supabase',
        config: {} as any,
        connected: false
      });
      setShowAddForm(false);
    }
  };

  const getDataSourceIcon = (type: string) => {
    switch (type) {
      case 'supabase':
        return <SiSupabase className="w-4 h-4 text-green-600" />;
      case 'rest':
        return <FiDatabase className="w-4 h-4 text-blue-600" />;
      case 'soap':
        return <FiDatabase className="w-4 h-4 text-purple-600" />;
      default:
        return <FiDatabase className="w-4 h-4 text-gray-600" />;
    }
  };

  const testConnection = async (dataSource: DataSource) => {
    // Mock connection test - in real implementation, this would actually test the connection
    setTimeout(() => {
      // Mock schema for demo
      const mockSchema: DataSourceSchema = {
        tables: [
          {
            name: 'users',
            columns: [
              { name: 'id', type: 'number', nullable: false, isPrimaryKey: true },
              { name: 'email', type: 'string', nullable: false },
              { name: 'name', type: 'string', nullable: true },
              { name: 'created_at', type: 'date', nullable: false }
            ]
          },
          {
            name: 'posts',
            columns: [
              { name: 'id', type: 'number', nullable: false, isPrimaryKey: true },
              { name: 'title', type: 'string', nullable: false },
              { name: 'content', type: 'string', nullable: true },
              { name: 'user_id', type: 'number', nullable: false, isForeignKey: true },
              { name: 'created_at', type: 'date', nullable: false }
            ]
          }
        ]
      };
      
      onUpdateSchema(dataSource.id, mockSchema);
    }, 1000);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Data Sources</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Data Source List */}
      <div className="space-y-2">
        {dataSources.map((dataSource) => (
          <div
            key={dataSource.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedDataSource?.id === dataSource.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelectDataSource(dataSource)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getDataSourceIcon(dataSource.type)}
                <span className="text-sm font-medium text-gray-900">
                  {dataSource.name}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {dataSource.connected ? (
                  <FiCheck className="w-4 h-4 text-green-500" />
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      testConnection(dataSource);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <FiRefreshCw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {dataSource.type.toUpperCase()}
            </div>
            
            {/* Show schema info if available */}
            {dataSourceSchemas[dataSource.id] && (
              <div className="mt-2 text-xs text-gray-600">
                {dataSourceSchemas[dataSource.id].tables.length} tables
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Data Source Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Data Source</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newDataSource.name || ''}
                  onChange={(e) => setNewDataSource(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter data source name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newDataSource.type || 'supabase'}
                  onChange={(e) => setNewDataSource(prev => ({ 
                    ...prev, 
                    type: e.target.value as any,
                    config: {} as any
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="supabase">Supabase</option>
                  <option value="rest">REST API</option>
                  <option value="soap">SOAP API</option>
                </select>
              </div>

              {/* Configuration fields based on type */}
              {newDataSource.type === 'supabase' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supabase URL
                    </label>
                    <input
                      type="url"
                      value={(newDataSource.config as SupabaseConfig)?.url || ''}
                      onChange={(e) => setNewDataSource(prev => ({
                        ...prev,
                        config: { ...prev.config, url: e.target.value } as SupabaseConfig
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://your-project.supabase.co"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Anon Key
                    </label>
                    <input
                      type="password"
                      value={(newDataSource.config as SupabaseConfig)?.anonKey || ''}
                      onChange={(e) => setNewDataSource(prev => ({
                        ...prev,
                        config: { ...prev.config, anonKey: e.target.value } as SupabaseConfig
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your anon key"
                    />
                  </div>
                </>
              )}

              {newDataSource.type === 'rest' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base URL
                  </label>
                  <input
                    type="url"
                    value={(newDataSource.config as RestApiConfig)?.baseUrl || ''}
                    onChange={(e) => setNewDataSource(prev => ({
                      ...prev,
                      config: { ...prev.config, baseUrl: e.target.value } as RestApiConfig
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://api.example.com"
                  />
                </div>
              )}

              {newDataSource.type === 'soap' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WSDL URL
                  </label>
                  <input
                    type="url"
                    value={(newDataSource.config as SoapApiConfig)?.wsdlUrl || ''}
                    onChange={(e) => setNewDataSource(prev => ({
                      ...prev,
                      config: { ...prev.config, wsdlUrl: e.target.value } as SoapApiConfig
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/service?wsdl"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDataSource}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
