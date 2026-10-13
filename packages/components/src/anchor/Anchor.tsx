import { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { AnchorItem, AnchorProps } from './types';
import './anchor.css';

/** 目标顶部越过视口顶部多少像素内视为“当前节” */
const SPY_THRESHOLD = 80;

export const Anchor = forwardRef<HTMLElement, AnchorProps>(
  ({ items, activeKey, defaultActiveKey, onChange, onClick, className }, _ref) => {
    const [inner, setInner] = useState(defaultActiveKey);
    const current = activeKey ?? inner;

    const select = (key: string) => {
      if (activeKey === undefined) setInner(key);
      onChange?.(key);
    };
    // 始终指向最新 select，避免监听器因 props 变化反复重挂
    const selectRef = useRef(select);
    selectRef.current = select;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: AnchorItem) => {
      e.preventDefault();
      onClick?.(e, item);
      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
      select(item.key);
    };

    // 滚动监听：取 top 已越过阈值且最接近视口顶部的目标为当前节
    // ponytail: 只监听 window，不支持 overflow 容器内滚动，需要容器作用域时把
    // scroll 事件挂到容器并换算坐标即可
    useEffect(() => {
      const spy = () => {
        let best: string | undefined;
        let bestTop = -Infinity;
        for (const item of items) {
          const el = document.querySelector(item.href);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (top <= SPY_THRESHOLD && top >= bestTop) {
            bestTop = top;
            best = item.key;
          }
        }
        if (best) selectRef.current(best);
      };
      spy();
      window.addEventListener('scroll', spy, { passive: true });
      return () => window.removeEventListener('scroll', spy);
    }, [items]);

    return (
      <nav aria-label="Anchor" className={cn('reef-anchor', className)}>
        <div className="reef-anchor__indicator" aria-hidden="true" />
        <ul className="reef-anchor__list">
          {items.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                aria-current={item.key === current || undefined}
                className={cn('reef-anchor__link', item.key === current && 'reef-anchor__link--active')}
                onClick={(e) => handleClick(e, item)}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  },
);

Anchor.displayName = 'Anchor';
