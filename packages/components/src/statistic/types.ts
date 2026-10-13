import type * as React from 'react';

export interface StatisticProps {
  /** 标题，显示在数值上方 */
  title?: React.ReactNode;
  /** 数值；字符串原样展示，不参与精度与千分位处理 */
  value: string | number;
  /** 小数位数，仅对数字生效（toFixed） */
  precision?: number;
  /** 数值前缀，如货币符号 */
  prefix?: React.ReactNode;
  /** 数值后缀，如单位 */
  suffix?: React.ReactNode;
  /** 千分位逗号分组，仅对数字生效，默认 true */
  separator?: boolean;
  /** 加载中，用占位符代替数值 */
  loading?: boolean;
  className?: string;
}
