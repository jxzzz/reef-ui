import type * as React from 'react';

export interface StepsItem {
  key: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface StepsProps {
  items: StepsItem[];
  current?: number;
  defaultCurrent?: number;
  /** 提供后步骤可点击 */
  onChange?: (index: number) => void;
  className?: string;
}
