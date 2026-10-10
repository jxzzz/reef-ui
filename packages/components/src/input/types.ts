import type * as React from 'react';

export type InputSize = 'small' | 'medium' | 'large';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix'> {
  size?: InputSize;
  /** 校验失败态，边框显示危险色 */
  invalid?: boolean;
  /** 占满整行宽度 */
  block?: boolean;
  /** 有内容时显示清空按钮，点击清空并触发 onChange */
  clearable?: boolean;
  /** 前缀（图标、单位等） */
  prefix?: React.ReactNode;
  /** 后缀（图标、单位等） */
  suffix?: React.ReactNode;
}
