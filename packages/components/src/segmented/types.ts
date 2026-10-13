import type { ReactNode } from 'react';

export interface SegmentedOption {
  label: ReactNode;
  value: string;
}

export interface SegmentedProps {
  options: SegmentedOption[];
  /** 受控选中值 */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 表单字段名：渲染隐藏 input，使值进入 FormData、参与 Form 校验 */
  name?: string;
  className?: string;
}
