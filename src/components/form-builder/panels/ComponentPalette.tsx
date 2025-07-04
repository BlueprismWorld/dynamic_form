'use client';

import React, { useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { 
  FiType, 
  FiMail, 
  FiLock, 
  FiCalendar, 
  FiClock, 
  FiHash, 
  FiAlignLeft, 
  FiList, 
  FiCheckSquare, 
  FiCircle, 
  FiUpload, 
  FiMousePointer,
  FiToggleLeft,
  FiStar,
  FiSliders,
  FiNavigation,
  FiGrid,
  FiColumns,
  FiLayers,
  FiSearch,
  FiFilter,
  FiLayout,
  FiBox,
  FiTable,
  FiImage,
  FiFileText,
  FiPieChart,
  FiBarChart,
  FiTrendingUp,
  FiDatabase,
  FiPackage,
  FiPlus,
  FiSettings,
  FiCheck,
  FiX,
  FiRefreshCw
} from 'react-icons/fi';
import { SiSupabase } from 'react-icons/si';
import { DataSource, DataSourceSchema, SupabaseConfig, RestApiConfig, SoapApiConfig } from '../../../lib/types/datasource';

interface ComponentPaletteProps {
  selectedDataSource?: DataSource;
  dataSourceSchema?: DataSourceSchema;
  // Add props for data source management
  dataSources?: DataSource[];
  dataSourceSchemas?: Record<string, DataSourceSchema>;
  onAddDataSource?: (dataSource: DataSource) => void;
  onSelectDataSource?: (dataSource: DataSource) => void;
  onUpdateSchema?: (dataSourceId: string, schema: DataSourceSchema) => void;
}

// Use our local ComponentTemplate interface to extend the one from datasource.ts
interface LocalComponentTemplate {
  id: string;
  type: string;
  title: string; // Use title instead of label for display
  icon: React.ComponentType<any>;
  description: string;
  category: string;
  defaultProps: Record<string, any>;
  dataBindable?: boolean;
}

interface ComponentCategory {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  components: LocalComponentTemplate[];
}

// Tabs for main sections
enum PaletteTab {
  TOOLBOX = 'toolbox',
  SOURCES = 'sources'
}

// Define our component templates
const componentCategories: ComponentCategory[] = [
  {
    id: 'input',
    title: 'Input Elements',
    icon: FiType,
    components: [
      {
        id: 'text-input',
        type: 'text',
        title: 'Text Input',
        icon: FiType,
        description: 'Single line text input',
        category: 'input',
        defaultProps: {
          label: 'Text Field',
          placeholder: 'Enter text...',
          name: 'textField',
          required: false
        },
        dataBindable: true
      },
      {
        id: 'email-input',
        type: 'email',
        title: 'Email Input',
        icon: FiMail,
        description: 'Email address input',
        category: 'input',
        defaultProps: {
          label: 'Email',
          placeholder: 'Enter email...',
          name: 'email',
          required: false
        },
        dataBindable: true
      },
      {
        id: 'password-input',
        type: 'password',
        title: 'Password Input',
        icon: FiLock,
        description: 'Password input field',
        category: 'input',
        defaultProps: {
          label: 'Password',
          placeholder: 'Enter password...',
          name: 'password',
          required: false
        },
        dataBindable: false
      },
      {
        id: 'number-input',
        type: 'number',
        title: 'Number Input',
        icon: FiHash,
        description: 'Numeric input field',
        category: 'input',
        defaultProps: {
          label: 'Number',
          placeholder: 'Enter number...',
          name: 'number',
          required: false
        },
        dataBindable: true
      },
      {
        id: 'date-input',
        type: 'date',
        title: 'Date Input',
        icon: FiCalendar,
        description: 'Date picker input',
        category: 'input',
        defaultProps: {
          label: 'Date',
          name: 'date',
          required: false
        },
        dataBindable: true
      },
      {
        id: 'time-input',
        type: 'time',
        title: 'Time Input',
        icon: FiClock,
        description: 'Time picker input',
        category: 'input',
        defaultProps: {
          label: 'Time',
          name: 'time',
          required: false
        },
        dataBindable: true
      },
      {
        id: 'textarea',
        type: 'textarea',
        title: 'Textarea',
        icon: FiAlignLeft,
        description: 'Multi-line text input',
        category: 'input',
        defaultProps: {
          label: 'Description',
          placeholder: 'Enter description...',
          name: 'description',
          rows: 3,
          required: false
        },
        dataBindable: true
      }
    ]
  },
  {
    id: 'selection',
    title: 'Selection Elements',
    icon: FiList,
    components: [
      {
        id: 'select',
        type: 'select',
        title: 'Select Dropdown',
        icon: FiList,
        description: 'Dropdown selection',
        category: 'input',
        defaultProps: {
          label: 'Select Option',
          name: 'select',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ],
          required: false
        },
        dataBindable: true
      },
      {
        id: 'radio',
        type: 'radio',
        title: 'Radio Group',
        icon: FiCircle,
        description: 'Radio button group',
        category: 'input',
        defaultProps: {
          label: 'Choose Option',
          name: 'radio',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ],
          required: false
        },
        dataBindable: true
      },
      {
        id: 'checkbox',
        type: 'checkbox',
        title: 'Checkbox Group',
        icon: FiCheckSquare,
        description: 'Checkbox selection',
        category: 'input',
        defaultProps: {
          label: 'Select Options',
          name: 'checkbox',
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ],
          required: false
        },
        dataBindable: true
      },
      {
        id: 'toggle',
        type: 'toggle',
        title: 'Toggle Switch',
        icon: FiToggleLeft,
        description: 'Toggle switch element',
        category: 'input',
        defaultProps: {
          label: 'Enable Feature',
          name: 'toggle',
          required: false
        },
        dataBindable: true
      }
    ]
  },
  {
    id: 'display',
    title: 'Display Elements',
    icon: FiLayout,
    components: [
      {
        id: 'heading',
        type: 'heading',
        title: 'Heading',
        icon: FiType,
        description: 'Text heading element',
        category: 'display',
        defaultProps: {
          text: 'Heading Text',
          level: 'h2',
          className: 'text-2xl font-bold'
        },
        dataBindable: true
      },
      {
        id: 'text',
        type: 'text',
        title: 'Text Block',
        icon: FiFileText,
        description: 'Static text content',
        category: 'display',
        defaultProps: {
          text: 'This is a text block.',
          className: 'text-gray-700'
        },
        dataBindable: true
      },
      {
        id: 'divider',
        type: 'divider',
        title: 'Divider',
        icon: FiGrid,
        description: 'Horizontal divider line',
        category: 'display',
        defaultProps: {
          className: 'border-t border-gray-200 my-4'
        },
        dataBindable: false
      },
      {
        id: 'spacer',
        type: 'spacer',
        title: 'Spacer',
        icon: FiBox,
        description: 'Empty space element',
        category: 'display',
        defaultProps: {
          height: 20
        },
        dataBindable: false
      },
      {
        id: 'image',
        type: 'image',
        title: 'Image',
        icon: FiImage,
        description: 'Image display element',
        category: 'display',
        defaultProps: {
          src: 'https://via.placeholder.com/300x200',
          alt: 'Placeholder image',
          className: 'rounded-lg'
        },
        dataBindable: true
      }
    ]
  },
  {
    id: 'interactive',
    title: 'Interactive Elements',
    icon: FiMousePointer,
    components: [
      {
        id: 'button',
        type: 'button',
        title: 'Button',
        icon: FiMousePointer,
        description: 'Action button',
        category: 'layout',
        defaultProps: {
          label: 'Click Me',
          variant: 'primary',
          size: 'md',
          buttonType: 'button'
        },
        dataBindable: false
      },
      {
        id: 'file-upload',
        type: 'file',
        title: 'File Upload',
        icon: FiUpload,
        description: 'File upload input',
        category: 'input',
        defaultProps: {
          label: 'Upload File',
          name: 'file',
          accept: '*',
          multiple: false,
          required: false
        },
        dataBindable: false
      },
      {
        id: 'rating',
        type: 'rating',
        title: 'Star Rating',
        icon: FiStar,
        description: 'Star rating component',
        category: 'input',
        defaultProps: {
          label: 'Rate this',
          name: 'rating',
          max: 5,
          required: false
        },
        dataBindable: true
      },
      {
        id: 'slider',
        type: 'slider',
        title: 'Range Slider',
        icon: FiSliders,
        description: 'Range slider input',
        category: 'input',
        defaultProps: {
          label: 'Select Value',
          name: 'slider',
          min: 0,
          max: 100,
          step: 1,
          required: false
        },
        dataBindable: true
      }
    ]
  },
  {
    id: 'layout',
    title: 'Layout Elements',
    icon: FiColumns,
    components: [
      {
        id: 'container',
        type: 'container',
        title: 'Container',
        icon: FiBox,
        description: 'Generic container',
        category: 'layout',
        defaultProps: {
          className: 'p-4 border border-gray-200 rounded-lg',
          children: []
        },
        dataBindable: false
      },
      {
        id: 'grid',
        type: 'grid',
        title: 'Grid Layout',
        icon: FiGrid,
        description: 'Grid layout container',
        category: 'layout',
        defaultProps: {
          columns: 2,
          gap: 4,
          className: 'grid gap-4',
          children: []
        },
        dataBindable: false
      },
      {
        id: 'columns',
        type: 'columns',
        title: 'Columns',
        icon: FiColumns,
        description: 'Column layout',
        category: 'layout',
        defaultProps: {
          columns: [
            { width: '50%', children: [] },
            { width: '50%', children: [] }
          ]
        },
        dataBindable: false
      },
      {
        id: 'accordion',
        type: 'accordion',
        title: 'Accordion',
        icon: FiLayers,
        description: 'Collapsible content sections',
        category: 'layout',
        defaultProps: {
          panels: [
            {
              id: 'panel1',
              title: 'Section 1',
              content: 'Content for section 1',
              isOpen: false
            },
            {
              id: 'panel2',
              title: 'Section 2',
              content: 'Content for section 2',
              isOpen: false
            }
          ]
        },
        dataBindable: false
      }
    ]
  },
  {
    id: 'data',
    title: 'Data Elements',
    icon: FiTable,
    components: [
      {
        id: 'table',
        type: 'table',
        title: 'Data Table',
        icon: FiTable,
        description: 'Data table display',
        category: 'data',
        defaultProps: {
          columns: [
            { key: 'name', title: 'Name' },
            { key: 'email', title: 'Email' },
            { key: 'status', title: 'Status' }
          ],
          data: [],
          pagination: true,
          pageSize: 10
        },
        dataBindable: true
      },
      {
        id: 'chart',
        type: 'chart',
        title: 'Chart',
        icon: FiBarChart,
        description: 'Data visualization chart',
        category: 'data',
        defaultProps: {
          type: 'bar',
          data: [],
          title: 'Chart Title',
          width: '100%',
          height: 300
        },
        dataBindable: true
      },
      {
        id: 'metric',
        type: 'metric',
        title: 'Metric Display',
        icon: FiTrendingUp,
        description: 'Key metric display',
        category: 'data',
        defaultProps: {
          label: 'Total Users',
          value: '1,234',
          trend: '+12%',
          trendType: 'positive'
        },
        dataBindable: true
      }
    ]
  }
];

