import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = '7xl',
  padding = 'md',
}: ResponsiveContainerProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-2 sm:p-3',
    md: 'p-3 sm:p-4',
    lg: 'p-4 sm:p-6',
    xl: 'p-5 sm:p-8',
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div 
      className={cn(
        'w-full mx-auto',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function ResponsiveGrid({
  children,
  className = '',
  cols = 1,
  gap = 'md',
  responsive = true,
}: {
  children: ReactNode;
  className?: string;
  cols?: number | { sm?: number; md: number; lg?: number; xl?: number };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}) {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4',
    lg: 'gap-4 sm:gap-6',
    xl: 'gap-6 sm:gap-8',
  };

  const getGridCols = () => {
    if (typeof cols === 'number') {
      return {
        sm: Math.min(2, cols),
        md: Math.min(3, cols),
        lg: cols,
        xl: cols,
      };
    }
    return {
      sm: cols.sm || 1,
      md: cols.md,
      lg: cols.lg || cols.md,
      xl: cols.xl || cols.lg || cols.md,
    };
  };

  const gridCols = getGridCols();

  return (
    <div
      className={cn(
        'grid w-full',
        gapClasses[gap],
        responsive ? 'grid-cols-1' : 'grid-cols-1',
        responsive && {
          [`sm:grid-cols-${gridCols.sm}`]: gridCols.sm > 1,
          [`md:grid-cols-${gridCols.md}`]: true,
          [`lg:grid-cols-${gridCols.lg}`]: gridCols.lg !== gridCols.md,
          [`xl:grid-cols-${gridCols.xl}`]: gridCols.xl !== gridCols.lg,
        },
        className
      )}
    >
      {children}
    </div>
  );
}
