import { createPortal } from 'react-dom';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import type { MessageProps } from './types';
import './message.css';

export function Message({ items, onClose, className }: MessageProps) {
  if (items.length === 0) return null;
  return createPortal(
    <div role="status" className={cn('reef-message', className)}>
      {items.map((item) => (
        <div key={item.key} data-type={item.type ?? 'info'} className="reef-message__item">
          <span className="reef-message__content">{item.content}</span>
          {onClose && (
            <button
              type="button"
              className="reef-message__close"
              aria-label="关闭"
              onClick={() => onClose(item.key)}
            >
              <Icon name="close" size={12} />
            </button>
          )}
        </div>
      ))}
    </div>,
    document.body,
  );
}
