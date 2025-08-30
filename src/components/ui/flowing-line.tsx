import React from 'react';
import { cn } from '@/lib/utils';

interface FlowingLineProps {
  variant?: 'horizontal' | 'vertical' | 'curved';
  className?: string;
  color?: 'primary' | 'sage' | 'muted';
  animated?: boolean;
}

export const FlowingLine: React.FC<FlowingLineProps> = ({ 
  variant = 'horizontal',
  className,
  color = 'sage',
  animated = false
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'stroke-primary';
      case 'muted':
        return 'stroke-muted-foreground/30';
      case 'sage':
      default:
        return 'stroke-herb-soft-sage';
    }
  };

  if (variant === 'horizontal') {
    return (
      <svg
        viewBox="0 0 200 8"
        className={cn(
          'w-full h-2',
          getColorClasses(),
          animated && 'animate-pulse',
          className
        )}
      >
        <path
          d="M0,4 Q50,1 100,4 T200,4"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === 'curved') {
    return (
      <svg
        viewBox="0 0 100 100"
        className={cn(
          'w-12 h-12',
          getColorClasses(),
          animated && 'animate-pulse',
          className
        )}
      >
        <path
          d="M10,50 Q30,10 50,50 T90,50"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 8 200"
      className={cn(
        'w-2 h-full',
        getColorClasses(),
        animated && 'animate-pulse',
        className
      )}
    >
      <path
        d="M4,0 Q1,50 4,100 T4,200"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default FlowingLine;