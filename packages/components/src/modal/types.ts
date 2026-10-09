import type * as React from 'react';

export interface ModalProps {
  /** 受控开关，必填 */
  open: boolean;
  title?: React.ReactNode;
  /** 宽度（px） */
  width?: number;
  /** 底部操作区（取消/确定按钮由使用方渲染） */
  footer?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}
