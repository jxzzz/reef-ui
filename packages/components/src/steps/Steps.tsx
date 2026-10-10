import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import type { StepsProps } from './types';
import './steps.css';

export function Steps({ items, current, defaultCurrent = 0, onChange, className }: StepsProps) {
  const [inner, setInner] = useState(defaultCurrent);
  const active = current ?? inner;

  const select = (index: number) => {
    if (current === undefined) setInner(index);
    onChange?.(index);
  };

  return (
    <ol className={cn('reef-steps', className)}>
      {items.map((item, i) => {
        const status = i < active ? 'finish' : i === active ? 'process' : 'wait';
        const clickable = onChange != null && i !== active;
        return (
          <li
            key={item.key}
            className={cn('reef-steps__item', `reef-steps__item--${status}`)}
            aria-current={status === 'process' ? 'step' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={clickable ? () => select(i) : undefined}
            onKeyDown={
              clickable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      select(i);
                    }
                  }
                : undefined
            }
          >
            <span className="reef-steps__head">
              {status === 'finish' ? <Icon name="check" size={14} /> : <span>{i + 1}</span>}
            </span>
            <span className="reef-steps__text">
              <span className="reef-steps__title">{item.title}</span>
              {item.description != null && (
                <span className="reef-steps__description">{item.description}</span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
