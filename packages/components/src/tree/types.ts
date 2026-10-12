import type * as React from 'react';

export interface TreeNode {
  key: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onChange' | 'defaultValue'> {
  treeData: TreeNode[];
  /** 选中节点 key（受控，单选） */
  value?: string;
  defaultValue?: string;
  onChange?: (key: string) => void;
  /** 初始展开的节点 key（非受控） */
  defaultExpandedKeys?: string[];
  /** 展开的节点 key（受控） */
  expandedKeys?: string[];
  onExpandedKeysChange?: (keys: string[]) => void;
  /** 节点是否可选中，默认 true */
  selectable?: boolean;
  /** 禁用整棵树 */
  disabled?: boolean;
}
