import type * as React from 'react';

/**
 * ponytail: 刻意不做真正的 HTTP 上传（因此没有 action 属性）——只收集文件列表，
 * 经 onChange 交由使用方自行上传。需要时再加 `action: string`，
 * 届时接 XMLHttpRequest/fetch 并补 `onProgress` 回调即可。
 */
export interface UploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** 受控文件列表 */
  value?: File[];
  /** 非受控初始文件列表 */
  defaultValue?: File[];
  /** 抛出完整文件列表（合并/去重/截断后的结果） */
  onChange?: (files: File[]) => void;
  /** 允许一次选择多个文件 */
  multiple?: boolean;
  /** 原生 accept，如 "image/*" */
  accept?: string;
  disabled?: boolean;
  /** 显示拖拽区域（默认 true）；为 false 时只渲染文件列表 */
  draggable?: boolean;
  /** 文件数量上限，超出后忽略新文件 */
  maxCount?: number;
}
