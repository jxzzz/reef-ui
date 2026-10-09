import { forwardRef, useContext, type ChangeEvent } from 'react';
import { cn } from '@reef-ui/utils';
import { RadioGroupContext } from './context';
import type { RadioProps } from './types';
import './radio.css';

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ disabled, className, children, onChange, ...rest }, ref) => {
    const group = useContext(RadioGroupContext);
    const isDisabled = disabled ?? group?.disabled;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      group?.onSelect(e.target.value);
      onChange?.(e);
    };

    return (
      <label className={cn('reef-radio', isDisabled && 'reef-radio--disabled', className)}>
        <input
          ref={ref}
          type="radio"
          className="reef-radio__native"
          {...rest}
          name={group?.name ?? rest.name}
          checked={group ? group.value === rest.value : undefined}
          disabled={isDisabled}
          onChange={handleChange}
        />
        <span className="reef-radio__dot" aria-hidden="true" />
        {children != null && <span className="reef-radio__label">{children}</span>}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
