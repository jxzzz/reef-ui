import type * as React from 'react';

export type FormLayout = 'vertical' | 'horizontal' | 'inline';

/** 校验函数：返回错误信息字符串，通过返回 null */
export type Validator = (
  value: string,
  values: Record<string, string>,
) => string | null | undefined;

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /** 布局方向：标签在上 / 左侧标签 / 行内 */
  layout?: FormLayout;
}

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 字段名，作为表单值的 key，配合 validate 使用 */
  name?: string;
  /** 字段标签 */
  label?: React.ReactNode;
  /** 关联的原生控件 id，点击标签聚焦 */
  htmlFor?: string;
  /** 是否必填，标签前显示红色星号 */
  required?: boolean;
  /** 校验函数，提交时由 Form 调用；返回错误信息字符串表示不通过 */
  validate?: Validator;
  /** 校验错误信息，红色；与 help 二选一显示。交给 Form 校验时无需手动传 */
  error?: React.ReactNode;
  /** 辅助说明文字 */
  help?: React.ReactNode;
}
