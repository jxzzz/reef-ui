import { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { useLocale } from '../locale';
import { Tag } from '../tag';
import type { SelectProps } from './types';
import './select.css';

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      placeholder,
      disabled = false,
      size = 'medium',
      invalid = false,
      block = false,
      multiple = false,
      searchable = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const t = useLocale();
    const [open, setOpen] = useState(false);
    const [inner, setInner] = useState(defaultValue);
    const [active, setActive] = useState(-1);
    const [query, setQuery] = useState('');
    const rootRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // 支持受控 / 非受控两种用法
    const current = value !== undefined ? value : inner;
    const arr = multiple ? (Array.isArray(current) ? current : current ? [current] : []) : null;
    const selected = multiple ? undefined : options.find((o) => o.value === current);

    const visible =
      searchable && query
        ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
        : options;

    const commit = (next: string | string[]) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    };

    const pick = (v: string) => {
      const opt = options.find((o) => o.value === v);
      if (!opt || opt.disabled) return;
      if (multiple) {
        const list = arr ?? [];
        commit(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
      } else {
        commit(v);
        setOpen(false);
        setQuery('');
        (ref as React.RefObject<HTMLButtonElement | null> | null)?.current?.focus();
      }
    };

    const remove = (v: string, e: React.MouseEvent) => {
      e.stopPropagation(); // 阻止冒泡到触发器按钮，避免误开面板
      if (disabled) return;
      commit((arr ?? []).filter((x) => x !== v));
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

    // 打开时定位到已选项并清空搜索词
    useEffect(() => {
      if (!open) return;
      const i = visible.findIndex((o) => o.value === current);
      setActive(i >= 0 ? i : 0);
      setQuery('');
      // ponytail: 依赖只取 open，current/options 变化不重定位
    }, [open]);

    useEffect(() => {
      if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
    }, [open, active]);

    const move = (delta: number) => {
      setActive((a) => Math.min(Math.max(a + delta, 0), visible.length - 1));
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (open && active >= 0) pick(visible[active].value);
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

    // 触发器公共属性；multiple 用 div 渲染（内部 Tag 的 × 是合法 button，不能嵌套 button）
    const triggerProps = {
      role: 'combobox' as const,
      'aria-haspopup': 'listbox' as const,
      'aria-expanded': open,
      className: cn('reef-select__trigger', `reef-select__trigger--${size}`, {
        'reef-select__trigger--open': open,
        'reef-select__trigger--invalid': invalid,
        'reef-select__trigger--multiple': multiple,
        'reef-select__trigger--disabled': multiple && disabled,
      }),
      onClick: () => {
        if (!disabled) setOpen(!open);
      },
      onKeyDown,
    };

    const arrow = (
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
    );

    return (
      <div
        ref={rootRef}
        className={cn('reef-select', { 'reef-select--block': block }, className)}
        {...rest}
      >
        {multiple ? (
          <div
            ref={ref as unknown as React.Ref<HTMLDivElement>}
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled || undefined}
            {...triggerProps}
          >
            {arr!.length > 0 ? (
              <span className="reef-select__tags">
                {arr!.map((v) => (
                  <Tag
                    key={v}
                    closable
                    onClose={(e) => remove(v, e)}
                    className="reef-select__tag"
                  >
                    {options.find((o) => o.value === v)?.label ?? v}
                  </Tag>
                ))}
              </span>
            ) : (
              <span className="reef-select__value reef-select__value--placeholder">
                {placeholder ?? t.Select.placeholder}
              </span>
            )}
            {arrow}
          </div>
        ) : (
          <button ref={ref} type="button" disabled={disabled} {...triggerProps}>
            <span className={cn('reef-select__value', !selected && 'reef-select__value--placeholder')}>
              {selected ? selected.label : (placeholder ?? t.Select.placeholder)}
            </span>
            {arrow}
          </button>
        )}
        {open && (
          <div className="reef-select__panel">
            {searchable && (
              <input
                className="reef-select__search"
                value={query}
                placeholder={t.Select.searchPlaceholder}
                aria-label={t.Select.searchPlaceholder}
                onChange={(e) => setQuery(e.target.value)}
              />
            )}
            <ul ref={listRef} className="reef-select__list" role="listbox" aria-multiselectable={multiple || undefined} tabIndex={-1}>
              {visible.map((o, i) => {
                const sel = multiple ? arr!.includes(o.value) : o.value === current;
                return (
                  <li
                    key={o.value}
                    role="option"
                    aria-selected={sel}
                    aria-disabled={o.disabled || undefined}
                    className={cn('reef-select__option', {
                      'reef-select__option--active': i === active,
                      'reef-select__option--selected': sel,
                    })}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => pick(o.value)}
                  >
                    {o.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
