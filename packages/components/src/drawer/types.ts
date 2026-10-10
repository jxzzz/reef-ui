import type { ReactNode } from 'react';

export interface DrawerProps {
  /** 是否打开 */
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  /** 抽屉位置 */
  placement?: 'right' | 'left';
  /** 面板宽度（px） */
  width?: number;
  /** 底部操作区 */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}
