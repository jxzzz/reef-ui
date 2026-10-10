import type * as React from 'react';

export interface BreadcrumbItem {
  key?: string;
  title: React.ReactNode;
  /** 有 href 渲染为链接（最后一项除外） */
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}
