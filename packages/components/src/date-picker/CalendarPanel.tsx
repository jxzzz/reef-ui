import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import { useLocale } from '../locale';
import { dayState, formatDate, isSameDay, monthGrid } from './utils';

/** 日历面板：受控的选中区间 [start, end]（单选传同一端点即可），点击回调完整新区间 */
export function CalendarPanel({
  value,
  onPick,
  isDisabled,
}: {
  value: [Date | null, Date | null];
  onPick: (range: [Date | null, Date | null]) => void;
  isDisabled?: (date: Date) => boolean;
}) {
  const t = useLocale();
  const today = new Date();
  const [view, setView] = useState({ y: value[0]?.getFullYear() ?? today.getFullYear(), m: value[0]?.getMonth() ?? today.getMonth() });
  const [hover, setHover] = useState<Date | null>(null);
  // 单选区间在填第二个端点；点击首个端点后进入 end 阶段
  const pickingEnd = value[0] != null && value[1] == null;

  const jump = (dm: number) => {
    setView(({ y, m }) => {
      const nm = m + dm;
      return { y: y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 };
    });
  };

  const pick = (d: Date) => {
    if (isDisabled?.(d)) return;
    if (!pickingEnd) {
      onPick([d, null]);
      return;
    }
    // 第二次点击：自动排序 start/end
    const a = value[0]!;
    onPick(a.getTime() <= d.getTime() ? [a, d] : [d, a]);
  };

  const effEnd = pickingEnd ? hover : value[1];
  const grid = monthGrid(view.y, view.m, t.DatePicker.weekStart);

  return (
    <div className="reef-datepicker__panel" onMouseLeave={() => setHover(null)}>
      <div className="reef-datepicker__head">
        <button type="button" aria-label={t.DatePicker.prevYear} className="reef-datepicker__nav" onClick={() => jump(-12)}>
          <Icon name="chevron-left" size={12} />
          <Icon name="chevron-left" size={12} />
        </button>
        <button type="button" aria-label={t.DatePicker.prevMonth} className="reef-datepicker__nav" onClick={() => jump(-1)}>
          <Icon name="chevron-left" size={12} />
        </button>
        <span className="reef-datepicker__month">{t.DatePicker.yearMonth(view.y, view.m)}</span>
        <button type="button" aria-label={t.DatePicker.nextMonth} className="reef-datepicker__nav" onClick={() => jump(1)}>
          <Icon name="chevron-right" size={12} />
        </button>
        <button type="button" aria-label={t.DatePicker.nextYear} className="reef-datepicker__nav" onClick={() => jump(12)}>
          <Icon name="chevron-right" size={12} />
          <Icon name="chevron-right" size={12} />
        </button>
      </div>
      {/* ponytail: 只保留 role="grid" + aria-label 的浅语义，未实现完整 WAI-ARIA grid
          模式（row/gridcell 结构、方向键在日期间移动、Home/End 翻月）；需要纯键盘选日期时再补 */}
      <div className="reef-datepicker__grid" role="grid" aria-label={t.DatePicker.calendar}>
        {t.DatePicker.weekdays.map((w) => (
          <span key={w} className="reef-datepicker__weekday">
            {w}
          </span>
        ))}
        {grid.map((d) => {
          const state = dayState(d, value[0], effEnd);
          const disabled = isDisabled?.(d) ?? false;
          return (
            <button
              key={formatDate(d)}
              type="button"
              disabled={disabled}
              aria-selected={state === 'selected' || undefined}
              className={cn(
                'reef-datepicker__day',
                d.getMonth() !== view.m && 'reef-datepicker__day--other',
                isSameDay(d, new Date()) && 'reef-datepicker__day--today',
                state && `reef-datepicker__day--${state}`,
              )}
              onMouseEnter={() => setHover(d)}
              onClick={() => pick(d)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
