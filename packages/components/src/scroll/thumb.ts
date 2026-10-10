export const MIN_THUMB = 24;

export interface ThumbGeometry {
  /** 滑块沿轴长度（px）；不需要滚动时为 0 */
  size: number;
  /** 滑块沿轴偏移（px），相对轨道起点 */
  offset: number;
  /** 该轴是否真的溢出、需要滚动条 */
  needed: boolean;
}

/**
 * 由视口/内容/滚动位置算滑块几何。track 为轨道可用长度
 * （轨道长减去上下（左右）各 4px 内边距）。
 */
export function calcThumb(viewport: number, content: number, scroll: number, track: number): ThumbGeometry {
  const needed = content > viewport;
  if (!needed) return { size: 0, offset: 0, needed: false };
  const size = Math.max(MIN_THUMB, track * (viewport / content));
  const maxScroll = content - viewport;
  const offset = maxScroll <= 0 ? 0 : (scroll / maxScroll) * (track - size);
  return { size, offset, needed: true };
}
