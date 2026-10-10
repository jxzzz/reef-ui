import type { ReactNode } from 'react';

export interface MessageItem {
  key: string;
  /** 消息类型，决定文字强调色 */
  type?: 'info' | 'success' | 'warning' | 'danger';
  content: ReactNode;
}

export interface MessageProps {
  /** 消息列表（父级受控） */
  items: MessageItem[];
  /** 单条关闭回调，携带该条 key */
  onClose?: (key: string) => void;
  className?: string;
}
