'use client';

import React, { useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiTrash2, FiEdit2, FiMove, FiPlus, FiSettings } from 'react-icons/fi';
import { ComponentConfig } from '../../../lib/types/form';

interface CanvasAreaProps {
  components: ComponentConfig[];
  selectedComponentIndex: number | null;
  onSelectComponent: (component: ComponentConfig, index: number) => void;
  onUpdateComponent: (index: number, updates: Partial<ComponentConfig>) => void;
  onRemoveComponent: (index: number) => void;
  isDragActive?: boolean;
  dragSourceType?: string; // 'component' for sorting, 'template' for new components
}

interface SortableComponentProps {
  component: ComponentConfig;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function SortableComponent({ component, index, isSelected, onSelect, onRemove }: SortableComponentProps) {
  // Custom animation function to control layout animations
  const customAnimateLayoutChanges: AnimateLayoutChanges = (args) => {
    // Default behavior: always animate
    return true;
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: component.id,
    data: {
      type: 'component',
      component,
      index,
    },
    animateLayoutChanges: customAnimateLayoutChanges,
  });

  // Create base transform
  let transformString = CSS.Transform.toString(transform);
  
  // Add scale effect if dragging
  if (isDragging && transform) {
    transformString = transformString?.replace(/translate/, 'scale(1.02) translate') || 'scale(1.02)';
  }
  
  const style: React.CSSProperties = {
    transform: transformString,
    transition: transition || undefined, // Ensure transition is defined
    opacity: isDragging ? 0.6 : 1, // Make the dragged item slightly transparent
    zIndex: isDragging ? 1000 : 'auto',
    position: 'relative',
    pointerEvents: isDragging ? 'none' : 'auto', // Prevent interactions during drag
  };

