import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { SegmentedProps } from './types';
import './segmented.css';

export function Segmented({ options, value, defaultValue, onChange, className }: SegmentedProps) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value !== undefined ? value : inner;

  return (
    <div role="radiogroup" className={cn('reef-segmented', className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === current}
          className="reef-segmented__option"
          onClick={() => {
            if (value === undefined) setInner(opt.value);
            onChange?.(opt.value);
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
