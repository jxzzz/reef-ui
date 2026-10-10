import { cn } from '@reef-ui/utils';
import type { CardProps } from './types';
import './card.css';

export function Card({ title, extra, footer, bordered = true, hoverable = false, children, className }: CardProps) {
  return (
    <div
      className={cn(
        'reef-card',
        bordered && 'reef-card--bordered',
        hoverable && 'reef-card--hoverable',
        className,
      )}
    >
      {(title != null || extra != null) && (
        <div className="reef-card__head">
          <div className="reef-card__title">{title}</div>
          {extra != null && <div className="reef-card__extra">{extra}</div>}
        </div>
      )}
      <div className="reef-card__body">{children}</div>
      {footer != null && <div className="reef-card__footer">{footer}</div>}
    </div>
  );
}
