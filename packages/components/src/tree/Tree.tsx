import { useState, type ReactNode } from 'react';
import { cn } from '@reef-ui/utils';
import { useLocale } from '../locale';
import type { TreeProps, TreeNode } from './types';
import './tree.css';

export function Tree({
  treeData,
  value,
  defaultValue,
  onChange,
  defaultExpandedKeys,
  expandedKeys,
  onExpandedKeysChange,
  selectable = true,
  disabled = false,
  className,
  ...rest
}: TreeProps) {
  const t = useLocale();
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [innerExpanded, setInnerExpanded] = useState<string[]>(defaultExpandedKeys ?? []);

  // 选中与展开均支持受控 / 非受控
  const current = value !== undefined ? value : innerValue;
  const expanded = expandedKeys !== undefined ? expandedKeys : innerExpanded;

  const setExpanded = (keys: string[]) => {
    if (expandedKeys === undefined) setInnerExpanded(keys);
    onExpandedKeysChange?.(keys);
  };

  const toggle = (key: string) => {
    setExpanded(expanded.includes(key) ? expanded.filter((k) => k !== key) : [...expanded, key]);
  };

  const select = (node: TreeNode) => {
    if (disabled || node.disabled || !selectable) return;
    if (value === undefined) setInnerValue(node.key);
    onChange?.(node.key);
  };

  // ponytail: roving tabIndex 只让选中项（无选中则首个根节点）进 Tab 序列；
  // 完整方向键树导航（↑↓←→ Home/End 移动、左右键展开收起）按 WAI-ARIA APG tree 模式后续再补
  const focusKey = current ?? treeData[0]?.key;

  const renderNodes = (nodes: TreeNode[], level: number): ReactNode =>
    nodes.map((node) => {
      const hasChildren = !!node.children?.length;
      const isOpen = expanded.includes(node.key);
      const isSelected = selectable && node.key === current;
      const isDisabled = disabled || node.disabled;
      return (
        <li key={node.key} role="none">
          <div
            role="treeitem"
            aria-level={level}
            aria-selected={selectable ? isSelected : undefined}
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-disabled={isDisabled || undefined}
            tabIndex={node.key === focusKey ? 0 : -1}
            className={cn('reef-tree__node', isDisabled && 'reef-tree__node--disabled')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                select(node);
              }
            }}
          >
            {hasChildren ? (
              <button
                type="button"
                className={cn('reef-tree__arrow', { 'reef-tree__arrow--open': isOpen })}
                aria-label={isOpen ? t.Tree.collapse : t.Tree.expand}
                disabled={disabled}
                onClick={() => toggle(node.key)}
              >
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <span className="reef-tree__arrow" aria-hidden="true" />
            )}
            <span
              className={cn('reef-tree__label', {
                'reef-tree__label--selected': isSelected,
                'reef-tree__label--disabled': isDisabled,
              })}
              onClick={() => select(node)}
            >
              {node.label}
            </span>
          </div>
          {hasChildren && isOpen && (
            <ul role="group" className="reef-tree__children">
              {renderNodes(node.children!, level + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul role="tree" className={cn('reef-tree', className)} {...rest}>
      {renderNodes(treeData, 1)}
    </ul>
  );
}
