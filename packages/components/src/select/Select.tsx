import { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { SelectProps } from './types';
import './select.css';

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      placeholder = '请选择',
      disabled = false,
      size = 'medium',
      invalid = false,
      block = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [inner, setInner] = useState(defaultValue);
    const [active, setActive] = useState(-1);
    const rootRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // 支持受控 / 非受控两种用法
    const current = value !== undefined ? value : inner;
    const selected = options.find((o) => o.value === current);

    const pick = (v: string) => {
      const opt = options.find((o) => o.value === v);
      if (!opt || opt.disabled) return;
      if (value === undefined) setInner(v);
      onChange?.(v);
      setOpen(false);
      (ref as React.RefObject<HTMLButtonElement | null>).current?.focus();
    };

    // 点击外部关闭
    useEffect(() => {
      if (!open) return;
      const onDoc = (e: MouseEvent) => {
        if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }, [open]);

    // 打开时定位到已选项
    useEffect(() => {
      if (!open) return;
      const i = options.findIndex((o) => o.value === current);
      setActive(i >= 0 ? i : 0);
      // ponytail: 依赖只取 open，current/options 变化不重定位
    }, [open]);

    useEffect(() => {
      if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
    }, [open, active]);

    const move = (delta: number) => {
      setActive((a) => Math.min(Math.max(a + delta, 0), options.length - 1));
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (open && active >= 0) pick(options[active].value);
          else setOpen(true);
          break;
        case 'Escape':
          setOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (open) move(1);
          else setOpen(true);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (open) move(-1);
          else setOpen(true);
          break;
      }
    };

    return (
      <div
        ref={rootRef}
        className={cn('reef-select', { 'reef-select--block': block }, className)}
        {...rest}
      >
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'reef-select__trigger',
            `reef-select__trigger--${size}`,
            {
              'reef-select__trigger--open': open,
              'reef-select__trigger--invalid': invalid,
            },
          )}
          onClick={() => setOpen(!open)}
          onKeyDown={onKeyDown}
        >
          <span className={cn('reef-select__value', !selected && 'reef-select__value--placeholder')}>
            {selected ? selected.label : placeholder}
          </span>
          <svg
            className={cn('reef-select__arrow', { 'reef-select__arrow--open': open })}
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <ul ref={listRef} className="reef-select__list" role="listbox" tabIndex={-1}>
            {options.map((o, i) => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === current}
                aria-disabled={o.disabled || undefined}
                className={cn('reef-select__option', {
                  'reef-select__option--active': i === active,
                  'reef-select__option--selected': o.value === current,
                })}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(o.value)}
              >
                {o.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
