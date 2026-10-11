import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import { CalendarPanel } from './CalendarPanel';
import { formatDate, parseDate } from './utils';
import { useOpen } from './useOpen';
import type { DatePickerProps } from './types';
import './date-picker.css';

export function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = '请选择日期',
  disabled = false,
  invalid = false,
  block = false,
  isDisabled,
  className,
}: DatePickerProps) {
  const { open, setOpen, rootRef } = useOpen();
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
        placeholder={placeholder}
        disabled={disabled}
        aria-haspopup="grid"
        aria-expanded={open}
        value={current ?? ''}
        className={cn('reef-input', invalid && 'reef-input--invalid')}
        onClick={() => !disabled && setOpen(true)}
      />
      <Icon name="calendar" size={14} className="reef-datepicker__icon" />
      {open && !disabled && (
        <div className="reef-datepicker__pop">
          <CalendarPanel value={[selected, selected]} onPick={pick} isDisabled={isDisabled} />
        </div>
      )}
    </div>
  );
}
