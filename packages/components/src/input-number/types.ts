import type * as React from 'react';

export type InputNumberValue = number | null;

export interface InputNumberProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'size'> {
  value?: InputNumberValue;
  defaultValue?: InputNumberValue;
  /** null 表示空 */
  onChange?: (value: InputNumberValue) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: 'small' | 'medium' | 'large';
  invalid?: boolean;
  block?: boolean;
  className?: string;
}
