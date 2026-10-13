import type * as React from 'react';

export interface PopoverProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'title' | 'content' | 'onChange'> {
  /** 卡片内容，必填 */
  content: React.ReactNode;
  /** 卡片标题，展示在内容上方 */
  title?: React.ReactNode;
  /** 触发方式，默认 'hover' */
  trigger?: 'hover' | 'click';
  /** 卡片方向，默认出现在触发器上方 */
  placement?: 'top' | 'bottom';
  /** 受控显隐；传入后由使用方在 onChange 中控制关闭 */
  visible?: boolean;
  /** 非受控默认显隐 */
  defaultVisible?: boolean;
  /** 显隐变化回调 */
  onChange?: (visible: boolean) => void;
}
