import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiFilter } from 'react-icons/fi';
import { DraggableComponent } from './DraggableComponent';
import { componentCategories } from './ComponentTemplateData';

interface ToolboxTabProps {
  searchTerm: string;
}

export function ToolboxTab({ searchTerm }: ToolboxTabProps) {
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
  );
}
