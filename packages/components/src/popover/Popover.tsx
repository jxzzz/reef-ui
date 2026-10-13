import { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { PopoverProps } from './types';
import './popover.css';

export const Popover = forwardRef<HTMLSpanElement, PopoverProps>(
  (
    {
      content,
      title,
      trigger = 'hover',
      placement = 'top',
      visible,
      defaultVisible = false,
      onChange,
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const [inner, setInner] = useState(defaultVisible);
    const rootRef = useRef<HTMLSpanElement | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 支持受控 / 非受控两种用法；受控时不自动关闭，由使用方在 onChange 里关
    const isOpen = visible !== undefined ? visible : inner;
    const change = (next: boolean) => {
      if (next === isOpen) return;
      onChange?.(next);
      if (visible === undefined) setInner(next);
    };
    const close = () => change(false);

    // forwardRef 和外点检测共用同一个 span，合并 ref
    const setRef = (node: HTMLSpanElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
    };

    const onTriggerClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      onClick?.(e);
      if (trigger !== 'click' || e.defaultPrevented) return;
      if (closeTimer.current) clearTimeout(closeTimer.current);
      change(!isOpen);
    };

    const onMouseEnter = () => {
      if (trigger !== 'hover') return;
      if (closeTimer.current) clearTimeout(closeTimer.current);
      change(true);
    };

    // 150ms 延迟关闭，避免划过触发器与卡片间空隙时闪烁
    const onMouseLeave = () => {
      if (trigger !== 'hover') return;
      closeTimer.current = setTimeout(close, 150);
    };

    // click 模式下点击外部 / Escape 关闭（hover 模式移开即关，无需外点检测）
    useEffect(() => {
      if (!isOpen || trigger !== 'click') return;
      const onDoc = (e: MouseEvent) => {
        if (!rootRef.current?.contains(e.target as Node)) close();
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') close();
      };
      document.addEventListener('mousedown', onDoc);
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('mousedown', onDoc);
        document.removeEventListener('keydown', onKey);
      };
    }, [isOpen, visible, trigger]);

    // 悬停关闭定时器随卸载清理
    useEffect(
      () => () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
      },
      [],
    );

    return (
      <span
        ref={setRef}
        className={cn('reef-popover', `reef-popover--${placement}`, className)}
        aria-expanded={isOpen}
        onClick={onTriggerClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        {...rest}
      >
        {children}
        {isOpen && (
          // ponytail: 不做箭头、不按视口翻转、不 portal，绝对定位在 span 内（复用 popconfirm 定位）；
          // 贴边溢出时升级为 createPortal + flip
          <span
            className="reef-popover__card"
            onClick={(e) => e.stopPropagation()}
          >
            {title != null && <span className="reef-popover__title">{title}</span>}
            <span className="reef-popover__content">{content}</span>
          </span>
        )}
      </span>
    );
  },
);

Popover.displayName = 'Popover';
