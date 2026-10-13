import type * as React from 'react';

export interface TreeNode {
  key: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  /** 显式声明为叶子节点：即使没有 children 也不会触发 loadData */
  isLeaf?: boolean;
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
  /** 节点前渲染复选框（多选） */
  checkable?: boolean;
  /** 勾选的节点 key（受控） */
  checkedKeys?: string[];
  /** 初始勾选的节点 key（非受控） */
  defaultCheckedKeys?: string[];
  onCheck?: (checkedKeys: string[], info: { checked: boolean; node: TreeNode }) => void;
  /** 勾选时父子级联（默认）；true 时不级联也不联动半选 */
  checkStrictly?: boolean;
  /** 展开无 children 且非 isLeaf 的节点时异步加载其子节点，每个节点只触发一次 */
  loadData?: (node: TreeNode) => Promise<void>;
}
