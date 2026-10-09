import type * as React from 'react';

export interface TabsItem {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
}

export interface TabsProps {
  items: TabsItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  className?: string;
}
