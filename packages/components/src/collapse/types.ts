import type * as React from 'react';

export interface CollapseItem {
  key: string;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface CollapseProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  items: CollapseItem[];
  defaultActiveKey?: string[];
  /** 受控展开项的 key */
  activeKey?: string[];
  onChange?: (keys: string[]) => void;
  /** 手风琴模式：最多展开一项 */
  accordion?: boolean;
  expandIconPosition?: 'start' | 'end';
}
