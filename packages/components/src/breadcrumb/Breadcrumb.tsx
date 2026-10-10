import { cn } from '@reef-ui/utils';
import type { BreadcrumbProps } from './types';
import './breadcrumb.css';

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="面包屑" className={cn('reef-breadcrumb', className)}>
      <ol className="reef-breadcrumb__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={item.key ?? i}
              className="reef-breadcrumb__item"
              aria-current={isLast ? 'page' : undefined}
            >
              {item.href && !isLast ? (
                <a className="reef-breadcrumb__link" href={item.href}>
                  {item.title}
                </a>
              ) : (
                <span>{item.title}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
