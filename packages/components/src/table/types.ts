import type * as React from 'react';

export type TableSortOrder = 'asc' | 'desc';

export interface TableColumn<T = Record<string, unknown>> {
  /** 列标识，作为单元格 key 与排序状态 key */
  key: string;
  /** 表头 */
  title: React.ReactNode;
  /** 列宽（px），不传自动分配 */
  width?: number;
  align?: 'left' | 'center' | 'right';
  /** 溢出省略号 */
  ellipsis?: boolean;
  /** 单元格内容，缺省取 record[key] */
  render?: (record: T, index: number) => React.ReactNode;
  /** 传入即启用排序（点击表头 asc ⇄ desc） */
  sorter?: (a: T, b: T) => number;
}

export interface TableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  dataSource: T[];
  /** 行 key，缺省用数组下标；数据有增删时建议传 */
  rowKey?: keyof T | ((record: T, index: number) => string);
  className?: string;
  empty?: React.ReactNode;
}
