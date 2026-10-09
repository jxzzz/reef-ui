import type * as React from 'react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  /** 语义类型，决定左侧色条与底色 */
  type?: AlertType;
  title: React.ReactNode;
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭回调（隐藏由组件内部完成） */
  onClose?: () => void;
  /** 正文，可选 */
  children?: React.ReactNode;
  className?: string;
}
