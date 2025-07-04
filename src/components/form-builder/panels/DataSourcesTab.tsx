import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiCheck, FiRefreshCw, FiDatabase, FiMousePointer } from 'react-icons/fi';
import { SiSupabase } from 'react-icons/si';
import { DataSource, DataSourceSchema } from '../../../lib/types/datasource';

interface DataSourcesTabProps {
  dataSources: DataSource[];
  dataSourceSchemas: Record<string, DataSourceSchema>;
  selectedDataSource?: DataSource;
  onAddDataSource: () => void;
  onSelectDataSource: (dataSource: DataSource) => void;
  onTestConnection: (dataSource: DataSource) => void;
  onRefreshSchema: (dataSource: DataSource) => void;
}

export function DataSourcesTab({
  dataSources,
  dataSourceSchemas,
  selectedDataSource,
  onAddDataSource,
  onSelectDataSource,
  onTestConnection,
  onRefreshSchema
}: DataSourcesTabProps) {
  const getDataSourceIcon = (type: string) => {
    switch (type) {
      case 'supabase':
        return <SiSupabase className="w-3 h-3 text-green-600" />;
      case 'rest':
        return <FiDatabase className="w-3 h-3 text-blue-600" />;
      case 'soap':
        return <FiDatabase className="w-3 h-3 text-purple-600" />;
      default:
        return <FiDatabase className="w-3 h-3 text-gray-600" />;
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="flex-1 overflow-y-auto p-3 bg-gray-50 min-h-0"
      variants={tabContentVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.2 }}
    >
      {/* Data Sources Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-gray-900">Data Sources</h4>
        <button
          onClick={onAddDataSource}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded text-xs"
          title="Add Data Source"
        >
          <FiPlus className="w-3 h-3" />
        </button>
      </div>

      {/* Data Source List */}
      <div className="space-y-2 mb-4">
        {dataSources.map((dataSource) => (
          <motion.div
            key={dataSource.id}
            className={`p-2 rounded-md border cursor-pointer transition-colors ${
              selectedDataSource?.id === dataSource.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => onSelectDataSource(dataSource)}
            whileHover={{ scale: 1.005 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getDataSourceIcon(dataSource.type)}
                <span className="text-xs font-medium text-gray-900 truncate">
                  {dataSource.name}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {dataSource.connected ? (
                  <FiCheck className="w-3 h-3 text-green-500" />
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTestConnection(dataSource);
                    }}
                    className="p-0.5 text-gray-400 hover:text-gray-600"
                    title="Test Connection"
                  >
                    <FiRefreshCw className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              {dataSource.type.toUpperCase()}
            </div>
            
            {/* Show schema info if available */}
            {dataSourceSchemas[dataSource.id] && (
              <div className="mt-1 text-[10px] text-gray-600">
                {dataSourceSchemas[dataSource.id].tables.length} tables
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Selected Data Source Details */}
      {selectedDataSource ? (
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-gray-900">Selected: {selectedDataSource.name}</h5>
          <motion.div 
            className="p-2 border border-gray-200 rounded-md bg-white shadow-sm"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiDatabase className="text-blue-600 w-4 h-4" />
                <div className="font-medium text-xs">{selectedDataSource.name}</div>
              </div>
              <button
                onClick={() => onRefreshSchema(selectedDataSource)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                title="Refresh Schema"
              >
                <FiRefreshCw className="w-3 h-3" />
              </button>
            </div>
            
            {dataSourceSchemas[selectedDataSource.id] && dataSourceSchemas[selectedDataSource.id].tables.length > 0 ? (
              <div className="space-y-1">
                <div className="text-[10px] text-gray-500">
                  {dataSourceSchemas[selectedDataSource.id].tables.length} table(s) available
                </div>
                <div className="max-h-32 overflow-y-auto">
                  {dataSourceSchemas[selectedDataSource.id].tables.map(table => (
                    <motion.div 
                      key={table.name} 
                      className="p-1.5 text-[10px] border-t border-gray-100 hover:bg-blue-50 transition-colors rounded"
                      whileHover={{ scale: 1.005 }}
                    >
                      <div className="font-medium text-[10px]">{table.name}</div>
                      <div className="text-gray-500 text-[9px]">{table.columns.length} columns</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-gray-500">No schema available</div>
            )}
          </motion.div>
          
          <div className="text-[10px] text-center text-gray-500 p-2 bg-blue-50 rounded-md border border-blue-100">
            <FiMousePointer className="inline-block mr-1 w-3 h-3" />
            Drag fields from data sources into your form components
          </div>
        </div>
      ) : (
        <motion.div 
          className="text-center py-6 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <FiDatabase className="w-6 h-6 mx-auto mb-2 opacity-50" />
          <p className="text-xs">No data source selected</p>
          <p className="text-[10px] mt-2">Add or select a data source to get started</p>
        </motion.div>
      )}
    </motion.div>
  );
}
