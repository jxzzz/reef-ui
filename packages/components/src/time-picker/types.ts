import type * as React from 'react';

export interface TimePickerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  /** 'HH:mm:ss' 格式字符串；'' 或 undefined 表示空 */
  value?: string;
  defaultValue?: string;
  /** 选中回调，回传 'HH:mm:ss'；null 表示清空 */
  onChange?: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  /** 表单字段名：渲染隐藏 input，使值进入 FormData、参与 Form 校验 */
  name?: string;
  /** 分钟列步进 */
  minuteStep?: number;
}
