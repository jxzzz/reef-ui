import { cn } from '@reef-ui/utils';
import type { ProgressProps } from './types';
import './progress.css';

export function Progress({ percent, size = 'medium', status = 'normal', showInfo = true, className }: ProgressProps) {
  // 越界钳制到 [0, 100]；非数值（NaN 等）按 0 处理，负数与超 100 均不产生溢出样式
  const value = Math.min(Math.max(Number.isFinite(percent) ? percent : 0, 0), 100);

  return (
    <div className={cn('reef-progress', size === 'small' && 'reef-progress--small', className)}>
      <div
        className="reef-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div
          className={cn('reef-progress__fill', status !== 'normal' && `reef-progress__fill--${status}`)}
          style={{ width: `${value}%` }}
        />
      </div>
      {showInfo && <span className="reef-progress__info">{value}%</span>}
    </div>
  );
}
