import { useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '@reef-ui/utils';
import { useLocale } from '../locale';
import { Checkbox } from '../checkbox';
import { Spin } from '../spin';
import type { TreeProps, TreeNode } from './types';
import './tree.css';

type CheckState = 'checked' | 'indeterminate' | 'none';

/** 收集节点及其全部后代 key */
const collectKeys = (node: TreeNode, acc: string[] = []): string[] => {
  acc.push(node.key);
  node.children?.forEach((c) => collectKeys(c, acc));
  return acc;
};

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
  checkable = false,
  checkedKeys,
  defaultCheckedKeys,
  onCheck,
  checkStrictly = false,
  loadData,
  className,
  ...rest
}: TreeProps) {
  const t = useLocale();
  const [innerValue, setInnerValue] = useState(defaultValue);
  const [innerExpanded, setInnerExpanded] = useState<string[]>(defaultExpandedKeys ?? []);
  const [innerChecked, setInnerChecked] = useState<string[]>(defaultCheckedKeys ?? []);
  const [loadingKeys, setLoadingKeys] = useState<string[]>([]);
  const loadedRef = useRef(new Set<string>());

  // 选中与展开均支持受控 / 非受控
  const current = value !== undefined ? value : innerValue;
  const expanded = expandedKeys !== undefined ? expandedKeys : innerExpanded;
  const checked = checkedKeys !== undefined ? checkedKeys : innerChecked;

  const setExpanded = (keys: string[]) => {
    if (expandedKeys === undefined) setInnerExpanded(keys);
    onExpandedKeysChange?.(keys);
  };

  // key -> 父 key 映射，级联勾选时向上清理祖先用
  const parentMap = useMemo(() => {
    const map = new Map<string, string>();
    const walk = (nodes: TreeNode[], parent?: string) => {
      nodes.forEach((n) => {
        if (parent) map.set(n.key, parent);
        walk(n.children ?? [], n.key);
      });
    };
    walk(treeData);
    return map;
  }, [treeData]);

  // 级联模式下把勾选 key 向下归一化：父 key 勾选视为全部后代勾选
  const checkedSet = useMemo(() => {
    const set = new Set(checked);
    if (!checkStrictly) {
      const nodeOf = new Map<string, TreeNode>();
      const walk = (nodes: TreeNode[]) =>
        nodes.forEach((n) => {
          nodeOf.set(n.key, n);
          walk(n.children ?? []);
        });
      walk(treeData);
      [...set].forEach((key) => {
        const node = nodeOf.get(key);
        if (node) collectKeys(node).forEach((k) => set.add(k));
      });
    }
    return set;
  }, [checked, checkStrictly, treeData]);

  const stateOf = (node: TreeNode): CheckState => {
    if (checkStrictly) return checkedSet.has(node.key) ? 'checked' : 'none';
    // key 在集合中视为全选；不在集合中则由子节点状态推导（覆盖只传父 key 的 defaultCheckedKeys）
    if (checkedSet.has(node.key)) return 'checked';
    if (!node.children?.length) return 'none';
    const states = node.children.map(stateOf);
    if (states.every((s) => s === 'checked')) return 'checked';
    if (states.some((s) => s !== 'none')) return 'indeterminate';
    return 'none';
  };

  const toggleCheck = (node: TreeNode) => {
    if (disabled || node.disabled) return;
    const state = stateOf(node);
    const isChecked = state === 'checked';
    const next = new Set(checkedSet);
    if (checkStrictly) {
      if (isChecked) next.delete(node.key);
      else next.add(node.key);
    } else if (isChecked) {
      collectKeys(node).forEach((k) => next.delete(k));
      // 取消勾选后祖先必不全选，一并移除使其进入半选/未选
      let parent = parentMap.get(node.key);
      while (parent) {
        next.delete(parent);
        parent = parentMap.get(parent);
      }
    } else {
      collectKeys(node).forEach((k) => next.add(k));
    }
    const keys = [...next];
    if (checkedKeys === undefined) setInnerChecked(keys);
    onCheck?.(keys, { checked: !isChecked, node });
  };

  const canLoad = (node: TreeNode) =>
    !!loadData && !node.children?.length && node.isLeaf !== true;

  const toggle = (node: TreeNode) => {
    const isOpen = expanded.includes(node.key);
    setExpanded(isOpen ? expanded.filter((k) => k !== node.key) : [...expanded, node.key]);
    // 首次展开且无子节点时异步加载，每个节点只触发一次
    if (!isOpen && canLoad(node) && !loadedRef.current.has(node.key)) {
      loadedRef.current.add(node.key);
      setLoadingKeys((keys) => [...keys, node.key]);
      Promise.resolve(loadData!(node)).finally(() => {
        setLoadingKeys((keys) => keys.filter((k) => k !== node.key));
      });
    }
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
      const loadable = canLoad(node);
      const showArrow = hasChildren || loadable;
      const isOpen = expanded.includes(node.key);
      const isSelected = selectable && node.key === current;
      const isDisabled = disabled || node.disabled;
      const isLoading = loadingKeys.includes(node.key);
      const checkState = checkable ? stateOf(node) : 'none';
      return (
        <li key={node.key} role="none">
          <div
            role="treeitem"
            aria-level={level}
            aria-selected={selectable ? isSelected : undefined}
            aria-expanded={showArrow ? isOpen : undefined}
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
            {isLoading ? (
              <span className="reef-tree__spinner">
                <Spin size="small" />
              </span>
            ) : showArrow ? (
              <button
                type="button"
                className={cn('reef-tree__arrow', { 'reef-tree__arrow--open': isOpen })}
                aria-label={isOpen ? t.Tree.collapse : t.Tree.expand}
                disabled={disabled}
                onClick={() => toggle(node)}
              >
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <span className="reef-tree__arrow" aria-hidden="true" />
            )}
            {checkable && (
              <Checkbox
                className="reef-tree__checkbox"
                checked={checkState === 'checked'}
                indeterminate={checkState === 'indeterminate'}
                disabled={isDisabled}
                onKeyDown={(e) => e.stopPropagation()}
                onChange={() => toggleCheck(node)}
              />
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
