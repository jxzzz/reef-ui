import { forwardRef, useEffect, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { useLocale } from '../locale';
import { useAnchoredPopup } from '../internal/use-anchored-popup';
import type { CascaderOption, CascaderProps } from './types';
import './cascader.css';

/** 按路径逐层查找选项节点，返回途经的节点链；任一层未命中则返回已命中的前缀 */
const findChain = (options: CascaderOption[], path: string[]): CascaderOption[] => {
  const chain: CascaderOption[] = [];
  let list = options;
  for (const v of path) {
    const node = list.find((o) => o.value === v);
    if (!node) break;
    chain.push(node);
    list = node.children ?? [];
  }
  return chain;
};

export const Cascader = forwardRef<HTMLButtonElement, CascaderProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      placeholder,
      disabled = false,
      size = 'medium',
      block = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const t = useLocale();
    const [open, setOpen] = useState(false);
    const [inner, setInner] = useState(defaultValue);
    // 已展开的各级节点：expanded[i] 是第 i 列中被点选的节点，第 i+1 列显示其 children
    const [expanded, setExpanded] = useState<CascaderOption[]>([]);
    const [active, setActive] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);
    const lastColRef = useRef<HTMLUListElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // 浮层进顶层，避开祖先 overflow 裁剪
    useAnchoredPopup(open, rootRef, panelRef);

    // 支持受控 / 非受控两种用法
    const current = value !== undefined ? value : (inner ?? []);
    const labels = findChain(options, current).map((o) => o.label);

    // 面板列：第一列为顶层选项，其后每列对应已展开节点
    const columns: CascaderOption[][] = [options, ...expanded.map((e) => e.children ?? [])];
    const lastCol = columns[columns.length - 1] ?? [];

    const pick = (depth: number, opt: CascaderOption) => {
      if (opt.disabled) return;
      if (opt.children?.length) {
        // 点选非叶子：截断同级已展开项后追加，下一列变为该节点 children
        setExpanded((prev) => [...prev.slice(0, depth), opt]);
        setActive(0);
        return;
      }
      const path = [...expanded.slice(0, depth).map((o) => o.value), opt.value];
      if (value === undefined) setInner(path);
      onChange?.(path);
      setOpen(false);
      (ref as React.RefObject<HTMLButtonElement | null> | null)?.current?.focus();
    };

    // 点击外部关闭
    useEffect(() => {
      if (!open) return;
      const onDoc = (e: MouseEvent) => {
        if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }, [open]);

    // 打开时按当前值展开到对应层级（去掉叶子一级）
    useEffect(() => {
      if (!open) return;
      const chain = findChain(options, current);
      setExpanded(chain.length > 1 ? chain.slice(0, -1) : []);
      setActive(0);
      // ponytail: 依赖只取 open，外部受控值变化不重定位
    }, [open]);

    useEffect(() => {
      if (open) lastColRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
    }, [open, active, expanded.length]);

    const move = (delta: number) => {
      setActive((a) => Math.min(Math.max(a + delta, 0), lastCol.length - 1));
    };

    // ponytail: 只对最后一列做键盘导航（方向键移动 / Enter 选中），已展开列仍需鼠标点选
    const onKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (open && lastCol[active]) pick(columns.length - 1, lastCol[active]);
          else setOpen(true);
          break;
        case 'Escape':
          setOpen(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (open) move(1);
          else setOpen(true);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (open) move(-1);
          else setOpen(true);
          break;
      }
    };

    return (
      <div
        ref={rootRef}
        className={cn('reef-cascader', { 'reef-cascader--block': block }, className)}
        {...rest}
      >
        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="tree"
          disabled={disabled}
          className={cn('reef-cascader__trigger', `reef-cascader__trigger--${size}`)}
          onClick={() => setOpen(!open)}
          onKeyDown={onKeyDown}
        >
          <span
            className={cn(
              'reef-cascader__value',
              labels.length === 0 && 'reef-cascader__value--placeholder',
            )}
          >
            {labels.length > 0 ? labels.join(' / ') : (placeholder ?? t.Cascader.placeholder)}
          </span>
          <svg
            className="reef-cascader__arrow"
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <div ref={panelRef} className={cn('reef-popup', 'reef-cascader__panel')}>
            {columns.map((col, depth) => (
              <ul
                key={depth}
                ref={depth === columns.length - 1 ? lastColRef : undefined}
                className="reef-cascader__col"
                role="listbox"
                tabIndex={-1}
              >
                {col.map((o, i) => (
                  <li
                    key={o.value}
                    role="option"
                    aria-selected={
                      depth < expanded.length
                        ? expanded[depth].value === o.value
                        : current[depth] === o.value
                    }
                    aria-disabled={o.disabled || undefined}
                    className={cn('reef-cascader__option', {
                      'reef-cascader__option--active':
                        depth === columns.length - 1 && i === active,
                      'reef-cascader__option--selected':
                        depth < expanded.length
                          ? expanded[depth].value === o.value
                          : current[depth] === o.value,
                      'reef-cascader__option--disabled': o.disabled,
                    })}
                    onMouseEnter={() => {
                      if (depth === columns.length - 1) setActive(i);
                    }}
                    onClick={() => pick(depth, o)}
                  >
                    {o.label}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )}
      </div>
    );
  },
);

Cascader.displayName = 'Cascader';
