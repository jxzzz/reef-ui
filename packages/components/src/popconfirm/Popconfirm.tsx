import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Button } from '../button';
import { useLocale } from '../locale';
import type { PopconfirmProps } from './types';
import './popconfirm.css';

// 触发器是 span 的直接子元素，卡片也在 span 内，加 :scope > 排除卡片里的按钮
const TRIGGER_FOCUSABLE =
  ':scope > button, :scope > [href], :scope > input, :scope > select, :scope > textarea, :scope > [tabindex]:not([tabindex="-1"])';

export const Popconfirm = forwardRef<HTMLSpanElement, PopconfirmProps>(
  (
    {
      title,
      description,
      open,
      defaultOpen = false,
      onConfirm,
      onCancel,
      placement = 'top',
      disabled = false,
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const t = useLocale();
    const titleId = useId();
    const [inner, setInner] = useState(defaultOpen);
    const rootRef = useRef<HTMLSpanElement | null>(null);

    // 支持受控 / 非受控两种用法；受控时不自动关闭，由使用方在回调里关
    const isOpen = open !== undefined ? open : inner;
    const close = () => {
      if (open === undefined) setInner(false);
    };

    // forwardRef 和外点检测共用同一个 span，合并 ref
    const setRef = (node: HTMLSpanElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
    };

    const onTriggerClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      onClick?.(e);
      if (disabled || e.defaultPrevented) return;
      if (open === undefined) setInner(!isOpen);
    };

    // 气泡关闭时焦点随卡片卸载会丢到 body；若焦点在气泡内，还给触发器（span 的直接子元素）。
    // 点击外部关闭不在此路径（焦点不在卡片内），不抢用户的新焦点
    const refocusTrigger = () => {
      const card = rootRef.current?.querySelector('.reef-popconfirm__card');
      if (!card?.contains(document.activeElement)) return;
      rootRef.current?.querySelector<HTMLElement>(TRIGGER_FOCUSABLE)?.focus();
    };

    const confirm = () => {
      refocusTrigger();
      onConfirm?.();
      close();
    };

    const cancel = () => {
      refocusTrigger();
      onCancel?.();
      close();
    };

    // 点击外部 / Escape 关闭
    useEffect(() => {
      if (!isOpen) return;
      const onDoc = (e: MouseEvent) => {
        if (!rootRef.current?.contains(e.target as Node)) close();
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          refocusTrigger();
          close();
        }
      };
      document.addEventListener('mousedown', onDoc);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDoc);
        document.removeEventListener('keydown', onKey);
      };
    }, [isOpen, open]);

    return (
      <span
        ref={setRef}
        className={cn('reef-popconfirm', className)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={onTriggerClick}
        {...rest}
      >
        {children}
        {isOpen && (
          // ponytail: 不做箭头、不按视口翻转、不 portal，绝对定位在 span 内；
          // 贴边溢出时升级为 createPortal + flip（可复用 tooltip 的定位思路）
          <span
            role="dialog"
            aria-labelledby={titleId}
            className={cn('reef-popconfirm__card', `reef-popconfirm__card--${placement}`)}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="reef-popconfirm__body">
              <span id={titleId} className="reef-popconfirm__title">{title}</span>
              {description != null && (
                <span className="reef-popconfirm__description">{description}</span>
              )}
            </span>
            <span className="reef-popconfirm__actions">
              <Button size="small" variant="secondary" onClick={cancel}>
                {t.Popconfirm.cancel}
              </Button>
              <Button size="small" onClick={confirm}>
                {t.Popconfirm.confirm}
              </Button>
            </span>
          </span>
        )}
      </span>
    );
  },
);

Popconfirm.displayName = 'Popconfirm';
