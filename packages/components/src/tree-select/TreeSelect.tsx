import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { useLocale } from '../locale';
import { useAnchoredPopup } from '../internal/use-anchored-popup';
import { Tag } from '../tag';
import { Tree } from '../tree';
import type { TreeNode } from '../tree/types';
import type { TreeSelectProps } from './types';
import './tree-select.css';

/** 按 label 过滤：保留自身命中或后代命中的节点，命中节点的子树同样参与过滤 */
const filterTree = (nodes: TreeNode[], q: string): TreeNode[] =>
  nodes.reduce<TreeNode[]>((acc, n) => {
    const kids = n.children ? filterTree(n.children, q) : undefined;
    if (n.label.toLowerCase().includes(q.toLowerCase()) || kids?.length) {
      acc.push(kids ? { ...n, children: kids } : n);
    }
    return acc;
  }, []);

/** 搜索时自动展开：收集过滤结果里所有含子节点的 key */
const parentKeys = (nodes: TreeNode[]): string[] =>
  nodes.flatMap((n) => (n.children?.length ? [n.key, ...parentKeys(n.children)] : []));

export const TreeSelect = forwardRef<HTMLDivElement, TreeSelectProps>(
  (
    {
      treeData,
      value,
      defaultValue,
      onChange,
      placeholder,
      multiple = false,
      searchable = false,
      disabled = false,
      allowClear = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const t = useLocale();
    const [open, setOpen] = useState(false);
    const [inner, setInner] = useState<string | string[] | undefined>(defaultValue);
    const [query, setQuery] = useState('');
    const [innerExpanded, setInnerExpanded] = useState<string[]>([]);
    const rootRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // 浮层进顶层，避开祖先 overflow 裁剪
    useAnchoredPopup(open, rootRef, panelRef);

    // 支持受控 / 非受控两种用法
    const current = value !== undefined ? value : inner;
    const arr = multiple ? (Array.isArray(current) ? current : current ? [current] : []) : null;
    const selectedLabel = !multiple && typeof current === 'string' ? current : undefined;

    const labelMap = useMemo(() => {
      const m = new Map<string, string>();
      const walk = (ns: TreeNode[]) => {
        for (const n of ns) {
          m.set(n.key, n.label);
          if (n.children) walk(n.children);
        }
      };
      walk(treeData);
      return m;
    }, [treeData]);

    const visible = useMemo(
      () => (searchable && query ? filterTree(treeData, query) : treeData),
      [treeData, searchable, query],
    );

    // 搜索时强制展开全部命中路径，清空搜索词后回落到用户手动展开的状态
    const expanded = query ? parentKeys(visible) : innerExpanded;

    const commit = (next: string | string[]) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    };

    const pick = (key: string) => {
      if (multiple) {
        const list = arr ?? [];
        // ponytail: 多选模式下面板内不回显选中高亮（Tree 仅支持单选高亮），
        // 选中态由触发器 Tag 列表呈现；需要树内勾选框时升级 Tree 为 checkable
        commit(list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);
      } else {
        commit(key);
        setOpen(false);
        setQuery('');
      }
    };

    const remove = (key: string, e: React.MouseEvent) => {
      e.stopPropagation(); // 阻止冒泡到触发器，避免误开面板
      if (disabled) return;
      commit((arr ?? []).filter((k) => k !== key));
    };

    const clear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      // ponytail: 单选清空回调参数为 ''（ falsy 即无选中），如需 undefined 语义再放宽类型
      commit(multiple ? [] : '');
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

    // 打开面板时重置搜索词
    useEffect(() => {
      if (!open) setQuery('');
    }, [open]);

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(!open);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    const showClear = allowClear && !disabled && (multiple ? arr!.length > 0 : !!selectedLabel);
    // multiple 触发器为 div（内部 Tag/清空按钮是合法 button，不能嵌套 button）；
    // allowClear 且有值时同样退化为 div 以容纳清空按钮
    const asDiv = multiple || showClear;

    const triggerProps = {
      role: 'combobox' as const,
      'aria-haspopup': 'tree' as const,
      'aria-expanded': open,
      className: cn('reef-treeselect__trigger', {
        'reef-treeselect__trigger--open': open,
        'reef-treeselect__trigger--multiple': multiple,
        'reef-treeselect__trigger--disabled': asDiv && disabled,
      }),
      onClick: () => {
        if (!disabled) setOpen(!open);
      },
      onKeyDown,
    };

    const arrow = (
      <svg
        className={cn('reef-treeselect__arrow', { 'reef-treeselect__arrow--open': open })}
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );

    const clearBtn = showClear && (
      <button
        type="button"
        className="reef-treeselect__clear"
        aria-label={t.Tag.close}
        onClick={clear}
      >
        ×
      </button>
    );

    return (
      <div ref={rootRef} className={cn('reef-treeselect', className)} {...rest}>
        {asDiv ? (
          <div
            ref={ref}
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled || undefined}
            {...triggerProps}
          >
            {multiple ? (
              arr!.length > 0 ? (
                <span className="reef-treeselect__tags">
                  {arr!.map((k) => (
                    <Tag
                      key={k}
                      closable
                      onClose={(e) => remove(k, e)}
                      className="reef-treeselect__tag"
                    >
                      {labelMap.get(k) ?? k}
                    </Tag>
                  ))}
                </span>
              ) : (
                <span className="reef-treeselect__value reef-treeselect__value--placeholder">
                  {placeholder ?? '请选择'}
                </span>
              )
            ) : (
              <span
                className={cn('reef-treeselect__value', {
                  'reef-treeselect__value--placeholder': !selectedLabel,
                })}
              >
                {selectedLabel ? labelMap.get(selectedLabel) ?? selectedLabel : placeholder ?? '请选择'}
              </span>
            )}
            {clearBtn}
            {arrow}
          </div>
        ) : (
          <button ref={ref as unknown as React.Ref<HTMLButtonElement>} type="button" disabled={disabled} {...triggerProps}>
            <span
              className={cn('reef-treeselect__value', {
                'reef-treeselect__value--placeholder': !selectedLabel,
              })}
            >
              {selectedLabel ? labelMap.get(selectedLabel) ?? selectedLabel : placeholder ?? '请选择'}
            </span>
            {arrow}
          </button>
        )}
        {open && (
          <div ref={panelRef} className={cn('reef-popup', 'reef-treeselect__panel')}>
            {searchable && (
              <input
                className="reef-treeselect__search"
                value={query}
                placeholder={t.Select.searchPlaceholder}
                aria-label={t.Select.searchPlaceholder}
                onChange={(e) => setQuery(e.target.value)}
              />
            )}
            <Tree
              treeData={visible}
              value={multiple ? '' : selectedLabel ?? ''}
              expandedKeys={expanded}
              onExpandedKeysChange={query ? undefined : setInnerExpanded}
              onChange={pick}
            />
          </div>
        )}
      </div>
    );
  },
);

TreeSelect.displayName = 'TreeSelect';
