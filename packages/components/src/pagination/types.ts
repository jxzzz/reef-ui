export interface PaginationProps {
  /** 数据总条数 */
  total: number;
  /** 每页条数 */
  pageSize?: number;
  current?: number;
  defaultCurrent?: number;
  onChange?: (page: number) => void;
  className?: string;
}
