import type { ReactNode } from 'react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationArgs {
  /** 通知类型；open() 可省略（默认 info），快捷方法固定各自类型 */
  type?: NotificationType;
  /** 标题 */
  title: ReactNode;
  /** 可选正文内容 */
  content?: ReactNode;
  /** 自动关闭延时（毫秒），0 表示不自动关闭 */
  duration?: number;
}

export interface NotificationItem {
  key: string;
  type: NotificationType;
  title: ReactNode;
  content?: ReactNode;
  duration: number;
  /** 退出动画播放中，动画结束后真正移除 */
  closing?: boolean;
}
