import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { AlertProps } from './types';
import './alert.css';

export function Alert({ type = 'info', title, closable = false, onClose, className, children }: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div role="alert" className={cn('reef-alert', `reef-alert--${type}`, className)}>
      <div className="reef-alert__head">
        <span className="reef-alert__title">{title}</span>
        {closable && (
          <button
            type="button"
            className="reef-alert__close"
            aria-label="关闭"
            onClick={() => {
              setVisible(false);
              onClose?.();
            }}
          >
            ×
          </button>
        )}
      </div>
      {children != null && <div className="reef-alert__content">{children}</div>}
    </div>
  );
}
