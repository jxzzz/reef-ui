import { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import { useLocale } from '../locale';
import { HiddenField } from '../internal/hidden-field';
import { useAnchoredPopup } from '../internal/use-anchored-popup';
import type { TimePickerProps } from './types';
import './time-picker.css';

/** 三列字段：[时, 分, 秒]，null 表示该列未选 */
type Fields = [number | null, number | null, number | null];

/** 'HH:mm:ss' -> [h, m, s]；空值或格式不合法返回全 null */
const parse = (v?: string): Fields => {
  const [h, m, s] = (v ?? '').split(':').map(Number);
  const ok =
    [h, m, s].every((n) => Number.isInteger(n)) &&
    h >= 0 &&
    h < 24 &&
    m >= 0 &&
    m < 60 &&
    s >= 0 &&
    s < 60;
  return ok ? [h, m, s] : [null, null, null];
};

export const TimePicker = forwardRef<HTMLButtonElement, TimePickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      placeholder,
      disabled = false,
      minuteStep = 1,
      name,
      className,
      ...rest
    },
    ref,
  ) => {
    const t = useLocale();
    const [open, setOpen] = useState(false);
    const [inner, setInner] = useState(defaultValue);
    const [fields, setFields] = useState<Fields>(() => parse(defaultValue));
    const rootRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // 浮层进顶层，避开祖先 overflow 裁剪
    useAnchoredPopup(open, rootRef, panelRef);
    const colRefs = useRef<(HTMLUListElement | null)[]>([]);

    // 支持受控 / 非受控两种用法
    const current = value !== undefined ? value : inner;

    // 受控 value 外部变化时同步三列选中态
    useEffect(() => {
      if (value !== undefined) setFields(parse(value));
    }, [value]);

    // 点击外部 / Escape 关闭
    useEffect(() => {
      if (!open) return;
      const onDoc = (e: MouseEvent) => {
        if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('mousedown', onDoc);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDoc);
        document.removeEventListener('keydown', onKey);
      };
    }, [open]);

    // 打开时各列滚动到选中项
    useEffect(() => {
      if (!open) return;
      colRefs.current.forEach((ul) => {
        ul?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
      });
    }, [open]);

    const pick = (col: 0 | 1 | 2, n: number) => {
      const next: Fields = [...fields];
      next[col] = n;
      setFields(next);
      // 三列都有值才算完整选择，才抛 onChange
      if (next[0] !== null && next[1] !== null && next[2] !== null) {
        const s = next.map((x) => String(x).padStart(2, '0')).join(':');
        if (value === undefined) setInner(s);
        onChange?.(s);
      }
    };

    const clear = () => {
      if (value === undefined) setInner(undefined);
      setFields([null, null, null]);
      onChange?.(null);
    };

    const columns = [
      { head: t.TimePicker.hour, items: Array.from({ length: 24 }, (_, i) => i), index: 0 },
      {
        head: t.TimePicker.minute,
        items: Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep),
        index: 1,
      },
      { head: t.TimePicker.second, items: Array.from({ length: 60 }, (_, i) => i), index: 2 },
      // ponytail: 不支持 12 小时制 / 隐藏禁用项等裁剪，有需求再加列配置
    ] as const;

    return (
      <div ref={rootRef} className={cn('reef-timepicker', className)} {...rest}>
        <HiddenField name={name} value={current ?? ''} />
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          className={cn('reef-timepicker__trigger', { 'reef-timepicker__trigger--open': open })}
          onClick={() => setOpen(!open)}
        >
          <Icon name="clock" size={14} className="reef-timepicker__icon" />
          <span
            className={cn(
              'reef-timepicker__value',
              !current && 'reef-timepicker__value--placeholder',
            )}
          >
            {current || placeholder || t.TimePicker.placeholder}
          </span>
        </button>
        {current && !disabled && (
          <button
            type="button"
            className="reef-timepicker__clear"
            aria-label={t.Input.clear}
            onClick={clear}
          >
            <Icon name="close" size={10} />
          </button>
        )}
        {open && (
          <div ref={panelRef} className={cn('reef-popup', 'reef-timepicker__panel')}>
            {columns.map((c, i) => (
              <div className="reef-timepicker__col" key={c.index}>
                <p className="reef-timepicker__col-head">{c.head}</p>
                <ul
                  ref={(el) => {
                    colRefs.current[i] = el;
                  }}
                  className="reef-timepicker__list"
                  role="listbox"
                  tabIndex={-1}
                  aria-label={c.head}
                >
                  {c.items.map((n) => (
                    <li
                      key={n}
                      role="option"
                      aria-selected={fields[c.index] === n}
                      className={cn('reef-timepicker__option', {
                        'reef-timepicker__option--selected': fields[c.index] === n,
                      })}
                      onClick={() => pick(c.index, n)}
                    >
                      {String(n).padStart(2, '0')}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {/* ponytail: 不做键盘逐列导航（方向键在列间移动），需要时仿 Select 的 active 索引手法补 */}
      </div>
    );
  },
);

TimePicker.displayName = 'TimePicker';
