import type { ReactNode } from 'react';

export interface DividerProps {
  /** 垂直分割线 */
  vertical?: boolean;
  /** 虚线样式 */
  dashed?: boolean;
  /** 分割线文字 */
  children?: ReactNode;
  className?: string;
}
