import { cn } from '@reef-ui/utils';
import type { ProgressProps } from './types';
import './progress.css';

// 圆环用统一的 100×100 viewBox，直径档位交给 CSS 缩放
const CIRCLE_RADIUS = 46;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export function Progress({ percent, type = 'line', size = 'medium', status = 'normal', showInfo = true, className }: ProgressProps) {
  // 越界钳制到 [0, 100]；非数值（NaN 等）按 0 处理，负数与超 100 均不产生溢出样式
  const value = Math.min(Math.max(Number.isFinite(percent) ? percent : 0, 0), 100);
  const fillClass = cn('reef-progress__fill', status !== 'normal' && `reef-progress__fill--${status}`);

  if (type === 'circle') {
    // stroke-dashoffset = 周长 × 未完成比例，0 → 满环
    const offset = CIRCLE_CIRCUMFERENCE * (1 - value / 100);
    return (
      <div className={cn('reef-progress', 'reef-progress--circle', `reef-progress--circle-${size}`, className)}>
        <svg
          className="reef-progress__track"
          viewBox="0 0 100 100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
        >
          <circle className="reef-progress__ring" cx="50" cy="50" r={CIRCLE_RADIUS} strokeWidth="6" />
          <circle
            className={fillClass}
            cx="50"
            cy="50"
            r={CIRCLE_RADIUS}
            strokeWidth="6"
            /* 圆头：起点端收进轨道，行进端外凸；0% 时零长虚线会渲染成圆点，回退 butt */
            strokeLinecap={value > 0 ? 'round' : 'butt'}
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        </svg>
        {showInfo && <span className="reef-progress__info">{value}%</span>}
      </div>
    );
  }

  return (
    <div className={cn('reef-progress', size === 'small' && 'reef-progress--small', className)}>
      <div
        className="reef-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div className={fillClass} style={{ width: `${value}%` }} />
      </div>
      {showInfo && <span className="reef-progress__info">{value}%</span>}
    </div>
  );
}
