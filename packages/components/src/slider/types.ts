import type * as React from 'react';

export interface SliderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  value?: number;
  /** 未传时取 min */
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** 最小值 */
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}
