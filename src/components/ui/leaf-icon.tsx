import React from 'react';
import { cn } from '@/lib/utils';

interface LeafIconProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
  color?: 'primary' | 'green' | 'accent';
}

export const LeafIcon: React.FC<LeafIconProps> = ({ 
  size = 'md', 
  className,
  animated = false,
  color = 'green'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      case 'md':
      default:
        return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-primary';
      case 'accent':
        return 'text-herb-soft-sage';
      case 'green':
      default:
        return 'text-herb-bright-green';
    }
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(
        getSizeClasses(),
        getColorClasses(),
        animated && 'hover:animate-leaf-sway',
        'transition-colors duration-200',
        className
      )}
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.06.82C6.16 17.4 9 14 17 14V8zm-5.36 10.64C10.75 17.75 10 16.5 10 15c0-1.5.75-2.75 1.64-3.64L17 6l-4.36 12.64z"/>
    </svg>
  );
};

export default LeafIcon;