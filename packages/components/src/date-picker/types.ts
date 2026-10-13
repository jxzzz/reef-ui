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
  /** 表单字段名：写到原生 input 上，使值进入 FormData、参与 Form 校验 */
  name?: string;
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
  /** 表单字段名：起止两个 input 共用，FormData.getAll(name) 得到 [起, 止] */
  name?: string;
  className?: string;
}
