export interface ProgressProps {
  /** 0-100，越界钳制 */
  percent: number;
  size?: 'small' | 'medium';
  status?: 'normal' | 'success' | 'error';
  /** 是否显示右侧百分比文本 */
  showInfo?: boolean;
  className?: string;
}
