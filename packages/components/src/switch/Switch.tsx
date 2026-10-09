import { forwardRef } from 'react';
import { cn } from '@reef-ui/utils';
import type { SwitchProps } from './types';
import './switch.css';

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, disabled = false, className, onChange, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={cn('reef-switch', { 'reef-switch--on': checked }, className)}
        onClick={(e) => onChange?.(!checked, e)}
        {...rest}
      >
        <span className="reef-switch__thumb" aria-hidden="true" />
      </button>
    );
  },
);

Switch.displayName = 'Switch';
