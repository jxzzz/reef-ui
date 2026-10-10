import type { ReactNode } from 'react';

export interface DescriptionsItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
}

export interface DescriptionsProps {
  items: DescriptionsItem[];
  /** 列数 */
  column?: number;
  /** 是否带边框 */
  bordered?: boolean;
  title?: ReactNode;
  className?: string;
}
