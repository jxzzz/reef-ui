import { cn } from '@reef-ui/utils';
import type { EmptyProps } from './types';
import './empty.css';

export function Empty({ description = '暂无数据', children, className }: EmptyProps) {
  return (
    <div className={cn('reef-empty', className)}>
      <svg className="reef-empty__art" viewBox="0 0 64 41" aria-hidden="true">
        <ellipse cx="32" cy="33" rx="14" ry="3" />
        <path d="M55 12 44 9 32 15 20 9 9 12l6 13c0 3 8 6 17 6s17-3 17-6l6-13Z" />
        <path d="M32 15v17" />
      </svg>
      <p className="reef-empty__description">{description}</p>
      {children != null && <div className="reef-empty__action">{children}</div>}
    </div>
  );
}
