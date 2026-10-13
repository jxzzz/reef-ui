export interface RateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** 受控值（0 ~ count） */
  value?: number;
  /** 非受控初始值 */
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** 星星总数 */
  count?: number;
  disabled?: boolean;
  /** 只读：保留焦点但不可交互 */
  readonly?: boolean;
  /** 再次点击当前值时清零，默认 false */
  allowClear?: boolean;
  /** 表单字段名：渲染隐藏 input，使值进入 FormData、参与 Form 校验 */
  name?: string;
}
