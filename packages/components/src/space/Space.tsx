import { forwardRef } from 'react';
import { cn } from '@reef-ui/utils';
import type { SpaceProps } from './types';
import './space.css';

const SIZE_GAP = {
  small: 'var(--reef-space-sm)',
  medium: 'var(--reef-space-lg)',
  large: 'var(--reef-space-xl)',
} as const;

export const Space = forwardRef<HTMLDivElement, SpaceProps>(
  ({ direction = 'horizontal', size = 'medium', wrap = false, align, style, className, children, ...rest }, ref) => {
    const gap = typeof size === 'number' ? `${size}px` : SIZE_GAP[size];
    return (
      <div
        ref={ref}
        className={cn(
          'reef-space',
          direction === 'vertical' && 'reef-space--vertical',
          wrap && 'reef-space--wrap',
          align && `reef-space--align-${align}`,
          className,
        )}
        style={{ ...style, gap }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Space.displayName = 'Space';