  const renderComponentPreview = () => {
    // Use type assertion for extended properties
    const componentAny = component as any;
    const componentType = component.type as string;
    
    switch (componentType) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'date':
      case 'time':
        return (
          <div className="space-y-1">
            {componentAny.label && (
              <label className="block text-xs font-medium text-gray-700">
                {componentAny.label}
                {componentAny.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <input
              type={componentType}
              placeholder={componentAny.placeholder}
              disabled
              className="block w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-1">
            {componentAny.label && (
              <label className="block text-xs font-medium text-gray-700">
                {componentAny.label}
                {componentAny.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <textarea
              placeholder={componentAny.placeholder}
              rows={2}
              disabled
              className="block w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 text-gray-500 cursor-not-allowed resize-none"
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-1">
            {componentAny.label && (
              <label className="block text-xs font-medium text-gray-700">
                {componentAny.label}
                {componentAny.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <select
              disabled
              className="block w-full px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 text-gray-500 cursor-not-allowed"
            >
              <option>Select an option...</option>
              {componentAny.options?.slice(0, 2).map((option: any, idx: number) => (
                <option key={idx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-1">
            {componentAny.label && (
              <label className="block text-xs font-medium text-gray-700">
                {componentAny.label}
                {componentAny.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-1">
              {componentAny.options?.slice(0, 2).map((option: any, idx: number) => (
                <label key={idx} className="flex items-center">
                  <input
                    type="radio"
                    name={componentAny.name}
                    value={option.value}
                    disabled
                    className="mr-2 text-blue-600 cursor-not-allowed"
                  />
                  <span className="text-xs text-gray-500">{option.label}</span>
                </label>
              ))}
              {componentAny.options?.length > 2 && (
                <span className="text-xs text-gray-400">...and {componentAny.options.length - 2} more</span>
              )}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-1">
            {componentAny.label && (
              <label className="block text-xs font-medium text-gray-700">
                {componentAny.label}
                {componentAny.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="space-y-1">
              {componentAny.options?.slice(0, 2).map((option: any, idx: number) => (
                <label key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option.value}
                    disabled
                    className="mr-2 text-blue-600 cursor-not-allowed"
                  />
                  <span className="text-xs text-gray-500">{option.label}</span>
                </label>
              ))}
              {componentAny.options?.length > 2 && (
                <span className="text-xs text-gray-400">...and {componentAny.options.length - 2} more</span>
              )}
            </div>
          </div>
        );

      case 'button':
        return (
          <button
            type="button"
            disabled
            className={`px-3 py-1 rounded text-xs cursor-not-allowed ${
              componentAny.variant === 'primary' ? 'bg-blue-200 text-blue-800' :
              componentAny.variant === 'secondary' ? 'bg-gray-200 text-gray-800' :
              componentAny.variant === 'danger' ? 'bg-red-200 text-red-800' :
              'bg-gray-200 text-gray-800'
            }`}
          >
            {componentAny.label || 'Button'}
          </button>
        );

      case 'file':
        return (
          <div className="space-y-1">
            {componentAny.label && (
              <label className="block text-xs font-medium text-gray-700">
                {componentAny.label}
                {componentAny.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            <div className="flex items-center">
              <input
                type="file"
                accept={componentAny.accept}
                multiple={componentAny.multiple}
                disabled
                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-not-allowed"
              />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {componentAny.columns?.slice(0, 3).map((col: any, idx: number) => (
                    <th
                      key={idx}
                      className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col.title}
                    </th>
                  ))}
                  {componentAny.columns?.length > 3 && (
                    <th className="px-3 py-1 text-left text-xs font-medium text-gray-400">
                      ...
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  {componentAny.columns?.slice(0, 3).map((col: any, idx: number) => (
                    <td key={idx} className="px-3 py-1 whitespace-nowrap text-xs text-gray-500">
                      Sample
                    </td>
                  ))}
                  {componentAny.columns?.length > 3 && (
                    <td className="px-3 py-1 whitespace-nowrap text-xs text-gray-400">
                      ...
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        );

      // Handle custom component types
      case 'heading':
        const HeadingTag = (componentAny.level || 'h2') as keyof JSX.IntrinsicElements;
        return React.createElement(
          HeadingTag,
          { className: `font-bold ${componentAny.className || ''}` },
          componentAny.text || 'Heading'
        );

      case 'divider':
        return (
          <hr className={`border-t border-gray-200 ${componentAny.className || ''}`} />
        );

      case 'spacer':
        return (
          <div
            className={`bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center ${componentAny.className || ''}`}
            style={{ height: Math.min(componentAny.height || 20, 30) }}
          >
            <span className="text-xs text-gray-400">Spacer ({componentAny.height || 20}px)</span>
          </div>
        );

      case 'image':
        return (
          <div className="text-center">
            <img
              src={componentAny.src}
              alt={componentAny.alt || 'Image'}
              className={`max-w-full h-auto max-h-16 ${componentAny.className || ''}`}
            />
          </div>
        );

      default:
        return (
          <div className="p-2 bg-gray-100 border-2 border-dashed border-gray-300 rounded text-center">
            <span className="text-xs text-gray-500">
              {componentType} component
            </span>
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative group p-2 border rounded-lg transition-all duration-200 cursor-grab active:cursor-grabbing overflow-hidden
        ${isSelected 
          ? 'border-blue-400 bg-blue-50 shadow-lg ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
        }
      `}
      onClick={onSelect}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          onRemove();
        }
      }}
      aria-label={`${component.type} component`}
      role="button"
    >
      {/* Component Preview */}
      <div className="text-sm">
        {renderComponentPreview()}
      </div>

      {/* Hover/Selected Actions */}
      <div className={`
        absolute top-1 right-1 flex items-center gap-1 transition-opacity z-10
        ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
      `}>
        <div
          className="p-1 bg-white/90 backdrop-blur-sm border border-gray-300 rounded hover:bg-gray-50 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-blue-500 pointer-events-none shadow-sm"
          title="Drag to reorder"
          aria-label="Drag to reorder component"
        >
          <FiMove className="w-3 h-3 text-gray-600" />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 bg-white/90 backdrop-blur-sm border border-gray-300 rounded hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
          title="Remove component"
          aria-label="Remove component"
        >
          <FiTrash2 className="w-3 h-3 text-red-600" />
        </button>
      </div>

      {/* Component Type Badge */}
      <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <span className="px-1.5 py-0.5 bg-gray-900/80 backdrop-blur-sm text-white text-xs rounded shadow-sm font-medium">
          {component.type}
        </span>
      </div>
    </div>
  );
}

function EmptyCanvasDropZone() {
  const { isOver, setNodeRef } = useDroppable({
    id: 'empty-canvas',
    data: {
      type: 'canvas',
      index: 0,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[200px] rounded-lg flex items-center justify-center transition-all duration-200
        ${isOver 
          ? 'bg-blue-50 border border-blue-300 border-dashed scale-[1.01] shadow-sm' 
          : 'bg-gray-50/50 border border-gray-200 border-dashed hover:border-blue-200 hover:bg-blue-50/30'
        }
      `}
    >
      <div className="text-center">
        <FiPlus className={`w-6 h-6 mx-auto mb-2 transition-colors ${isOver ? 'text-blue-500' : 'text-gray-400'}`} />
        <h4 className={`text-sm font-medium mb-1 transition-colors ${isOver ? 'text-blue-700' : 'text-gray-700'}`}>
          {isOver ? 'Drop component here' : 'Start building your form'}
        </h4>
        <p className={`text-xs mb-2 transition-colors ${isOver ? 'text-blue-600' : 'text-gray-500'}`}>
          {isOver ? 'Release to add component' : 'Drag components from the toolbox to get started'}
        </p>
        <div className={`inline-flex items-center gap-1 text-xs transition-colors ${isOver ? 'text-blue-600' : 'text-gray-500'}`}>
          <FiMove className="w-3 h-3" />
          <span>{isOver ? 'Release to add' : 'Drag & drop components here'}</span>
        </div>
      </div>
    </div>
  );
}

function CanvasDropZone() {
  const { isOver, setNodeRef, active } = useDroppable({
    id: 'canvas-drop-zone',
    data: {
      type: 'canvas',
      index: 0, // This will be updated by the FormBuilder to append at the end
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[30px] rounded-md flex items-center justify-center transition-all duration-200 mt-2
        ${isOver 
          ? 'bg-blue-50 border border-blue-300 border-dashed scale-[1.02] shadow-sm' 
          : 'bg-gray-50/50 border border-gray-200 border-dashed hover:border-blue-200 hover:bg-blue-50/30'
        }
      `}
    >
      <div className="text-center">
        <FiPlus className={`w-3 h-3 mx-auto mb-1 transition-colors ${isOver ? 'text-blue-500' : 'text-gray-400'}`} />
        <p className={`text-xs transition-colors ${isOver ? 'text-blue-700 font-medium' : 'text-gray-500'}`}>
          {isOver ? 'Drop component here' : 'Add more components'}
        </p>
      </div>
    </div>
  );
}

export function CanvasArea({
  components,
  selectedComponentIndex,
  onSelectComponent,
  onUpdateComponent,
  onRemoveComponent,
  isDragActive = false,
  dragSourceType,
}: CanvasAreaProps) {
  // Determine if we're sorting existing components or dragging from palette
  const isSorting = isDragActive && dragSourceType === 'component';
  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Canvas Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-semibold text-gray-900">Form Canvas</h3>
              {isDragActive && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                  <FiMove className="w-3 h-3" />
                  <span>{isSorting ? "Reordering..." : "Adding component..."}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {components.length} component{components.length !== 1 ? 's' : ''} • Design your form layout
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <FiSettings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="w-full max-w-none">
          {/* Form Preview Container */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm min-h-[300px] overflow-hidden">
            <div className="p-4 relative">
              {components.length === 0 ? (
                <EmptyCanvasDropZone />
              ) : (
                <div>
                  <SortableContext 
                    items={components.map(c => c.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {components.map((component, index) => (
                        <SortableComponent
                          key={component.id}
                          component={component}
                          index={index}
                          isSelected={selectedComponentIndex === index}
                          onSelect={() => onSelectComponent(component, index)}
                          onRemove={() => onRemoveComponent(index)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  {/* Drop zone for adding new components at the end - only show when not sorting components */}
                  {(!isDragActive || !isSorting) && <CanvasDropZone />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
