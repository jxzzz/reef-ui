import type { HTMLAttributes } from 'react';

export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  /** 排列方向，默认水平 */
  direction?: 'vertical' | 'horizontal';
  /** 间距尺寸：small=8px / medium=16px / large=24px，或自定义 px 数值 */
  size?: 'small' | 'medium' | 'large' | number;
  /** 是否自动换行 */
  wrap?: boolean;
  /** 交叉轴对齐方式，不设置则走 flex 默认 stretch */
  align?: 'start' | 'center' | 'end' | 'baseline';
}
