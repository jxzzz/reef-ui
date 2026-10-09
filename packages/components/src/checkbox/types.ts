import type * as React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 半选态（父级全选场景），仅样式，选中状态仍由 checked 控制 */
  indeterminate?: boolean;
  /** 标签占满整行 */
  block?: boolean;
}
