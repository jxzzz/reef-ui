import { useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import { useLocale } from '../locale';
import { CalendarPanel } from './CalendarPanel';
import { formatDate, parseDate } from './utils';
import { useOpen } from './useOpen';
import { useAnchoredPopup } from '../internal/use-anchored-popup';
import type { DatePickerProps } from './types';
import './date-picker.css';

export function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder,
  disabled = false,
  invalid = false,
  block = false,
  isDisabled,
  name,
  className,
}: DatePickerProps) {
  const t = useLocale();
  const { open, setOpen, rootRef } = useOpen();
  const popRef = useRef<HTMLDivElement>(null);

  // 浮层进顶层，避开祖先 overflow 裁剪
  useAnchoredPopup(open, rootRef, popRef);
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const selected = parseDate(current ?? null);

  const pick = (range: [Date | null, Date | null]) => {
    const d = range[0];
    if (!d) return;
    const s = formatDate(d);
    if (value === undefined) setInner(s);
    onChange?.(s);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn('reef-datepicker', { 'reef-datepicker--block': block }, className)}>
      <input
        type="text"
        readOnly
        name={name}
        placeholder={placeholder ?? t.DatePicker.placeholder}
        disabled={disabled}
        aria-haspopup="grid"
        aria-expanded={open}
        value={current ?? ''}
        className={cn('reef-input', invalid && 'reef-input--invalid')}
        onClick={() => !disabled && setOpen(true)}
      />
      <Icon name="calendar" size={14} className="reef-datepicker__icon" />
      {open && !disabled && (
        <div ref={popRef} className={cn('reef-popup', 'reef-datepicker__pop')}>
          <CalendarPanel value={[selected, selected]} onPick={pick} isDisabled={isDisabled} />
        </div>
      )}
    </div>
  );
}
