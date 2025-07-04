'use client';

import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { ComponentConfig, 
  FormSchema,
  GridConfig,
  TextInputConfig,
  TextareaConfig,
  SelectConfig,
  RadioConfig,
  CheckboxConfig,
  FileConfig,
  ButtonConfig,
  TabsConfig,
  StepperConfig,
  AccordionConfig,
  CardConfig,
  ModalConfig,
  TableConfig,
  ProgressBarConfig,
  NotificationConfig,
  BadgeConfig,
  BreadcrumbsConfig,
  ChipsConfig,
  TooltipConfig
} from '../../lib/types/form';
import { DataSource, DataSourceSchema, ComponentTemplate } from '../../lib/types/datasource';
import { ComponentPalette } from './panels/ComponentPalette';
import { CanvasArea } from './canvas/CanvasArea';
import { PropertiesPanel } from './panels/PropertiesPanel';
import { ToolbarActions } from './toolbar/ToolbarActions';

interface FormBuilderProps {
  onSave?: (schema: FormSchema) => void;
  onPreview?: (schema: FormSchema) => void;
  initialSchema?: FormSchema;
}

export function FormBuilder({ onSave, onPreview, initialSchema }: FormBuilderProps) {
  // Form Builder State
  const [formSchema, setFormSchema] = useState<FormSchema>(initialSchema || {
    title: 'New Form',
    description: 'Form created with Form Builder',
    components: [],
    initialValues: {}
  });

  const [selectedComponent, setSelectedComponent] = useState<ComponentConfig | null>(null);
  const [selectedComponentIndex, setSelectedComponentIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{ type: string; data: any } | null>(null);
  const [sortingAnnouncement, setSortingAnnouncement] = useState<string>('');
  
  // Data Source State
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  // Use undefined instead of null to match expected prop types
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | undefined>(undefined);
  const [dataSourceSchemas, setDataSourceSchemas] = useState<Record<string, DataSourceSchema>>({})

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Canvas Operations
  const addComponent = useCallback((componentTemplate: ComponentTemplate, index?: number) => {
    const baseProps = {
      id: `${componentTemplate.type}-${Date.now()}`,
      type: componentTemplate.type,
      ...componentTemplate.defaultProps,
    };

    // Ensure component has all required properties based on its type
    let newComponent: ComponentConfig;
    
    switch (componentTemplate.type) {
      case 'grid':
        newComponent = {
          ...baseProps,
          type: 'grid',
          columns: componentTemplate.defaultProps?.columns || 1,
          children: componentTemplate.defaultProps?.children || [],
        } as GridConfig;
        break;
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'date':
      case 'time':
      case 'datetime-local':
        newComponent = {
          ...baseProps,
          type: componentTemplate.type,
          name: componentTemplate.defaultProps?.name || `field-${Date.now()}`,
          label: componentTemplate.defaultProps?.label || 'Field',
        } as TextInputConfig;
        break;
      case 'textarea':
        newComponent = {
          ...baseProps,
          type: 'textarea',
          name: componentTemplate.defaultProps?.name || `field-${Date.now()}`,
          label: componentTemplate.defaultProps?.label || 'Field',
        } as TextareaConfig;
        break;
      case 'select':
        newComponent = {
          ...baseProps,
          type: 'select',
          name: componentTemplate.defaultProps?.name || `field-${Date.now()}`,
          label: componentTemplate.defaultProps?.label || 'Field',
          options: componentTemplate.defaultProps?.options || [],
        } as SelectConfig;
        break;
      case 'radio':
        newComponent = {
          ...baseProps,
          type: 'radio',
          name: componentTemplate.defaultProps?.name || `field-${Date.now()}`,
          label: componentTemplate.defaultProps?.label || 'Field',
          options: componentTemplate.defaultProps?.options || [],
        } as RadioConfig;
        break;
      case 'checkbox':
        newComponent = {
          ...baseProps,
          type: 'checkbox',
          name: componentTemplate.defaultProps?.name || `field-${Date.now()}`,
          label: componentTemplate.defaultProps?.label || 'Field',
        } as CheckboxConfig;
        break;
      case 'file':
        newComponent = {
          ...baseProps,
          type: 'file',
          name: componentTemplate.defaultProps?.name || `field-${Date.now()}`,
          label: componentTemplate.defaultProps?.label || 'Field',
        } as FileConfig;
        break;
      case 'button':
        newComponent = {
          ...baseProps,
          type: 'button',
          label: componentTemplate.defaultProps?.label || 'Button',
        } as ButtonConfig;
        break;
      case 'tabs':
        newComponent = {
          ...baseProps,
          type: 'tabs',
          tabs: componentTemplate.defaultProps?.tabs || [],
        } as TabsConfig;
        break;
      case 'stepper':
        newComponent = {
          ...baseProps,
          type: 'stepper',
          steps: componentTemplate.defaultProps?.steps || [],
          currentStep: componentTemplate.defaultProps?.currentStep || 0,
        } as StepperConfig;
        break;
      case 'accordion':
        newComponent = {
          ...baseProps,
          type: 'accordion',
          panels: componentTemplate.defaultProps?.panels || [],
        } as AccordionConfig;
        break;
      case 'card':
        newComponent = {
          ...baseProps,
          type: 'card',
          content: componentTemplate.defaultProps?.content || [],
        } as CardConfig;
        break;
      case 'modal':
        newComponent = {
          ...baseProps,
          type: 'modal',
          trigger: componentTemplate.defaultProps?.trigger || { id: 'trigger', type: 'button', label: 'Open Modal' } as ButtonConfig,
          content: componentTemplate.defaultProps?.content || [],
        } as ModalConfig;
        break;
      case 'table':
        newComponent = {
          ...baseProps,
          type: 'table',
          columns: componentTemplate.defaultProps?.columns || [],
          data: componentTemplate.defaultProps?.data || [],
        } as TableConfig;
        break;
      case 'progress-bar':
        newComponent = {
          ...baseProps,
          type: 'progress-bar',
          value: componentTemplate.defaultProps?.value || 0,
        } as ProgressBarConfig;
        break;
      case 'notification':
        newComponent = {
          ...baseProps,
          type: 'notification',
          message: componentTemplate.defaultProps?.message || 'Notification message',
          variant: componentTemplate.defaultProps?.variant || 'info',
        } as NotificationConfig;
        break;
      case 'badge':
        newComponent = {
          ...baseProps,
          type: 'badge',
          text: componentTemplate.defaultProps?.text || 'Badge',
        } as BadgeConfig;
        break;
      case 'breadcrumbs':
        newComponent = {
          ...baseProps,
          type: 'breadcrumbs',
          items: componentTemplate.defaultProps?.items || [],
        } as BreadcrumbsConfig;
        break;
      case 'chips':
        newComponent = {
          ...baseProps,
          type: 'chips',
          items: componentTemplate.defaultProps?.items || [],
        } as ChipsConfig;
        break;
      case 'tooltip':
        newComponent = {
          ...baseProps,
          type: 'tooltip',
          content: componentTemplate.defaultProps?.content || 'Tooltip content',
          children: componentTemplate.defaultProps?.children || { id: 'child', type: 'button', label: 'Hover me' } as ButtonConfig,
        } as TooltipConfig;
        break;
      default:
        // Fallback for unknown component types
        newComponent = {
          ...baseProps,
          type: componentTemplate.type,
        } as ComponentConfig;
    }

    setFormSchema(prev => {
      const newComponents = [...prev.components];
      if (index !== undefined) {
        newComponents.splice(index, 0, newComponent);
      } else {
        newComponents.push(newComponent);
      }
      return {
        ...prev,
        components: newComponents
      };
    });

    // Auto-select the newly added component
    const finalIndex = index !== undefined ? index : formSchema.components.length;
    setSelectedComponent(newComponent);
    setSelectedComponentIndex(finalIndex);
  }, [formSchema.components.length]);

  const updateComponent = useCallback((index: number, updates: Record<string, any>) => {
    setFormSchema(prev => ({
      ...prev,
      components: prev.components.map((comp, i) => 
        i === index ? { ...comp, ...updates } : comp
      )
    }));
  }, []);

  const removeComponent = useCallback((index: number) => {
    setFormSchema(prev => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index)
    }));
    
    if (selectedComponentIndex === index) {
      setSelectedComponent(null);
      setSelectedComponentIndex(null);
    }
  }, [selectedComponentIndex]);

  const selectComponent = useCallback((component: ComponentConfig, index: number) => {
    setSelectedComponent(component);
    setSelectedComponentIndex(index);
  }, []);

  // Data Source Operations
  const addDataSource = useCallback((dataSource: DataSource) => {
    setDataSources(prev => [...prev, dataSource]);
  }, []);

  const selectDataSource = useCallback((dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
  }, []);

  const updateDataSourceSchema = useCallback((dataSourceId: string, schema: DataSourceSchema) => {
    setDataSourceSchemas(prev => ({
      ...prev,
      [dataSourceId]: schema
    }));
  }, []);

  // Form Operations
  const updateFormDetails = useCallback((updates: Partial<FormSchema>) => {
    setFormSchema(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSave = useCallback(() => {
    onSave?.(formSchema);
  }, [formSchema, onSave]);

  const handlePreview = useCallback(() => {
    onPreview?.(formSchema);
  }, [formSchema, onPreview]);

  const exportJSON = useCallback(() => {
    const jsonString = JSON.stringify(formSchema, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(formSchema.title || 'untitled-form').replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [formSchema]);

  // Custom collision detection for better drop zone handling
  const customCollisionDetection = useCallback((args: any) => {
    const { active, droppableContainers } = args;
    
    // First check for canvas drop zones
    const canvasDropZones = droppableContainers.filter(
      (container: any) => container.data.current?.type === 'canvas'
    );
    
    if (canvasDropZones.length > 0) {
      const canvasCollisions = closestCorners({
        ...args,
        droppableContainers: canvasDropZones,
      });
      
      if (canvasCollisions.length > 0) {
        return canvasCollisions;
      }
    }
    
    // Fallback to default collision detection for components
    return closestCenter(args);
  }, []);

  // DnD Event Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    
    // Capture the dragged item data for the overlay
    const activeData = event.active.data.current;
    if (activeData) {
      if (activeData.type === 'component') {
        setDraggedItem({
          type: 'component',
          data: activeData.component
        });
        setSortingAnnouncement(`Started dragging ${activeData.component.type} component`);
      } else if (activeData.type === 'template') {
        setDraggedItem({
          type: 'template',
          data: activeData.template
        });
        setSortingAnnouncement(`Started dragging new ${activeData.template.type} component`);
      }
    }
  };

  // Add a drag over handler to improve drop zone highlighting
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    // Ensure we have both active and over elements
    if (!active || !over) return;
    
    // Debug info to help track drag operations
    console.log('Drag over:', { 
      activeId: active.id, 
      activeType: active.data.current?.type,
      overId: over.id,
      overType: over.data.current?.type
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedItem(null);

    // Exit if no over target
    if (!over) {
      setSortingAnnouncement('Drag cancelled');
      setTimeout(() => setSortingAnnouncement(''), 1000);
      return;
    }

    console.log('Drag end:', { 
      activeId: active.id, 
      activeType: active.data.current?.type,
      overId: over.id,
      overType: over.data.current?.type
    });

    // Handle component reordering
    if (active.data.current?.type === 'component' && over.data.current?.type === 'component') {
      const activeIndex = formSchema.components.findIndex(c => c.id === active.id);
      const overIndex = formSchema.components.findIndex(c => c.id === over.id);

      if (activeIndex !== overIndex) {
        setFormSchema(prev => ({
          ...prev,
          components: arrayMove(prev.components, activeIndex, overIndex)
        }));
        
        setSortingAnnouncement(`Moved component from position ${activeIndex + 1} to position ${overIndex + 1}`);
        setTimeout(() => setSortingAnnouncement(''), 2000);
        
        // Update selected component index if it was the moved component
        if (selectedComponentIndex === activeIndex) {
          setSelectedComponentIndex(overIndex);
        } else if (selectedComponentIndex !== null) {
          // Adjust selected index if another component was moved
          if (activeIndex < selectedComponentIndex && overIndex >= selectedComponentIndex) {
            setSelectedComponentIndex(selectedComponentIndex - 1);
          } else if (activeIndex > selectedComponentIndex && overIndex <= selectedComponentIndex) {
            setSelectedComponentIndex(selectedComponentIndex + 1);
          }
        }
      }
    }

    // Handle dropping component on a drop zone (empty canvas)
    if (active.data.current?.type === 'component' && over.data.current?.type === 'canvas') {
      const activeIndex = formSchema.components.findIndex(c => c.id === active.id);
      const overIndex = over.data.current.index as number;
      
      if (activeIndex !== -1 && activeIndex !== overIndex && activeIndex !== overIndex - 1) {
        const insertIndex = activeIndex < overIndex ? overIndex - 1 : overIndex;
        
        setFormSchema(prev => ({
          ...prev,
          components: arrayMove(prev.components, activeIndex, insertIndex)
        }));
        
        setSortingAnnouncement(`Moved component from position ${activeIndex + 1} to position ${insertIndex + 1}`);
        setTimeout(() => setSortingAnnouncement(''), 2000);
        
        // Update selected component index if it was the moved component
        if (selectedComponentIndex === activeIndex) {
          setSelectedComponentIndex(insertIndex);
        } else if (selectedComponentIndex !== null) {
          // Adjust selected index if another component was moved
          if (activeIndex < selectedComponentIndex && insertIndex >= selectedComponentIndex) {
            setSelectedComponentIndex(selectedComponentIndex - 1);
          } else if (activeIndex > selectedComponentIndex && insertIndex <= selectedComponentIndex) {
            setSelectedComponentIndex(selectedComponentIndex + 1);
          }
        }
      }
    }

    // Handle adding new component from palette (including empty canvas)
    if (active.data.current?.type === 'template' && over.data.current?.type === 'canvas') {
      const template = active.data.current.template as ComponentTemplate;
      let dropIndex = over.data.current.index as number;
      
      // If dropping on the canvas-drop-zone, append at the end
      if (over.id === 'canvas-drop-zone') {
        dropIndex = formSchema.components.length;
      }
      
      addComponent(template, dropIndex);
      setSortingAnnouncement(`Added new ${template.type} component at position ${dropIndex + 1}`);
      setTimeout(() => setSortingAnnouncement(''), 2000);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Toolbar */}
        <ToolbarActions
          onSave={handleSave}
          onPreview={handlePreview}
          onExport={exportJSON}
          formSchema={formSchema}
          onUpdateForm={updateFormDetails}
        />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Components & Data Sources */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <ComponentPalette
                selectedDataSource={selectedDataSource}
                dataSourceSchema={selectedDataSource ? dataSourceSchemas[selectedDataSource.id] : undefined}
                dataSources={dataSources}
                dataSourceSchemas={dataSourceSchemas}
                onAddDataSource={addDataSource}
                onSelectDataSource={selectDataSource}
                onUpdateSchema={updateDataSourceSchema}
              />
            </div>
          </div>

          {/* Center Panel - Canvas */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <SortableContext 
              items={formSchema.components.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <CanvasArea
                components={formSchema.components}
                selectedComponentIndex={selectedComponentIndex}
                onSelectComponent={selectComponent}
                onUpdateComponent={updateComponent}
                onRemoveComponent={removeComponent}
                isDragActive={activeId !== null}
                dragSourceType={draggedItem?.type}
              />
            </SortableContext>
          </div>

          {/* Right Panel - Properties */}
          <div className="w-80 bg-white border-l border-gray-200">
            <PropertiesPanel
              selectedComponent={selectedComponent}
              selectedComponentIndex={selectedComponentIndex}
              dataSources={dataSources}
              dataSourceSchemas={dataSourceSchemas}
              onUpdateComponent={(updates: Record<string, any>) => {
                if (selectedComponentIndex !== null) {
                  updateComponent(selectedComponentIndex, updates);
                  setSelectedComponent(prev => prev ? { ...prev, ...updates } : null);
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Accessibility Announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {sortingAnnouncement}
      </div>
      
      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeId && draggedItem ? (
          <div className="bg-white border-2 border-blue-500 rounded-lg shadow-xl p-4 opacity-95 min-w-[200px]">
            {draggedItem.type === 'component' && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {draggedItem.data.type.replace('-', ' ')}
                  </span>
                  <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded">
                    Moving
                  </span>
                </div>
                {draggedItem.data.label && (
                  <div className="text-xs text-gray-600 font-medium">
                    "{draggedItem.data.label}"
                  </div>
                )}
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  ID: {draggedItem.data.id}
                </div>
              </div>
            )}
            {draggedItem.type === 'template' && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-600 capitalize">
                    {draggedItem.data.type.replace('-', ' ')}
                  </span>
                  <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded">
                    New
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {draggedItem.data.title}
                </div>
                <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                  {draggedItem.data.description}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
