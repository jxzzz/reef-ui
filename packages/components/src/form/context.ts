import { createContext } from 'react';
import type { Validator } from './types';

export interface FormValidation {
  /** FormItem 注册自己的校验函数 */
  register: (name: string, validate: Validator) => void;
  /** 每个字段当前的错误信息 */
  errors: Record<string, string>;
}

export const FormValidationContext = createContext<FormValidation | null>(null);
