import type * as React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** 选中值（RadioGroup 内必填，作为该选项的取值） */
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export interface RadioGroupProps {
  /** 注入到每个子 Radio 的原生 name，FormData 依赖它 */
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}
