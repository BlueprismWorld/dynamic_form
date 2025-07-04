import React from 'react';
import { BreadcrumbsConfig } from '@/lib/types/form';

interface BreadcrumbsProps {
  config: BreadcrumbsConfig;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ config }) => {
  const { items, separator = '/', maxItems } = config;

  const displayItems = maxItems && items.length > maxItems
    ? [
        ...items.slice(0, 1),
        { label: '...', href: '#' },
        ...items.slice(-(maxItems - 2))
      ]
    : items;

  const baseClasses = "flex items-center space-x-1 text-sm text-gray-600";
  const classes = config.className 
    ? `${baseClasses} ${config.className}` 
    : baseClasses;

  return (
    <nav className={classes} style={config.style}>
      <ol className="flex items-center space-x-1">
        {displayItems?.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">{separator}</span>
            )}
            {item.href ? (
              <a
                href={item.href}
                onClick={item.onClick}
                className={`hover:text-blue-600 transition-colors ${
                  item.current ? 'text-blue-600 font-medium' : 'text-gray-600'
                }`}
              >
                {item.label}
              </a>
            ) : (
              <span
                onClick={item.onClick}
                className={`${
                  item.current ? 'text-blue-600 font-medium' : 'text-gray-600'
                } ${item.onClick ? 'cursor-pointer hover:text-blue-600' : ''}`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

// Example usage:
/*
const breadcrumbsConfig: BreadcrumbsConfig = {
  id: 'page-breadcrumbs',
  type: 'breadcrumbs',
  items: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptops', current: true },
  ],
  separator: '>',
  maxItems: 4,
  className: 'mb-4',
};

<Breadcrumbs config={breadcrumbsConfig} />
*/
