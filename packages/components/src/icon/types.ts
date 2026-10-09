import type * as React from 'react';

export type IconName =
  | 'check'
  | 'close'
  | 'heart'
  | 'layers'
  | 'moon'
  | 'package'
  | 'plus'
  | 'search'
  | 'sliders'
  | 'sun';

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
  /** 像素尺寸，默认 16 */
  size?: number;
  /** 默认 true；仅装饰性图标应保持 true */
  decorative?: boolean;
}
