import type * as React from 'react';

export interface CascaderOption {
  label: string;
  value: string;
  children?: CascaderOption[];
  disabled?: boolean;
}

export interface CascaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: CascaderOption[];
  /** 选中路径，如 ['zhejiang', 'hangzhou', 'xihu'] */
  value?: string[];
  defaultValue?: string[];
  onChange?: (path: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  /** 占满整行宽度 */
  block?: boolean;
}
