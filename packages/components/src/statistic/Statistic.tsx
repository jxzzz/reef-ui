import { forwardRef } from 'react';
import { cn } from '@reef-ui/utils';
import type { StatisticProps } from './types';
// ponytail: 不透传原生 div 属性——title/value/prefix 与 React 内置属性类型冲突，需要时再加 Omit
import './statistic.css';

function formatValue(value: string | number, precision: number | undefined, separator: boolean) {
  if (typeof value === 'string') return value;
  const fixed = precision !== undefined ? value.toFixed(precision) : String(value);
  if (!separator) return fixed;
  const negative = fixed.startsWith('-');
  const [int, dec] = (negative ? fixed.slice(1) : fixed).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (negative ? '-' : '') + grouped + (dec ? `.${dec}` : '');
}

export const Statistic = forwardRef<HTMLDivElement, StatisticProps>(
  (
    { title, value, precision, prefix, suffix, separator = true, loading = false, className },
    ref,
  ) => {
    return (
      <div ref={ref} className={cn('reef-statistic', loading && 'reef-statistic--loading', className)}>
        {title != null && <div className="reef-statistic__title">{title}</div>}
        <div className="reef-statistic__content">
          {prefix != null && <span className="reef-statistic__prefix">{prefix}</span>}
          {/* ponytail: 加载占位用 '—' 而非 Skeleton 块，需要动画再换 Skeleton */}
          <span className="reef-statistic__value">{loading ? '—' : formatValue(value, precision, separator)}</span>
          {suffix != null && <span className="reef-statistic__suffix">{suffix}</span>}
        </div>
      </div>
    );
  },
);

Statistic.displayName = 'Statistic';
