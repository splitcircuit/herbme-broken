import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import herbmeLogo from '@/assets/herbme-logo.png';

interface AnimatedLogoProps {
  variant?: 'navigation' | 'hero' | 'footer' | 'compact';
  className?: string;
  showAnimation?: boolean;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  variant = 'navigation', 
  className,
  showAnimation = true 
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLogoSize = () => {
    switch (variant) {
      case 'hero':
        return 'h-16 md:h-20 lg:h-24';
      case 'footer':
        return 'h-12 md:h-16';
      case 'compact':
        return 'h-8 md:h-10';
      case 'navigation':
      default:
        // Responsive to scroll for navigation
        const scale = Math.max(0.8, 1 - scrollY * 0.0005);
        return `h-8 md:h-10 transition-transform duration-300`;
    }
  };

  const getAnimationClasses = () => {
    if (!showAnimation) return '';
    
    switch (variant) {
      case 'hero':
        return 'animate-logo-glow hover:animate-leaf-sway';
      case 'footer':
        return 'hover:animate-leaf-sway';
      case 'navigation':
        return 'hover:animate-leaf-sway transition-all duration-300';
      default:
        return 'hover:animate-leaf-bounce';
    }
  };

  const logoStyle = variant === 'navigation' ? {
    transform: `scale(${Math.max(0.8, 1 - scrollY * 0.0005)})`
  } : {};

  return (
    <div 
      className={cn(
        "flex items-center transition-all duration-300",
        getAnimationClasses(),
        className
      )}
      style={logoStyle}
    >
      <img 
        src={herbmeLogo} 
        alt="HerbMe - Natural Skincare" 
        className={cn(
          "object-contain transition-all duration-300",
          getLogoSize()
        )}
      />
    </div>
  );
};

export default AnimatedLogo;