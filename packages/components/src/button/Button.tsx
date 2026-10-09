import { forwardRef } from 'react';
import { cn } from '@reef-ui/utils';
import type { ButtonProps } from './types';
import './button.css';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading = false,
      block = false,
      icon,
      type = 'button',
      className,
      children,
      disabled,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'reef-button',
          `reef-button--${variant}`,
          `reef-button--${size}`,
          {
            'reef-button--block': block,
            'reef-button--loading': loading,
          },
          className,
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading ? (
          <span className="reef-button__spinner" aria-hidden="true" />
        ) : icon ? (
          <span className="reef-button__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
