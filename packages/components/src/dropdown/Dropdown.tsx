import { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { useAnchoredPopup } from '../internal/use-anchored-popup';
import type { DropdownItem, DropdownProps } from './types';
import './dropdown.css';

export const Dropdown = forwardRef<HTMLSpanElement, DropdownProps>(
  (
    {
      items,
      onItemClick,
      trigger = 'click',
      open,
      defaultOpen = false,
      placement = 'bottom-start',
      disabled = false,
      className,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const [inner, setInner] = useState(defaultOpen);
    const [active, setActive] = useState(-1);
    const rootRef = useRef<HTMLSpanElement | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const menuRef = useRef<HTMLSpanElement>(null);

    // 支持受控 / 非受控两种用法；受控时不自动关闭，由使用方在回调里关
    // ponytail: hover 模式不支持受控 open，mouseenter/mouseleave 只改非受控态
    const isOpen = open !== undefined ? open : inner;
    const close = () => {
      if (open === undefined) setInner(false);
    };
    const toggle = (next: boolean) => {
      if (open === undefined) setInner(next);
    };

    // forwardRef 和外点检测共用同一个 span，合并 ref
    const setRef = (node: HTMLSpanElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
    };

    // 浮层进顶层，避开祖先 overflow 裁剪
    useAnchoredPopup(isOpen, rootRef, menuRef, placement.endsWith('-end') ? 'end' : 'start');

    // 可交互项（跳过 divider），键盘导航用
    const actionable = items
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => it.type !== 'divider');

    const pick = (item: DropdownItem) => {
      if (item.disabled) return;
      onItemClick?.(item.key);
      close();
    };

    const onTriggerClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      onClick?.(e);
      if (disabled || trigger !== 'click' || e.defaultPrevented) return;
      toggle(!isOpen);
    };

    const onMouseEnter = () => {
      if (trigger !== 'hover') return;
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (!disabled) toggle(true);
    };

    // 150ms 延迟关闭，避免划过触发器与菜单间空隙时闪烁
    const onMouseLeave = () => {
      if (trigger !== 'hover') return;
      closeTimer.current = setTimeout(close, 150);
    };

    // 点击外部 / Escape 关闭
    useEffect(() => {
      if (!isOpen) return;
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
    }, [isOpen, open]);

    // 打开时重置高亮
    useEffect(() => {
      if (isOpen) setActive(-1);
    }, [isOpen]);

    // 悬停关闭定时器随卸载清理
    useEffect(
      () => () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
      },
      [],
    );

    // 键盘导航：↑↓ 移动高亮，Enter 激活
    // ponytail: 不做 Home/End/子菜单，需要时加按键分支与嵌套结构
    const onKeyDown = (e: React.KeyboardEvent) => {
      if (disabled || !isOpen) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const dir = e.key === 'ArrowDown' ? 1 : -1;
        setActive((a) => {
          const idx = actionable.findIndex(({ i }) => i === a);
          if (idx === -1) return actionable[dir > 0 ? 0 : actionable.length - 1].i;
          return actionable[(idx + dir + actionable.length) % actionable.length].i;
        });
      } else if (e.key === 'Enter') {
        const cur = actionable.find(({ i }) => i === active);
        if (cur) {
          e.preventDefault();
          pick(cur.it);
        }
      }
    };

    return (
      <span
        ref={setRef}
        className={cn('reef-dropdown', className)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onTriggerClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {children}
        {isOpen && (
          <span
            ref={menuRef}
            role="menu"
            className={cn('reef-popup', { 'reef-popup--end': placement.endsWith('-end') }, 'reef-dropdown__menu')}
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((item, i) =>
              item.type === 'divider' ? (
                <hr key={item.key} role="separator" className="reef-dropdown__divider" />
              ) : (
                <span
                  key={item.key}
                  role="menuitem"
                  aria-disabled={item.disabled || undefined}
                  aria-current={i === active || undefined}
                  tabIndex={-1}
                  className={cn('reef-dropdown__item', {
                    'reef-dropdown__item--active': i === active,
                    'reef-dropdown__item--danger': item.danger,
                    'reef-dropdown__item--disabled': item.disabled,
                  })}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(item)}
                >
                  {item.label}
                </span>
              ),
            )}
          </span>
        )}
      </span>
    );
  },
);

Dropdown.displayName = 'Dropdown';
