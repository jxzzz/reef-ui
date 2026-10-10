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
  className?: string;
}
