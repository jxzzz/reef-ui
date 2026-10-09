import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { PaginationProps } from './types';
import './pagination.css';

type PageItem = number | 'ellipsis';

/** 页码序列：总页数少则全显，多则 1 / 当前±1 / 末页 + 省略号 */
function pageItems(current: number, count: number): PageItem[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const picked = new Set<number>([1, count, current - 1, current, current + 1]);
  const sorted = [...picked].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  const result: PageItem[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push('ellipsis');
    result.push(p);
    prev = p;
  }
  return result;
}

export function Pagination({ total, pageSize = 10, current, defaultCurrent = 1, onChange, className }: PaginationProps) {
  const count = Math.max(1, Math.ceil(total / pageSize));
  const [inner, setInner] = useState(Math.min(defaultCurrent, count));
  // 越界直接钳制到 [1, count]，受控值过大时显示最后一页
  const page = Math.min(Math.max(current ?? inner, 1), count);

  const go = (next: number) => {
    if (next < 1 || next > count || next === page) return;
    if (current === undefined) setInner(next);
    onChange?.(next);
  };

  return (
    <nav aria-label="分页" className={cn('reef-pagination', className)}>
      <button
        type="button"
        className="reef-pagination__btn"
        aria-label="上一页"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        ‹
      </button>
      {pageItems(page, count).map((item, i) =>
        item === 'ellipsis' ? (
          <span key={`e${i}`} className="reef-pagination__ellipsis">…</span>
        ) : (
          <button
            key={item}
            type="button"
            className={cn('reef-pagination__btn', item === page && 'reef-pagination__btn--active')}
            aria-label={`第 ${item} 页`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => go(item)}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className="reef-pagination__btn"
        aria-label="下一页"
        disabled={page >= count}
        onClick={() => go(page + 1)}
      >
        ›
      </button>
    </nav>
  );
}
