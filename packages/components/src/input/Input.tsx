import { forwardRef } from 'react';
import { cn } from '@reef-ui/utils';
import type { InputProps } from './types';
import './input.css';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'medium', invalid = false, block = false, className, type = 'text', ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'reef-input',
          `reef-input--${size}`,
          {
            'reef-input--invalid': invalid,
            'reef-input--block': block,
          },
          className,
        )}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    );
  },
);

Input.displayName = 'Input';
