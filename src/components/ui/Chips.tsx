import React from 'react';
import { ChipsConfig } from '@/lib/types/form';

interface ChipsProps {
  config: ChipsConfig;
}

const Chips: React.FC<ChipsProps> = ({ config }) => {
  const { items, selectable = false, selected = [], onSelectionChange, variant = 'default' } = config;

  const handleChipClick = (item: any) => {
    if (!selectable || !onSelectionChange) return;

    const isSelected = selected.includes(item.id);
    const newSelected = isSelected
      ? selected.filter(id => id !== item.id)
      : [...selected, item.id];

    onSelectionChange(newSelected);
  };

  const handleRemove = (item: any) => {
    if (item.onRemove) {
      item.onRemove();
    }
  };

  const getVariantClasses = (isSelected: boolean) => {
    if (isSelected) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    
    switch (variant) {
      case 'outlined':
        return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
      case 'filled':
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const baseClasses = "flex flex-wrap gap-2";
  const classes = config.className 
    ? `${baseClasses} ${config.className}` 
    : baseClasses;

  return (
    <div className={classes} style={config.style}>
      {items?.map((item) => {
        const isSelected = selected.includes(item.id);
        const chipClasses = `inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
          selectable ? 'cursor-pointer' : ''
        } ${getVariantClasses(isSelected)}`;

        return (
          <div
            key={item.id}
            className={chipClasses}
            onClick={() => handleChipClick(item)}
          >
            <span>{item.label}</span>
            {item.removable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(item);
                }}
                className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Chips;

// Example usage:
/*
const chipsConfig: ChipsConfig = {
  id: 'category-chips',
  type: 'chips',
  items: [
    { id: '1', label: 'React', removable: true },
    { id: '2', label: 'JavaScript', removable: true },
    { id: '3', label: 'TypeScript', removable: true },
    { id: '4', label: 'CSS', removable: true },
  ],
  selectable: true,
  selected: ['1', '3'],
  onSelectionChange: (selected) => console.log('Selected:', selected),
  variant: 'outlined',
  className: 'mb-4',
};

<Chips config={chipsConfig} />
*/
