import type * as React from 'react';

export type FormLayout = 'vertical' | 'horizontal' | 'inline';

/** 校验函数：返回错误信息字符串，通过返回 null（rules 含异步 validator 时返回 Promise） */
export type Validator = (
  value: string,
  values: Record<string, string>,
) => string | null | undefined | Promise<string | null | undefined>;

/** 单条校验规则，按顺序执行，首个不通过的规则决定错误信息 */
export interface FormRule {
  /** 必填：空字符串 / undefined / null / 空数组视为未通过 */
  required?: boolean;
  /** 字符串按长度、数字按大小比较 */
  min?: number;
  max?: number;
  /** 正则校验，对值做 regex test */
  pattern?: RegExp;
  /** 自定义校验：返回错误信息表示不通过，返回 undefined 表示通过，可返回 Promise */
  validator?: (value: unknown) => string | undefined | Promise<string | undefined>;
  /** 自定义错误信息，覆盖内置文案 */
  message?: string;
  /** 触发时机：默认 change 和 blur 都校验；指定后只在该事件校验 */
  trigger?: 'change' | 'blur';
}

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /** 布局方向：标签在上 / 左侧标签 / 行内 */
  layout?: FormLayout;
  /** 提交校验全部通过时回调，值为从 DOM（FormData）读取的表单值 */
  onFinish?: (values: Record<string, unknown>) => void;
  /** 提交存在校验错误时回调，值为 name 到错误信息的映射 */
  onFinishFailed?: (errors: Record<string, string>) => void;
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
  /** 校验规则列表，按顺序执行；触发 change/blur 即时校验，提交时 Form 统一校验 */
  rules?: FormRule[];
  /** 校验错误信息，红色；与 help 二选一显示。交给 Form 校验时无需手动传 */
  error?: React.ReactNode;
  /** 辅助说明文字 */
  help?: React.ReactNode;
}
