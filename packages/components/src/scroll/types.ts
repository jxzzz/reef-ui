import type { CSSProperties, ReactNode } from 'react';

export interface ScrollProps {
  /** 便捷限高（数字按 px，或任意 CSS 值）；不传时容器尺寸由消费方样式决定 */
  maxHeight?: number | string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
