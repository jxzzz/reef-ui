import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import { RadioGroupContext } from './context';
import type { RadioGroupProps } from './types';

export function RadioGroup({ name, value, defaultValue, onChange, disabled, className, children }: RadioGroupProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;

  const onSelect = (next: string) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  return (
    <div className={cn('reef-radiogroup', className)} role="radiogroup">
      <RadioGroupContext.Provider value={{ name, value: current, disabled, onSelect }}>
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
}
