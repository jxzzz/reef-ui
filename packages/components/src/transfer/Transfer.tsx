import { forwardRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import type { TransferItem, TransferProps } from './types';
import './transfer.css';

export const Transfer = forwardRef<HTMLDivElement, TransferProps>(
  (
    {
      dataSource,
      targetKeys,
      defaultTargetKeys,
      onChange,
      titles,
      searchable = false,
      disabled = false,
      className,
      ...rest
    },
    ref,
  ) => {
    // 支持受控 / 非受控两种用法
    const [inner, setInner] = useState(defaultTargetKeys ?? []);
    const [checked, setChecked] = useState<string[]>([]);
    const [query, setQuery] = useState<[string, string]>(['', '']);

    const current = targetKeys !== undefined ? targetKeys : inner;
    const targetSet = new Set(current);
    const left = dataSource.filter((i) => !targetSet.has(i.key));
    const right = dataSource.filter((i) => targetSet.has(i.key));

    // ponytail: 搜索仅匹配字符串 title，ReactNode 标题恒可见（不参与过滤）
    const match = (item: TransferItem, q: string) =>
      !q || (typeof item.title === 'string' && item.title.toLowerCase().includes(q.toLowerCase()));

    const moveTo = (direction: 'left' | 'right') => {
      const from = direction === 'right' ? left : right;
      const moved = checked.filter((k) => from.some((i) => i.key === k && !i.disabled));
      if (!moved.length) return;
      const set = new Set(current);
      for (const k of moved) {
        if (direction === 'right') set.add(k);
        else set.delete(k);
      }
      // 保持 dataSource 顺序，回调的 targetKeys 顺序可预测
      const next = dataSource.filter((i) => set.has(i.key)).map((i) => i.key);
      if (targetKeys === undefined) setInner(next);
      setChecked((c) => c.filter((k) => !moved.includes(k)));
      onChange?.(next, direction, moved);
    };

    // 两侧仅统计可移动（非禁用）的已勾选项来决定按钮可用性
    const canRight = checked.some((k) => left.some((i) => i.key === k && !i.disabled));
    const canLeft = checked.some((k) => right.some((i) => i.key === k && !i.disabled));

    const panel = (side: 'left' | 'right') => {
      const idx = side === 'left' ? 0 : 1;
      const items = side === 'left' ? left : right;
      const visible = items.filter((i) => match(i, query[idx]));
      const checkedCount = items.filter((i) => checked.includes(i.key)).length;
      return (
        <div className={cn('reef-transfer__panel', `reef-transfer__panel--${side}`)}>
          <div className="reef-transfer__header">
            <span className="reef-transfer__title">
              {titles?.[idx] ?? (idx === 0 ? '未选择' : '已选择')}
            </span>
            <span className="reef-transfer__count">
              {checkedCount}/{items.length}
            </span>
          </div>
          {searchable && (
            <div className="reef-transfer__search-wrap">
              <input
                className="reef-transfer__search"
                value={query[idx]}
                disabled={disabled}
                placeholder="搜索"
                aria-label={idx === 0 ? '搜索未选择列表' : '搜索已选择列表'}
                onChange={(e) =>
                  setQuery((q) =>
                    idx === 0 ? [e.target.value, q[1]] : [q[0], e.target.value],
                  )
                }
              />
            </div>
          )}
          <div className="reef-transfer__body">
            {visible.map((it) => (
              <div
                key={it.key}
                className={cn('reef-transfer__item', {
                  'reef-transfer__item--disabled': it.disabled,
                })}
              >
                <Checkbox
                  block
                  checked={it.disabled ? false : checked.includes(it.key)}
                  disabled={disabled || it.disabled}
                  onChange={(e) =>
                    setChecked((c) =>
                      e.target.checked ? [...c, it.key] : c.filter((k) => k !== it.key),
                    )
                  }
                >
                  {it.title}
                </Checkbox>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div ref={ref} className={cn('reef-transfer', className)} {...rest}>
        {panel('left')}
        <div className="reef-transfer__operations">
          <Button
            className="reef-transfer__operation"
            size="small"
            disabled={disabled || !canRight}
            aria-label="移到右侧"
            onClick={() => moveTo('right')}
          >
            →
          </Button>
          <Button
            className="reef-transfer__operation"
            size="small"
            disabled={disabled || !canLeft}
            aria-label="移到左侧"
            onClick={() => moveTo('left')}
          >
            ←
          </Button>
        </div>
        {panel('right')}
      </div>
    );
  },
);

Transfer.displayName = 'Transfer';
