import { forwardRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import { useLocale } from '../locale';
import { HiddenField } from '../internal/hidden-field';
import type { RateProps } from './types';
import './rate.css';

export const Rate = forwardRef<HTMLDivElement, RateProps>(
  (
    {
      value,
      defaultValue = 0,
      onChange,
      count = 5,
      disabled = false,
      readonly = false,
      allowClear = false,
      name,
      className,
      ...rest
    },
    ref,
  ) => {
    const t = useLocale();
    const [inner, setInner] = useState(defaultValue);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    // 支持受控 / 非受控两种用法
    const current = value !== undefined ? value : inner;
    const shown = hoverIndex ?? current;
    const interactive = !disabled && !readonly;

    const pick = (i: number) => {
      if (!interactive) return;
      const next = allowClear && current === i + 1 ? 0 : i + 1;
      if (value === undefined) setInner(next);
      onChange?.(next);
    };

    // ponytail: 不做触摸端半星预览（hover 预览仅鼠标），需要时在 touchstart 上复用 hoverIndex
    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={t.Rate.description}
        className={cn('reef-rate', { 'reef-rate--readonly': readonly }, className)}
        {...rest}
      >
        <HiddenField name={name} value={current ? String(current) : ''} />
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={i + 1 === current}
            aria-label={`${i + 1} / ${count}`}
            disabled={disabled}
            className={cn('reef-rate__star', { 'reef-rate__star--on': i + 1 <= shown })}
            onMouseEnter={() => interactive && setHoverIndex(i + 1)}
            onMouseLeave={() => interactive && setHoverIndex(null)}
            onClick={() => pick(i)}
          >
            <Icon name="star" />
          </button>
        ))}
      </div>
    );
  },
);

Rate.displayName = 'Rate';
