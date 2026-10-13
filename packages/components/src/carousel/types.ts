import type * as React from 'react';

export interface CarouselProps {
  /** 幻灯片内容，每个子元素为一张 */
  children: React.ReactNode;
  /** 自动播放（默认 false） */
  autoplay?: boolean;
  /** 自动播放间隔毫秒数（默认 3000） */
  interval?: number;
  /** 显示左右箭头（默认 false） */
  arrows?: boolean;
  /** 显示底部指示点（默认 true） */
  dots?: boolean;
  /** 当前幻灯片索引，受控模式 */
  activeIndex?: number;
  /** 初始幻灯片索引 */
  defaultActiveIndex?: number;
  /** 切换回调 */
  onChange?: (index: number) => void;
  /** 悬停时暂停自动播放（默认 true） */
  pauseOnHover?: boolean;
  className?: string;
}

export type CarouselRef = HTMLDivElement;
