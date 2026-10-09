import { forwardRef } from 'react';
import { cn } from '@reef-ui/utils';
import type { CheckboxProps } from './types';
import './checkbox.css';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ indeterminate = false, block = false, className, children, ...rest }, ref) => {
    return (
      <label
        className={cn('reef-checkbox', { 'reef-checkbox--block': block }, className)}
      >
        <input
          ref={ref}
          type="checkbox"
          className="reef-checkbox__native"
          data-indeterminate={indeterminate || undefined}
          {...rest}
        />
        <span className="reef-checkbox__box" aria-hidden="true">
          <svg
            className="reef-checkbox__mark"
            viewBox="0 0 12 12"
            width="10"
            height="10"
            fill="none"
          >
            <path
              className="reef-checkbox__mark-check"
              d="M2 6.5 5 9.5 10 3"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              className="reef-checkbox__mark-dash"
              d="M2 6h8"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        {children}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
