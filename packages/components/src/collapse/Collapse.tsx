import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { CollapseProps } from './types';
import './collapse.css';

export function Collapse({
  items,
  defaultActiveKey,
  activeKey,
  onChange,
  accordion = false,
  expandIconPosition = 'start',
  className,
  ...rest
}: CollapseProps) {
  const [inner, setInner] = useState(defaultActiveKey ?? []);
  const current = activeKey ?? inner;

  const toggle = (key: string) => {
    const open = current.includes(key);
    // accordion 始终 0/1 个 key，普通模式增删当前 key
    const keys = accordion
      ? open
        ? []
        : [key]
      : open
        ? current.filter((k) => k !== key)
        : [...current, key];
    if (activeKey === undefined) setInner(keys);
    onChange?.(keys);
  };

  return (
    <div
      className={cn('reef-collapse', { 'reef-collapse--icon-end': expandIconPosition === 'end' }, className)}
      {...rest}
    >
      {items.map((item) => {
        const open = current.includes(item.key);
        return (
          <div
            key={item.key}
            className={cn('reef-collapse__item', {
              'reef-collapse__item--open': open,
              'reef-collapse__item--disabled': item.disabled,
            })}
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`reef-collapse-panel-${item.key}`}
              disabled={item.disabled}
              className="reef-collapse__header"
              onClick={() => toggle(item.key)}
            >
              <svg
                className={cn('reef-collapse__arrow', { 'reef-collapse__arrow--open': open })}
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item.label}
            </button>
            <div
              id={`reef-collapse-panel-${item.key}`}
              aria-hidden={!open}
              className={cn('reef-collapse__content-wrap', { 'reef-collapse__content-wrap--open': open })}
            >
              <div className="reef-collapse__clip">
                <div className="reef-collapse__content">{item.children}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
