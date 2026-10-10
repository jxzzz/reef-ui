import { cn } from '@reef-ui/utils';
import type { SkeletonProps } from './types';
import './skeleton.css';

export function Skeleton({ loading = true, avatar, rows = 3, children, className }: SkeletonProps) {
  if (!loading) return <>{children}</>;

  return (
    <div className={cn('reef-skeleton', className)}>
      {avatar && <span className="reef-skeleton__avatar" />}
      <div className="reef-skeleton__rows">
        {Array.from({ length: rows }, (_, i) => (
          <span key={i} className="reef-skeleton__row" />
        ))}
      </div>
    </div>
  );
}
