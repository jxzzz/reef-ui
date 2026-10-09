import type * as React from 'react';

export type InputSize = 'small' | 'medium' | 'large';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  /** 校验失败态，边框显示危险色 */
  invalid?: boolean;
  /** 占满整行宽度 */
  block?: boolean;
}
