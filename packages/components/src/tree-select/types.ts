import type * as React from 'react';
import type { TreeNode } from '../tree/types';

export interface TreeSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  treeData: TreeNode[];
  /** ponytail: 单复选共用联合类型，按 multiple 区分；可升级为泛型收窄 */
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  /** 多选：value/onChange 变为 string[]，触发器内以可关闭 Tag 渲染，面板点选不关闭 */
  multiple?: boolean;
  /** 可搜索：面板顶部渲染搜索框，按 label 大小写不敏感过滤并自动展开命中路径 */
  searchable?: boolean;
  disabled?: boolean;
  /** 表单字段名：渲染隐藏 input，使值进入 FormData、参与 Form 校验 */
  name?: string;
  /** 有值时触发器内显示 × 清空按钮；单选清空回调参数为 ''，多选为 [] */
  allowClear?: boolean;
}
