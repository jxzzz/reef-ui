import { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Input } from '../input';
import type { AutoCompleteOption, AutoCompleteProps } from './types';
import './auto-complete.css';

const toOption = (o: AutoCompleteOption) => (typeof o === 'string' ? { label: o, value: o } : o);

export const AutoComplete = forwardRef<HTMLDivElement, AutoCompleteProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      placeholder,
      disabled = false,
      filter = true,
      className,
      ...rest
    },
    ref,
  ) => {
    const [inner, setInner] = useState(defaultValue ?? '');
    const [active, setActive] = useState(-1);
    const [dismissed, setDismissed] = useState(false); // Escape/选中/点外后收起，输入时复位
    const rootRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // 支持受控 / 非受控两种用法
    const current = value !== undefined ? value : inner;
    const normalized = options.map(toOption);
    const visible =
      filter && current
        ? normalized.filter((o) => o.label.toLowerCase().includes(current.toLowerCase()))
        : normalized;
    const open = !disabled && !dismissed && current.length > 0 && visible.length > 0;

    const commit = (next: string) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDismissed(false);
      setActive(-1);
      commit(e.currentTarget.value);
    };

    const pick = (v: string) => {
      commit(v);
      setDismissed(true);
      setActive(-1);
      inputRef.current?.focus();
    };

    // 点击外部关闭
    useEffect(() => {
      if (!open) return;
      const onDoc = (e: MouseEvent) => {
        if (!rootRef.current?.contains(e.target as Node)) setDismissed(true);
      };
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }, [open]);

    useEffect(() => {
      if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
    }, [open, active]);

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          if (!open) break;
          e.preventDefault();
          setActive((a) => Math.min(Math.max(a + (e.key === 'ArrowDown' ? 1 : -1), 0), visible.length - 1));
          break;
        case 'Enter':
          if (open && active >= 0) {
            e.preventDefault();
            pick(visible[active].value);
          }
          break;
        case 'Escape':
          // ponytail: 仅收起面板，不回退输入内容；需要“取消并还原上次选中值”再加
          setDismissed(true);
          break;
      }
    };

    const setRoot = (el: HTMLDivElement | null) => {
      rootRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as { current: HTMLDivElement | null }).current = el;
    };

    return (
      <div ref={setRoot} className={cn('reef-autocomplete', className)} {...rest}>
        <div className="reef-autocomplete__input">
          <Input
            ref={inputRef}
            value={current}
            placeholder={placeholder}
            disabled={disabled}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            onChange={handleInput}
            onKeyDown={onKeyDown}
          />
        </div>
        {open && (
          <div className="reef-autocomplete__panel">
            <ul ref={listRef} className="reef-autocomplete__list" role="listbox" tabIndex={-1}>
              {visible.map((o, i) => (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={o.value === current || undefined}
                  className={cn('reef-autocomplete__option', {
                    'reef-autocomplete__option--active': i === active,
                  })}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(o.value)}
                >
                  {o.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
);

AutoComplete.displayName = 'AutoComplete';
