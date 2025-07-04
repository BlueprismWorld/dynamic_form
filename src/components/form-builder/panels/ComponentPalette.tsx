'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiPackage, FiDatabase, FiCode } from 'react-icons/fi';
import { DataSource, DataSourceSchema } from '../../../lib/types/datasource';
import { PaletteTab } from './ComponentTemplateData';
import { ToolboxTab } from './ToolboxTab';
import { DataSourcesTab } from './DataSourcesTab';
import { AddDataSourceModal } from './AddDataSourceModal';
import { DataBindingPanel } from './DataBindingPanel';

interface ComponentPaletteProps {
  selectedDataSource?: DataSource | undefined;
  dataSourceSchema?: DataSourceSchema;
  dataSources?: DataSource[];
  dataSourceSchemas?: Record<string, DataSourceSchema>;
  onAddDataSource?: (dataSource: DataSource) => void;
  onSelectDataSource?: (dataSource: DataSource) => void;
  onUpdateSchema?: (dataSourceId: string, schema: DataSourceSchema) => void;
  onGenerateFormSchema?: (formSchema: any) => void;
}

export function ComponentPalette({ 
  selectedDataSource, 
  dataSourceSchema,
  dataSources = [],
  dataSourceSchemas = {},
  onAddDataSource,
  onSelectDataSource,
  onUpdateSchema,
  onGenerateFormSchema
}: ComponentPaletteProps) {
  // State for search only
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for active main tab (Toolbox or Sources)
  const [activeTab, setActiveTab] = useState<PaletteTab>(PaletteTab.TOOLBOX);

  // State for data source management
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>('');

  const handleGenerateSchema = (config: any) => {
    // Import the FormSchemaGenerator and generate schema
    import('../../../lib/utils/schema-generator').then(({ FormSchemaGenerator }) => {
      const formSchema = FormSchemaGenerator.generateFromDataSource(config);
      onGenerateFormSchema?.(formSchema);
      
      // Also download the JSON file
      FormSchemaGenerator.exportToFile(formSchema, `${config.formConfig.title.replace(/\s+/g, '-').toLowerCase()}-schema`);
    });
  };

  const testConnection = async (dataSource: DataSource) => {
    if (!onUpdateSchema) return;
    
    try {
      const { createDataSourceConnection } = await import('../../../lib/utils/data-source-connection');
      const connection = createDataSourceConnection(dataSource);
      const isConnected = await connection.testConnection();
      
      if (isConnected) {
        const schema = await connection.fetchSchema();
        onUpdateSchema(dataSource.id, schema);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };

  const refreshSchema = async (dataSource: DataSource) => {
    if (!onUpdateSchema) return;
    
    try {
      const { createDataSourceConnection } = await import('../../../lib/utils/data-source-connection');
      const connection = createDataSourceConnection(dataSource);
      const schema = await connection.fetchSchema();
      onUpdateSchema(dataSource.id, schema);
    } catch (error) {
      console.error('Schema refresh failed:', error);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border border-gray-200 rounded-lg">
      {/* Main Content - Top */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header with Search */}
        <div className="p-2 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">
              {activeTab === PaletteTab.TOOLBOX ? 'Components' : 
               activeTab === PaletteTab.SOURCES ? 'Data Sources' : 'Schema Generator'}
            </h3>
          </div>
          
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={activeTab === PaletteTab.TOOLBOX ? "Search components..." : 
                          activeTab === PaletteTab.SOURCES ? "Search data sources..." : "Search tables..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content Area */}
        {activeTab === PaletteTab.TOOLBOX && (
          <ToolboxTab searchTerm={searchTerm} />
        )}

        {/* Data Sources Tab Content */}
        {activeTab === PaletteTab.SOURCES && (
          <DataSourcesTab
            dataSources={dataSources}
            dataSourceSchemas={dataSourceSchemas}
            selectedDataSource={selectedDataSource}
            onAddDataSource={() => setShowAddForm(true)}
            onSelectDataSource={onSelectDataSource!}
            onTestConnection={testConnection}
            onRefreshSchema={refreshSchema}
          />
        )}

        {/* Schema Generator Tab Content */}
        {activeTab === PaletteTab.GENERATOR && (
          <DataBindingPanel
            selectedDataSource={selectedDataSource}
            dataSourceSchema={selectedDataSource ? dataSourceSchemas[selectedDataSource.id] : undefined}
            selectedTable={selectedTable}
            onTableSelect={(tableName: string) => setSelectedTable(tableName)}
            onGenerateSchema={handleGenerateSchema}
          />
        )}

        {/* Add Data Source Modal */}
        <AddDataSourceModal
          showModal={showAddForm}
          onClose={() => setShowAddForm(false)}
          onAdd={(dataSource) => {
            onAddDataSource?.(dataSource);
            setShowAddForm(false);
          }}
        />
      </div>

      {/* Bottom Tabs */}
      <div className="h-10 bg-gray-100 border-t border-gray-200 flex flex-shrink-0">
        {/* Main tabs (Toolbox/Sources/Generator) */}
        <div className="flex w-full">
          <motion.button
            onClick={() => setActiveTab(PaletteTab.TOOLBOX)}
            className={`
              flex flex-col items-center justify-center p-1 flex-1
              ${activeTab === PaletteTab.TOOLBOX 
                ? 'bg-white border-t-2 border-blue-500' 
                : 'hover:bg-gray-200'}
              transition-colors
            `}
            whileHover={{ backgroundColor: activeTab === PaletteTab.TOOLBOX ? '#fff' : '#e5e7eb' }}
            whileTap={{ scale: 0.95 }}
            title="Toolbox"
          >
            <FiPackage className={`w-3 h-3 ${activeTab === PaletteTab.TOOLBOX ? 'text-blue-600' : 'text-gray-600'}`} />
            <span className="text-xs mt-1 leading-none">Toolbox</span>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab(PaletteTab.SOURCES)}
            className={`
              flex flex-col items-center justify-center p-1 flex-1
              ${activeTab === PaletteTab.SOURCES 
                ? 'bg-white border-t-2 border-blue-500' 
                : 'hover:bg-gray-200'}
              transition-colors
            `}
            whileHover={{ backgroundColor: activeTab === PaletteTab.SOURCES ? '#fff' : '#e5e7eb' }}
            whileTap={{ scale: 0.95 }}
            title="Sources"
          >
            <FiDatabase className={`w-3 h-3 ${activeTab === PaletteTab.SOURCES ? 'text-blue-600' : 'text-gray-600'}`} />
            <span className="text-xs mt-1 leading-none">Sources</span>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab(PaletteTab.GENERATOR)}
            className={`
              flex flex-col items-center justify-center p-1 flex-1
              ${activeTab === PaletteTab.GENERATOR 
                ? 'bg-white border-t-2 border-blue-500' 
                : 'hover:bg-gray-200'}
              transition-colors
            `}
            whileHover={{ backgroundColor: activeTab === PaletteTab.GENERATOR ? '#fff' : '#e5e7eb' }}
            whileTap={{ scale: 0.95 }}
            title="Generator"
          >
            <FiCode className={`w-3 h-3 ${activeTab === PaletteTab.GENERATOR ? 'text-blue-600' : 'text-gray-600'}`} />
            <span className="text-xs mt-1 leading-none">Generator</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
