import { forwardRef, useState, type CSSProperties } from 'react';
import { cn } from '@reef-ui/utils';
import type { SliderProps } from './types';
import './slider.css';

// ponytail: 基于 <input type="range"> 而非自绘轨道 —— 键盘、触屏拖动、ARIA
// 全部原生免费；需要刻度/tooltip 等原生给不了的能力时再考虑自绘
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    { value, defaultValue, onChange, min = 0, max = 100, step = 1, disabled, className, ...rest },
    ref,
  ) => {
    // 支持受控 / 非受控两种用法；无初始值时取 min
    const [inner, setInner] = useState(defaultValue);
    const current = value !== undefined ? value : (inner ?? min);

    // 已填充轨道的百分比交给 CSS 变量，css 里用 linear-gradient 渲染；越界值钳回 [0, 100]
    const fill = Math.min(Math.max(((current - min) / (max - min)) * 100, 0), 100);

    return (
      <input
        ref={ref}
        type="range"
        {...rest}
        className={cn('reef-slider', className)}
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        aria-label={rest['aria-label'] ?? 'Slider'}
        style={{ '--reef-slider-fill': `${fill}%`, ...rest.style } as CSSProperties}
        onChange={(e) => {
          // jsdom 会给禁用 input 派发事件（真实浏览器不会），显式挡掉保持语义一致
          if (disabled) return;
          const v = Number(e.currentTarget.value);
          if (value === undefined) setInner(v);
          onChange?.(v);
        }}
      />
    );
  },
);

Slider.displayName = 'Slider';
