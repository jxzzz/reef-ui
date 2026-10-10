import type * as React from 'react';

export interface CardProps {
  title?: React.ReactNode;
  /** 标题右侧操作区 */
  extra?: React.ReactNode;
  /** 底部区域 */
  footer?: React.ReactNode;
  bordered?: boolean;
  /** 悬停时浮起 */
  hoverable?: boolean;
  children?: React.ReactNode;
  className?: string;
}
