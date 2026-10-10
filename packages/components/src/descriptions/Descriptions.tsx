import { cn } from '@reef-ui/utils';
import type { DescriptionsProps } from './types';
import './descriptions.css';

export function Descriptions({ items, column = 3, bordered, title, className }: DescriptionsProps) {
  return (
    <div className={cn('reef-descriptions', bordered && 'reef-descriptions--bordered', className)}>
      {title != null && <div className="reef-descriptions__title">{title}</div>}
      <dl
        className="reef-descriptions__body"
        style={{ gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))` }}
      >
        {items.map((item) => (
          <div key={item.key} className="reef-descriptions__item">
            <dt className="reef-descriptions__label">{item.label}</dt>
            <dd className="reef-descriptions__value">{item.children}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
