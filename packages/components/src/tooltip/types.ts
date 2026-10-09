import type * as React from 'react';

export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 气泡文案 */
  title: string;
  /** 显示位置 */
  placement?: 'top' | 'bottom';
}
