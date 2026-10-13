import type * as React from 'react';

export interface AnchorItem {
  key: string;
  title: React.ReactNode;
  /** 目标选择器，如 '#section-1' */
  href: string;
}

export interface AnchorProps {
  items: AnchorItem[];
  /** 受控激活项 */
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>, item: AnchorItem) => void;
  className?: string;
}
