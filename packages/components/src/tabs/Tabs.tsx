import { useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { TabsProps } from './types';
import './tabs.css';

export function Tabs({ items, activeKey, defaultActiveKey, onChange, className }: TabsProps) {
  const [inner, setInner] = useState(defaultActiveKey ?? items[0]?.key);
  const current = activeKey ?? inner;
  const listRef = useRef<HTMLDivElement>(null);

  const select = (key: string) => {
    if (activeKey === undefined) setInner(key);
    onChange?.(key);
  };

  // 方向键切换，到边界即停（与 Select 行为一致）
  const move = (delta: number) => {
    const index = items.findIndex((item) => item.key === current);
    const next = Math.min(Math.max(index + delta, 0), items.length - 1);
    const item = items[next];
    if (!item || item.key === current) return;
    select(item.key);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div className={cn('reef-tabs', className)}>
      <div ref={listRef} role="tablist" className="reef-tabs__list">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={item.key === current}
            tabIndex={item.key === current ? 0 : -1}
            className={cn('reef-tabs__tab', item.key === current && 'reef-tabs__tab--active')}
            onClick={() => select(item.key)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                move(1);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                move(-1);
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div key={item.key} role="tabpanel" hidden={item.key !== current} className="reef-tabs__panel">
          {item.children}
        </div>
      ))}
    </div>
  );
}
