import type { ReactNode } from 'react';

export interface ResultProps {
  /** 结果状态，决定图标与配色 */
  status?: 'success' | 'error' | 'warning' | 'info';
  /** 覆盖默认图标 */
  icon?: ReactNode;
  title?: ReactNode;
  subTitle?: ReactNode;
  /** 操作区 */
  extra?: ReactNode;
  className?: string;
}
