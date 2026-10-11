import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import { CalendarPanel } from './CalendarPanel';
import { formatDate, parseDate } from './utils';
import { useOpen } from './useOpen';
import type { DateRange, DateRangePickerProps } from './types';
import './date-picker.css';

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  startPlaceholder = '开始日期',
  endPlaceholder = '结束日期',
  disabled = false,
  invalid = false,
  block = false,
  isDisabled,
  className,
}: DateRangePickerProps) {
  const { open, setOpen, rootRef } = useOpen();
  const [inner, setInner] = useState<DateRange>(defaultValue ?? [null, null]);
  const current: DateRange = value !== undefined ? value : inner;
  // 选完起点、还没选终点时，先把起点显示出来
  const [draft, setDraft] = useState<DateRange>([null, null]);
  const shown = open && draft[0] && !draft[1] ? draft : current;

  const pick = (range: [Date | null, Date | null]) => {
    const next: DateRange = range[1] ? [formatDate(range[0]!), formatDate(range[1])] : [formatDate(range[0]!), null];
    setDraft(next);
    if (range[1]) {
      if (value === undefined) setInner(next);
      setDraft([null, null]);
      onChange?.(next);
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn('reef-datepicker--range', { 'reef-datepicker--block': block }, className)}>
      <div className={cn('reef-datepicker__fields', invalid && 'reef-datepicker--invalid')} data-disabled={disabled || undefined}>
        <input
          type="text"
          readOnly
          placeholder={startPlaceholder}
          disabled={disabled}
          aria-haspopup="grid"
          aria-expanded={open}
          value={shown[0] ?? ''}
          onClick={() => !disabled && setOpen(true)}
        />
        <span aria-hidden="true">→</span>
        <input
          type="text"
          readOnly
          placeholder={endPlaceholder}
          disabled={disabled}
          aria-haspopup="grid"
          aria-expanded={open}
          value={shown[1] ?? ''}
          onClick={() => !disabled && setOpen(true)}
        />
      </div>
      {open && !disabled && (
        <div className="reef-datepicker__pop">
          <CalendarPanel
            value={[parseDate(shown[0]), parseDate(shown[1])]}
            onPick={pick}
            isDisabled={isDisabled}
          />
        </div>
      )}
    </div>
  );
}
