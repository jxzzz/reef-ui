import type { ReactNode } from 'react';

export interface SkeletonProps {
  /** 是否加载中；false 时渲染 children */
  loading?: boolean;
  /** 是否显示头像占位 */
  avatar?: boolean;
  /** 占位行数 */
  rows?: number;
  /** 加载完成的真实内容 */
  children?: ReactNode;
  className?: string;
}
