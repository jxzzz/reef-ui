import type * as React from 'react';

/** 日期一律用 YYYY-MM-DD 字符串，与 Form 的 FormData 读取天然兼容 */
export type DateString = string;

export type DateRange = [DateString | null, DateString | null];

export interface DatePickerProps {
  value?: DateString;
  defaultValue?: DateString;
  onChange?: (value: DateString) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  block?: boolean;
  /** 禁用日期（禁选），返回 true 则不可点 */
  isDisabled?: (date: Date) => boolean;
  className?: string;
}

export interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (value: DateRange) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  block?: boolean;
  isDisabled?: (date: Date) => boolean;
  className?: string;
}
