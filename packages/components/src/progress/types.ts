export interface ProgressProps {
  /** 0-100，越界钳制 */
  percent: number;
  /** line 条形 / circle 圆环 */
  type?: 'line' | 'circle';
  /** 条形为轨道高度档位；圆环为直径档位（small 64 / medium 96） */
  size?: 'small' | 'medium';
  status?: 'normal' | 'success' | 'error';
  /** 是否显示右侧百分比文本 */
  showInfo?: boolean;
  className?: string;
}
