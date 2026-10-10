import type * as React from 'react';

export interface AvatarProps {
  /** 图片地址；加载失败回退到 children */
  src?: string;
  alt?: string;
  /** 边长（px） */
  size?: number;
  shape?: 'circle' | 'square';
  /** 无图或加载失败时的回退内容（文本/图标） */
  children?: React.ReactNode;
  className?: string;
}
