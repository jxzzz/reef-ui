import type * as React from 'react';

export interface EmptyProps {
  description?: React.ReactNode;
  /** 底部操作区（如"新建"按钮） */
  children?: React.ReactNode;
  className?: string;
}
