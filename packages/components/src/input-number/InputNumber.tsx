import { forwardRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import { Input } from '../input';
import type { InputNumberProps, InputNumberValue } from './types';
import './input-number.css';

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      min,
      max,
      step = 1,
      disabled,
      size = 'medium',
      invalid,
      block,
      onKeyDown,
      className,
      ...rest
    },
    ref,
  ) => {
    const [text, setText] = useState(() =>
      value !== undefined ? String(value) : defaultValue !== undefined ? String(defaultValue) : '',
    );
    const current = value !== undefined ? String(value) : text;

    // ponytail: 受控模式下输入中途（如 "1."）会被父组件的 value 覆盖显示，
    // 需要支持中间态时改成聚焦期间持有本地草稿
    const emit = (raw: string) => {
      setText(raw);
      const n: InputNumberValue = raw === '' ? null : Number(raw);
      if (raw !== '' && !Number.isFinite(n)) return;
      onChange?.(n);
    };

    const clamp = (n: number) => Math.min(Math.max(n, min ?? -Infinity), max ?? Infinity);

    const stepBy = (dir: 1 | -1) => {
      if (disabled) return;
      const base = Number(current);
      emit(String(clamp((Number.isFinite(base) ? base : 0) + dir * step)));
    };

    // 失焦收敛：非法输入按空处理，越界数字钳到边界
    const handleBlur = () => {
      if (current === '') return;
      const n = Number(current);
      emit(String(Number.isFinite(n) ? clamp(n) : ''));
    };

    return (
      <Input
        ref={ref}
        type="number"
        min={min}
        max={max}
        step={step}
        size={size}
        invalid={invalid}
        block={block}
        disabled={disabled}
        className={cn('reef-inputnumber__input', className)}
        value={current}
        onChange={(e) => emit(e.currentTarget.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            stepBy(1);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            stepBy(-1);
          }
          onKeyDown?.(e);
        }}
        suffix={
          <span className="reef-inputnumber__stepper">
            <button
              type="button"
              tabIndex={-1}
              aria-label="增加"
              disabled={disabled}
              className="reef-inputnumber__btn"
              onClick={() => stepBy(1)}
            >
              <Icon name="chevron-up" size={10} />
            </button>
            <button
              type="button"
              tabIndex={-1}
              aria-label="减少"
              disabled={disabled}
              className="reef-inputnumber__btn"
              onClick={() => stepBy(-1)}
            >
              <Icon name="chevron-down" size={10} />
            </button>
          </span>
        }
        {...rest}
      />
    );
  },
);

InputNumber.displayName = 'InputNumber';
