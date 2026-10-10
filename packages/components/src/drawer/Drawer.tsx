import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@reef-ui/utils';
import type { DrawerProps } from './types';
import './drawer.css';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    // ponytail: 与 Modal 相同的直接置 body overflow，多浮层叠加时需改为计数器
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
        return;
      }
      if (e.key !== 'Tab') return;
      // 简易焦点圈：Shift+Tab 在第一个、Tab 在最后一个时绕回（与 Modal 一致）
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={cn('reef-drawer', className)}>
      <div className="reef-drawer__overlay" onClick={() => onClose?.()} />
      <aside
        ref={panelRef}
        className="reef-drawer__panel"
        style={{ width, ...(placement === 'left' ? { left: 0 } : { right: 0 }) }}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
      >
        {title != null && <header className="reef-drawer__head">{title}</header>}
        <div className="reef-drawer__body">{children}</div>
        {footer != null && <footer className="reef-drawer__foot">{footer}</footer>}
      </aside>
    </div>,
    document.body,
  );
}
