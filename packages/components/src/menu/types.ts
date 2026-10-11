import type { ReactNode } from 'react';

export interface MenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  /** 红色警示项（如“退出登录”） */
  danger?: boolean;
  /** 分组标题，不可选中；children 为组内项 */
  type?: 'group';
  /** 存在时渲染为子菜单 */
  children?: MenuItem[];
}

export interface MenuProps {
  items: MenuItem[];
  /** vertical：侧边导航；horizontal：顶部导航条（子菜单弹出） */
  mode?: 'vertical' | 'horizontal';
  selectedKey?: string;
  defaultSelectedKey?: string;
  onChange?: (key: string) => void;
  /** 仅 vertical：收起为只显图标的窄条，子菜单 hover 弹出 */
  collapsed?: boolean;
  className?: string;
}
