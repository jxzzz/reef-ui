import { cn } from '@reef-ui/utils';
import type { TimelineProps } from './types';
import './timeline.css';

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ul className={cn('reef-timeline', className)}>
      {items.map((item, i) => (
        <li key={item.key ?? i} className="reef-timeline__item">
          <span className="reef-timeline__head">{item.dot ?? <span className="reef-timeline__dot" />}</span>
          <div className="reef-timeline__content">{item.content}</div>
        </li>
      ))}
    </ul>
  );
}
