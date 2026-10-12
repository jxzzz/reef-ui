import type * as React from 'react';

export interface DropdownItem {
  key: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  /** 'divider' 时渲染分隔线，忽略其余字段 */
  type?: 'item' | 'divider';
}

export interface DropdownProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue'> {
  items: DropdownItem[];
  onItemClick?: (key: string) => void;
  /** 打开方式，默认 'click' */
  trigger?: 'click' | 'hover';
  /** 受控开关（hover 模式不支持受控，悬停交互没有稳定的开关归属） */
  open?: boolean;
  defaultOpen?: boolean;
  placement?: 'bottom-start' | 'bottom-end';
  disabled?: boolean;
}
