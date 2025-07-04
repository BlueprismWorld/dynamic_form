import React, { useState } from 'react';
import { FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';
import { DataSource, SupabaseConfig, RestApiConfig, SoapApiConfig } from '../../../lib/types/datasource';
import { createDataSourceConnection } from '../../../lib/utils/data-source-connection';

interface AddDataSourceModalProps {
  showModal: boolean;
  onClose: () => void;
  onAdd: (dataSource: DataSource) => void;
}

export function AddDataSourceModal({ showModal, onClose, onAdd }: AddDataSourceModalProps) {
  const [newDataSource, setNewDataSource] = useState<Partial<DataSource>>({
    name: '',
    type: 'supabase',
    config: {} as any,
    connected: false
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string>('');

  const handleTestConnection = async () => {
    if (!newDataSource.name || !newDataSource.type || !newDataSource.config) {
      setConnectionError('Please fill in all required fields');
      setConnectionStatus('error');
      return;
    }

    setIsConnecting(true);
    setConnectionError('');
    setConnectionStatus('idle');

    try {
      const tempDataSource: DataSource = {
        id: `temp-${Date.now()}`,
        name: newDataSource.name,
        type: newDataSource.type,
        config: newDataSource.config,
        connected: false
      };

      const connection = createDataSourceConnection(tempDataSource);
      const isConnected = await connection.testConnection();

      if (isConnected) {
        setConnectionStatus('success');
        setNewDataSource(prev => ({ ...prev, connected: true }));
      } else {
        setConnectionStatus('error');
        setConnectionError('Failed to connect to data source');
      }
    } catch (error) {
      setConnectionStatus('error');
      setConnectionError(error instanceof Error ? error.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAddDataSource = async () => {
    if (newDataSource.name && newDataSource.type && newDataSource.config) {
      setIsConnecting(true);
      
      try {
        const dataSource: DataSource = {
          id: `${newDataSource.type}-${Date.now()}`,
          name: newDataSource.name,
          type: newDataSource.type,
          config: newDataSource.config,
          connected: false
        };

        // Test connection and fetch schema
        const connection = createDataSourceConnection(dataSource);
        const isConnected = await connection.testConnection();
        
        if (isConnected) {
          dataSource.connected = true;
          try {
            const schema = await connection.fetchSchema();
            dataSource.schema = schema;
          } catch (error) {
            console.warn('Failed to fetch schema:', error);
          }
        }

        onAdd(dataSource);
        setNewDataSource({
          name: '',
          type: 'supabase',
          config: {} as any,
          connected: false
        });
        setConnectionStatus('idle');
        setConnectionError('');
        onClose();
      } catch (error) {
        setConnectionError(error instanceof Error ? error.message : 'Failed to add data source');
        setConnectionStatus('error');
      } finally {
        setIsConnecting(false);
      }
    }
  };

  if (!showModal) return null;

  return (
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
            <>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Authentication Type
                </label>
                <select
                  value={(newDataSource.config as RestApiConfig)?.authentication?.type || 'none'}
                  onChange={(e) => {
                    const authType = e.target.value;
                    setNewDataSource(prev => ({
                      ...prev,
                      config: { 
                        ...prev.config, 
                        authentication: authType === 'none' ? undefined : { type: authType as any }
                      } as RestApiConfig
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">No Authentication</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="api_key">API Key</option>
                  <option value="basic">Basic Auth</option>
                </select>
              </div>
              {(newDataSource.config as RestApiConfig)?.authentication?.type === 'bearer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bearer Token
                  </label>
                  <input
                    type="password"
                    value={(newDataSource.config as RestApiConfig)?.authentication?.token || ''}
                    onChange={(e) => setNewDataSource(prev => ({
                      ...prev,
                      config: { 
                        ...prev.config, 
                        authentication: { 
                          ...(prev.config as RestApiConfig).authentication, 
                          token: e.target.value 
                        } 
                      } as RestApiConfig
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter bearer token"
                  />
                </div>
              )}
              {(newDataSource.config as RestApiConfig)?.authentication?.type === 'api_key' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={(newDataSource.config as RestApiConfig)?.authentication?.apiKey || ''}
                    onChange={(e) => setNewDataSource(prev => ({
                      ...prev,
                      config: { 
                        ...prev.config, 
                        authentication: { 
                          ...(prev.config as RestApiConfig).authentication, 
                          apiKey: e.target.value 
                        } 
                      } as RestApiConfig
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter API key"
                  />
                </div>
              )}
              {(newDataSource.config as RestApiConfig)?.authentication?.type === 'basic' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={(newDataSource.config as RestApiConfig)?.authentication?.username || ''}
                      onChange={(e) => setNewDataSource(prev => ({
                        ...prev,
                        config: { 
                          ...prev.config, 
                          authentication: { 
                            ...(prev.config as RestApiConfig).authentication, 
                            username: e.target.value 
                          } 
                        } as RestApiConfig
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      value={(newDataSource.config as RestApiConfig)?.authentication?.password || ''}
                      onChange={(e) => setNewDataSource(prev => ({
                        ...prev,
                        config: { 
                          ...prev.config, 
                          authentication: { 
                            ...(prev.config as RestApiConfig).authentication, 
                            password: e.target.value 
                          } 
                        } as RestApiConfig
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {newDataSource.type === 'soap' && (
            <>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  value={(newDataSource.config as SoapApiConfig)?.endpoint || ''}
                  onChange={(e) => setNewDataSource(prev => ({
                    ...prev,
                    config: { ...prev.config, endpoint: e.target.value } as SoapApiConfig
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/service"
                />
              </div>
            </>
          )}
        </div>

        {/* Connection Test */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Connection Test</span>
            <button
              onClick={handleTestConnection}
              disabled={isConnecting}
              className="flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <FiRefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <FiRefreshCw className="w-4 h-4 mr-1" />
                  Test Connection
                </>
              )}
            </button>
          </div>
          
          {connectionStatus === 'success' && (
            <div className="mt-2 flex items-center text-sm text-green-600">
              <FiCheck className="w-4 h-4 mr-1" />
              Connection successful
            </div>
          )}
          
          {connectionStatus === 'error' && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              <FiX className="w-4 h-4 mr-1" />
              {connectionError || 'Connection failed'}
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleAddDataSource}
            disabled={isConnecting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
          >
            {isConnecting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
