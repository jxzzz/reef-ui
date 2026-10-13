import { forwardRef } from 'react';
import { cn } from '@reef-ui/utils';
import { HiddenField } from '../internal/hidden-field';
import type { SwitchProps } from './types';
import './switch.css';

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, disabled = false, name, className, onChange, ...rest }, ref) => {
    return (
      <>
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
        {/* 未开启时提交空值，与原生 checkbox 的「未勾选不提交」语义对齐 */}
        <HiddenField name={name} value={checked ? 'true' : ''} />
      </>
    );
  },
);

Switch.displayName = 'Switch';
