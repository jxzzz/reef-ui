import type * as React from 'react';

export interface PopconfirmProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'title'> {
  /** 确认文案，必填 */
  title: React.ReactNode;
  /** 补充说明，展示在标题下方 */
  description?: React.ReactNode;
  /** 受控显隐；传入后由使用方在 onConfirm/onCancel 中控制关闭 */
  open?: boolean;
  /** 非受控默认显隐 */
  defaultOpen?: boolean;
  /** 点击确定按钮的回调 */
  onConfirm?: () => void;
  /** 点击取消按钮的回调 */
  onCancel?: () => void;
  /** 气泡方向，默认出现在触发器上方 */
  placement?: 'top' | 'bottom';
  /** 禁用后点击不再弹出气泡 */
  disabled?: boolean;
}
