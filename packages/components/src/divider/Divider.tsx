import { cn } from '@reef-ui/utils';
import type { DividerProps } from './types';
import './divider.css';

export function Divider({ vertical, dashed, children, className }: DividerProps) {
  if (vertical) {
    return <span className={cn('reef-divider', 'reef-divider--vertical', className)} />;
  }
  return (
    <div className={cn('reef-divider', dashed && 'reef-divider--dashed', className)}>
      {children && <span className="reef-divider__inner">{children}</span>}
    </div>
  );
}
