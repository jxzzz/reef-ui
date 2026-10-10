import type { ReactNode } from 'react';

export interface TimelineItem {
  key?: string;
  /** 节点内容 */
  content: ReactNode;
  /** 自定义节点圆点 */
  dot?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}
