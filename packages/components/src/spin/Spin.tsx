import { cn } from '@reef-ui/utils';
import type { SpinProps } from './types';
import './spin.css';

export function Spin({ spinning = true, size = 'medium', tip, children, className }: SpinProps) {
  if (children == null) {
    if (!spinning) return null;
    return (
      <span
        className={cn('reef-spin', `reef-spin--${size}`, 'reef-spin--standalone', className)}
        role="status"
        aria-label={tip ?? '加载中'}
      >
        <i className="reef-spin__circle" />
      </span>
    );
  }

  return (
    <div className={cn('reef-spin', `reef-spin--${size}`, className)}>
      {children}
      {spinning && (
        <div className="reef-spin__overlay" role="status" aria-label={tip ?? '加载中'}>
          <i className="reef-spin__circle" />
          {tip != null && <span className="reef-spin__tip">{tip}</span>}
        </div>
      )}
    </div>
  );
}
