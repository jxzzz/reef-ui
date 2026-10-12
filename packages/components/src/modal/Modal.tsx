import { useEffect, useId, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@reef-ui/utils';
import { useLocale } from '../locale';
import type { ModalProps } from './types';
import './modal.css';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function Modal({ open, title, width = 480, footer, onClose, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const t = useLocale();

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    // ponytail: 直接置 body overflow，多弹窗叠加时需改为计数器
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose?.();
      return;
    }
    if (e.key !== 'Tab') return;
    // 简易焦点圈：Shift+Tab 在第一个、Tab 在最后一个时绕回
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
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

  // ponytail: 不给遮罩下的背景内容加 aria-hidden（需遍历应用根节点或用 inert），
  // aria-modal + 焦点圈已保证键盘/读屏基本不会逃逸到背景
  return createPortal(
    <div
      className="reef-modal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        tabIndex={-1}
        style={{ width }}
        className={cn('reef-modal__dialog', className)}
        onKeyDown={handleKeyDown}
      >
        {title != null && (
          <div className="reef-modal__header">
            <h4 id={titleId} className="reef-modal__title">{title}</h4>
            <button type="button" className="reef-modal__close" aria-label={t.Modal.close} onClick={() => onClose?.()}>
              ×
            </button>
          </div>
        )}
        <div className="reef-modal__body">{children}</div>
        {footer != null && <div className="reef-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
