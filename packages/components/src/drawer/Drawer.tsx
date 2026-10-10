import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@reef-ui/utils';
import type { DrawerProps } from './types';
import './drawer.css';

export function Drawer({
  open,
  onClose,
  title,
  placement = 'right',
  width = 378,
  footer,
  children,
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    // ponytail: 与 Modal 相同的直接置 body overflow，多浮层叠加时需改为计数器
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={cn('reef-drawer', className)}>
      <div className="reef-drawer__overlay" onClick={() => onClose?.()} />
      <aside
        className="reef-drawer__panel"
        style={{ width, ...(placement === 'left' ? { left: 0 } : { right: 0 }) }}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
      >
        {title != null && <header className="reef-drawer__head">{title}</header>}
        <div className="reef-drawer__body">{children}</div>
        {footer != null && <footer className="reef-drawer__foot">{footer}</footer>}
      </aside>
    </div>,
    document.body,
  );
}