interface DraggableComponentProps {
  template: LocalComponentTemplate;
  isSelected?: boolean;
  showCategoryBelow?: boolean; // Added for showing category name below the component
  categoryTitle?: string;      // Category title to display
}

// Enhanced DraggableComponent with animation and feedback
function DraggableComponent({ 
  template, 
  isSelected, 
  showCategoryBelow = false,
  categoryTitle
}: DraggableComponentProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: template.id,
    data: {
      type: 'template',
      template: template,
    },
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  const IconComponent = template.icon;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative p-2 border border-gray-200 rounded-sm cursor-grab active:cursor-grabbing
        hover:border-blue-300 hover:bg-blue-50 transition-all
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'bg-white'}
        hover:shadow-sm flex items-center min-h-[36px] w-full
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-2 w-full">
        <IconComponent className="w-4 h-4 text-gray-600 flex-shrink-0" />
        <div className="text-xs font-medium text-gray-900 leading-tight truncate">
          {template.title}
        </div>
      </div>
      {template.dataBindable && (
        <motion.div 
          className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full" 
          title="Data bindable" 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}

export function ComponentPalette({ 
  selectedDataSource, 
  dataSourceSchema,
  dataSources = [],
  dataSourceSchemas = {},
  onAddDataSource,
  onSelectDataSource,
  onUpdateSchema
}: ComponentPaletteProps) {
  // State for search only - no category selection needed
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for active main tab (Toolbox or Sources)
  const [activeTab, setActiveTab] = useState<PaletteTab>(PaletteTab.TOOLBOX);

  // State for data source management
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDataSource, setNewDataSource] = useState<Partial<DataSource>>({
    name: '',
    type: 'supabase',
    config: {} as any,
    connected: false
  });

  // Helper functions for data source management
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

  const handleAddDataSource = () => {
    if (newDataSource.name && newDataSource.type && newDataSource.config && onAddDataSource) {
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

  const testConnection = async (dataSource: DataSource) => {
    if (!onUpdateSchema) return;
    
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

  // Filter components based on search term
  const filteredComponents = useMemo(() => {
    if (!searchTerm) {
      return componentCategories;
    }

    return componentCategories.map(category => ({
      ...category,
      components: category.components.filter(
        component =>
          component.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          component.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.components.length > 0);
  }, [searchTerm]);

  // Animation variants for tab content
  const tabContentVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border border-gray-200 rounded-lg">
      {/* Main Content - Top */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header with Search */}
        <div className="p-3 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">
              {activeTab === PaletteTab.TOOLBOX ? 'Components' : 'Data Sources'}
            </h3>
          </div>
          
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={activeTab === PaletteTab.TOOLBOX ? "Search components..." : "Search data sources..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content Area */}
        {activeTab === PaletteTab.TOOLBOX && (
          <motion.div 
            className="flex-1 overflow-y-auto p-3 bg-gray-50 min-h-0"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.2 }}
          >
            {filteredComponents.map((category) => (
              <div key={category.id} className="mb-4">
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-2">
                  <category.icon className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-semibold text-gray-900">{category.title}</h4>
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-xs text-gray-500">{category.components.length}</span>
                </div>
                
                {/* Components Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {category.components.map((component) => (
                    <DraggableComponent
                      key={component.id}
                      template={component}
                      showCategoryBelow={false}
                    />
                  ))}
                </div>
              </div>
            ))}

            {filteredComponents.length === 0 && (
              <motion.div 
                className="text-center py-8 text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <FiFilter className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">No components found</p>
                {searchTerm && (
                  <p className="text-xs">Try adjusting your search term</p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Data Sources Tab Content */}
        {activeTab === PaletteTab.SOURCES && (
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
                onClick={() => setShowAddForm(true)}
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
                  onClick={() => onSelectDataSource?.(dataSource)}
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
                            testConnection(dataSource);
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
                  <div className="flex items-center gap-2 mb-2">
                    <FiDatabase className="text-blue-600 w-4 h-4" />
                    <div className="font-medium text-xs">{selectedDataSource.name}</div>
                  </div>
                  
                  {dataSourceSchema && dataSourceSchema.tables.length > 0 ? (
                    <div className="space-y-1">
                      <div className="text-[10px] text-gray-500">
                        {dataSourceSchema.tables.length} table(s) available
                      </div>
                      <div className="max-h-32 overflow-y-auto">
                        {dataSourceSchema.tables.map(table => (
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
        )}

        {/* Add Data Source Modal */}
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

      {/* Bottom Tabs */}
      <div className="h-14 bg-gray-100 border-t border-gray-200 flex flex-shrink-0">
        {/* Main tabs (Toolbox/Sources) */}
        <div className="flex w-full">
          <motion.button
            onClick={() => setActiveTab(PaletteTab.TOOLBOX)}
            className={`
              flex flex-col items-center justify-center p-2 flex-1
              ${activeTab === PaletteTab.TOOLBOX 
                ? 'bg-white border-t-2 border-blue-500' 
                : 'hover:bg-gray-200'}
              transition-colors
            `}
            whileHover={{ backgroundColor: activeTab === PaletteTab.TOOLBOX ? '#fff' : '#e5e7eb' }}
            whileTap={{ scale: 0.95 }}
            title="Toolbox"
          >
            <FiPackage className={`w-5 h-5 ${activeTab === PaletteTab.TOOLBOX ? 'text-blue-600' : 'text-gray-600'}`} />
            <span className="text-xs mt-1 leading-none">Toolbox</span>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab(PaletteTab.SOURCES)}
            className={`
              flex flex-col items-center justify-center p-2 flex-1
              ${activeTab === PaletteTab.SOURCES 
                ? 'bg-white border-t-2 border-blue-500' 
                : 'hover:bg-gray-200'}
              transition-colors
            `}
            whileHover={{ backgroundColor: activeTab === PaletteTab.SOURCES ? '#fff' : '#e5e7eb' }}
            whileTap={{ scale: 0.95 }}
            title="Sources"
          >
            <FiDatabase className={`w-5 h-5 ${activeTab === PaletteTab.SOURCES ? 'text-blue-600' : 'text-gray-600'}`} />
            <span className="text-xs mt-1 leading-none">Sources</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
