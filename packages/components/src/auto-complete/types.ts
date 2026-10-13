import type * as React from 'react';

export type AutoCompleteOption = string | { label: string; value: string };

export interface AutoCompleteProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  options: AutoCompleteOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** 输入时按 label 大小写不敏感过滤；false 时输入即展示全部选项 */
  filter?: boolean;
}
