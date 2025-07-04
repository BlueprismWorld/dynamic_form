import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { LocalComponentTemplate } from './ComponentTemplateData';

interface DraggableComponentProps {
  template: LocalComponentTemplate;
  isSelected?: boolean;
  showCategoryBelow?: boolean;
  categoryTitle?: string;
}

export function DraggableComponent({ 
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
