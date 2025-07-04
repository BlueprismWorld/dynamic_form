import React, { useState, useRef } from 'react';
import { TooltipConfig } from '@/lib/types/form';
import { ComponentRenderer } from '@/components/core/ComponentRenderer';

interface TooltipProps {
  config: TooltipConfig;
}

const Tooltip: React.FC<TooltipProps> = ({ config }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const { content, children, position: preferredPosition = 'top', trigger = 'hover' } = config;

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let top = 0;
    let left = 0;

    switch (preferredPosition) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + 8;
        break;
    }

    setPosition({ top, left });
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsVisible(true);
      setTimeout(calculatePosition, 0);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
      if (!isVisible) {
        setTimeout(calculatePosition, 0);
      }
    }
  };

  const getArrowClasses = () => {
    const baseArrow = 'absolute w-2 h-2 bg-gray-800 transform rotate-45';
    switch (preferredPosition) {
      case 'top':
        return `${baseArrow} top-full left-1/2 -translate-x-1/2 -translate-y-1/2`;
      case 'bottom':
        return `${baseArrow} bottom-full left-1/2 -translate-x-1/2 translate-y-1/2`;
      case 'left':
        return `${baseArrow} left-full top-1/2 -translate-y-1/2 -translate-x-1/2`;
      case 'right':
        return `${baseArrow} right-full top-1/2 -translate-y-1/2 translate-x-1/2`;
      default:
        return baseArrow;
    }
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="cursor-pointer"
      >
        <ComponentRenderer config={children} />
      </div>

      {isVisible && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsVisible(false)}
          />
          <div
            ref={tooltipRef}
            className="fixed z-20 px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg shadow-lg max-w-xs"
            style={{
              top: position.top,
              left: position.left,
              ...config.style,
            }}
          >
            {content}
            <div className={getArrowClasses()} />
          </div>
        </>
      )}
    </div>
  );
};

export default Tooltip;

// Example usage:
/*
const tooltipConfig: TooltipConfig = {
  id: 'help-tooltip',
  type: 'tooltip',
  content: 'This is a helpful tooltip message that provides additional information.',
  position: 'top',
  trigger: 'hover',
  children: {
    id: 'tooltip-trigger',
    type: 'button',
    label: 'Hover me',
    variant: 'secondary',
  },
  className: 'inline-block',
};

<Tooltip config={tooltipConfig} />
*/
