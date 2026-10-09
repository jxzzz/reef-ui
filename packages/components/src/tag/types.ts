import type * as React from 'react';

export type TagColor = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** 预设色 */
  color?: TagColor;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 点击关闭按钮回调（隐藏由外部控制） */
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
}
