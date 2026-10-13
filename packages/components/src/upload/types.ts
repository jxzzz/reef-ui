import type * as React from 'react';

/** 单文件上传状态 */
export type UploadStatus = 'uploading' | 'success' | 'error';

export interface UploadProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'defaultValue' | 'onError' | 'onProgress' | 'onSuccess'
  > {
  /** 受控文件列表 */
  value?: File[];
  /** 非受控初始文件列表 */
  defaultValue?: File[];
  /** 抛出完整文件列表（合并/去重/截断后的结果）；HTTP 模式下状态变化也会再次触发 */
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
  /** 上传地址；不传时仅收集文件列表，不发任何网络请求（即默认行为） */
  action?: string;
  /** 上传前校验；返回 false（或 resolve false）则该文件不入列表也不上传 */
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  /** 上传进度回调，percent 为 0-100 */
  onProgress?: (percent: number, file: File) => void;
  /** 上传成功回调，response 为服务端响应体（能 JSON.parse 则为对象，否则为原始文本） */
  onSuccess?: (response: unknown, file: File) => void;
  /** 上传失败回调（网络错误或非 2xx） */
  onError?: (error: unknown, file: File) => void;
  /** 附加请求头 */
  headers?: Record<string, string>;
  /** 上传表单字段名，默认 'file' */
  name?: string;
  /** 跨域请求携带 cookie */
  withCredentials?: boolean;
}
