import type * as React from 'react';

export interface TransferItem {
  /** 项唯一标识 */
  key: string;
  /** 项标题 */
  title: React.ReactNode;
  /** 禁用项：不可勾选、不可移动，始终未选中 */
  disabled?: boolean;
}

export type TransferDirection = 'left' | 'right';

export interface TransferProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 数据源 */
  dataSource: TransferItem[];
  /** 受控：已在右侧面板的 key 列表 */
  targetKeys?: string[];
  /** 非受控：初始右侧面板的 key 列表 */
  defaultTargetKeys?: string[];
  /** 移动完成回调，direction 为移动方向，movedKeys 为本次移动的 key */
  onChange?: (targetKeys: string[], direction: TransferDirection, movedKeys: string[]) => void;
  /** 面板标题，[左, 右] */
  titles?: [React.ReactNode, React.ReactNode];
  /** 是否显示搜索框，按 title 过滤（不区分大小写） */
  searchable?: boolean;
  /** 表单字段名：渲染隐藏 input，使值进入 FormData、参与 Form 校验 */
  name?: string;
  /** 整体禁用 */
  disabled?: boolean;
}
