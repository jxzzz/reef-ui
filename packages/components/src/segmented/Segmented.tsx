import { useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cn } from '@reef-ui/utils';
import type { SegmentedProps } from './types';
import './segmented.css';

export function Segmented({ options, value, defaultValue, onChange, className }: SegmentedProps) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value !== undefined ? value : inner;

  const select = (val: string | number) => {
    if (value === undefined) setInner(val);
    onChange?.(val);
  };

  // radiogroup 惯例：方向键移动并选中，循环；焦点跟随选中项（roving tabindex）
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowDown' && e.key !== 'ArrowLeft' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const idx = options.findIndex((opt) => opt.value === current);
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const next = options[(idx + delta + options.length) % options.length];
    if (!next) return;
    select(next.value);
    e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[options.indexOf(next)]?.focus();
  };

  return (
    <div role="radiogroup" className={cn('reef-segmented', className)} onKeyDown={handleKeyDown}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === current}
          tabIndex={opt.value === current ? 0 : -1}
          className="reef-segmented__option"
          onClick={() => select(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
