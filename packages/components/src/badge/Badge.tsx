import { cn } from '@reef-ui/utils';
import type { BadgeProps } from './types';
import './badge.css';

export function Badge({ count, dot = false, max = 99, color = 'danger', children, className }: BadgeProps) {
  const show = dot || (count !== undefined && count > 0);
  const text = count !== undefined && count > max ? `${max}+` : count;

  const badge = (standalone: boolean) => (
    <sup
      className={cn(
        'reef-badge',
        `reef-badge--${color}`,
        dot && 'reef-badge--dot',
        standalone && 'reef-badge--standalone',
        standalone && className,
      )}
    >
      {!dot && text}
    </sup>
  );

  if (children == null) return show ? badge(true) : null;
  return (
    <span className={cn('reef-badge__wrapper', className)}>
      {children}
      {show && badge(false)}
    </span>
  );
}
