import type * as React from 'react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export type SelectSize = 'small' | 'medium' | 'large';

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: SelectOption[];
  /** ponytail: 单复选共用联合类型，按 multiple 区分；可升级为泛型 SelectProps<T extends string> 收窄 */
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: SelectSize;
  invalid?: boolean;
  /** 占满整行宽度 */
  block?: boolean;
  /** 多选：value/onChange 变为 string[]，触发器内以可关闭 Tag 渲染 */
  multiple?: boolean;
  /** 可搜索：面板顶部渲染搜索框，按 label 大小写不敏感过滤 */
  searchable?: boolean;
  /** 表单字段名：渲染隐藏 input，使值进入 FormData、参与 Form 校验 */
  name?: string;
}
