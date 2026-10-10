import type * as React from 'react';

export type BadgeColor = 'brand' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  /** 数字；0 或负数不渲染 */
  count?: number;
  /** 只显示圆点 */
  dot?: boolean;
  /** 超过 max 显示 max+ */
  max?: number;
  color?: BadgeColor;
  /** 包裹的内容；缺省时为独立徽标 */
  children?: React.ReactNode;
  className?: string;
}
