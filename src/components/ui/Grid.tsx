import React from 'react';
import { GridConfig } from '@/lib/types/form';
import { ComponentRenderer } from '@/components/core/ComponentRenderer';

interface GridProps {
  config: GridConfig;
}

const Grid: React.FC<GridProps> = ({ config }) => {
  const { columns = 1, gap = '1rem', children } = config;

  const getGridClasses = () => {
    if (typeof columns === 'number') {
      const colsClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        7: 'grid-cols-7',
        8: 'grid-cols-8',
        9: 'grid-cols-9',
        10: 'grid-cols-10',
        11: 'grid-cols-11',
        12: 'grid-cols-12',
      }[columns] || 'grid-cols-1';
      
      return `grid ${colsClass}`;
    }
    
    return 'grid';
  };

  const getGapClasses = () => {
    if (typeof gap === 'string') {
      const gapMap: Record<string, string> = {
        '0': 'gap-0',
        '0.5rem': 'gap-2',
        '1rem': 'gap-4',
        '1.5rem': 'gap-6',
        '2rem': 'gap-8',
        '2.5rem': 'gap-10',
        '3rem': 'gap-12',
      };
      return gapMap[gap] || 'gap-4';
    }
    
    return 'gap-4';
  };

  const baseClasses = `${getGridClasses()} ${getGapClasses()}`;
  const classes = config.className 
    ? `${baseClasses} ${config.className}` 
    : baseClasses;

  const gridStyle = {
    ...(typeof columns === 'string' && { gridTemplateColumns: columns }),
    ...(typeof gap === 'number' && { gap: `${gap}px` }),
    ...config.style,
  };

  return (
    <div className={classes} style={gridStyle}>
      {children?.map((child, index) => (
        <div key={child.id || index} className="grid-item">
          <ComponentRenderer config={child} />
        </div>
      ))}
    </div>
  );
};

export default Grid;

// Example usage:
/*
const gridConfig: GridConfig = {
  id: 'main-grid',
  type: 'grid',
  columns: 3,
  gap: '1rem',
  children: [
    {
      id: 'card-1',
      type: 'card',
      header: 'Card 1',
      content: 'This is the content of card 1.',
    },
    {
      id: 'card-2',
      type: 'card',
      header: 'Card 2',
      content: 'This is the content of card 2.',
    },
    {
      id: 'card-3',
      type: 'card',
      header: 'Card 3',
      content: 'This is the content of card 3.',
    },
  ],
  className: 'mb-8',
};

<Grid config={gridConfig} />
*/
