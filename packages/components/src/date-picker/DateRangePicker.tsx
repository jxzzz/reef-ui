import { useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import { useLocale } from '../locale';
import { CalendarPanel } from './CalendarPanel';
import { formatDate, parseDate } from './utils';
import { useOpen } from './useOpen';
import { useAnchoredPopup } from '../internal/use-anchored-popup';
import type { DateRange, DateRangePickerProps } from './types';
import './date-picker.css';

export function DateRangePicker({
  value,
  defaultValue,
  onChange,
  startPlaceholder,
  endPlaceholder,
  disabled = false,
  invalid = false,
  block = false,
  isDisabled,
  name,
  className,
}: DateRangePickerProps) {
  const t = useLocale();
  const { open, setOpen, rootRef } = useOpen();
  const popRef = useRef<HTMLDivElement>(null);

  // 浮层进顶层，避开祖先 overflow 裁剪
  useAnchoredPopup(open, rootRef, popRef);
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
        <Icon name="calendar" size={14} className="reef-datepicker__icon" />
        <input
          type="text"
          readOnly
          name={name}
          placeholder={startPlaceholder ?? t.DatePicker.startPlaceholder}
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
          name={name}
          placeholder={endPlaceholder ?? t.DatePicker.endPlaceholder}
          disabled={disabled}
          aria-haspopup="grid"
          aria-expanded={open}
          value={shown[1] ?? ''}
          onClick={() => !disabled && setOpen(true)}
        />
      </div>
      {open && !disabled && (
        <div ref={popRef} className={cn('reef-popup', 'reef-datepicker__pop')}>
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
