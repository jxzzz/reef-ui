import type * as React from 'react';

export interface SpinProps {
  spinning?: boolean;
  size?: 'small' | 'medium' | 'large';
  /** 加载文案；仅在包裹内容时显示 */
  tip?: string;
  /** 包裹的内容；缺省时为独立加载图标 */
  children?: React.ReactNode;
  className?: string;
}
