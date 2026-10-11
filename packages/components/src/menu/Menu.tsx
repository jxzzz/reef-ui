import { Fragment, useState, type ReactNode } from 'react';
import { cn } from '@reef-ui/utils';
import type { MenuItem, MenuProps } from './types';
import './menu.css';

/** 收起态窄条的占位字符：无 icon 时取 label 首字 */
const initial = (label: MenuItem['label']) => (typeof label === 'string' ? label.slice(0, 1) : '·');

function Arrow({ open }: { open?: boolean }) {
  return (
    <svg
      className={cn('reef-menu__arrow', open && 'reef-menu__arrow--open')}
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Menu({
  items,
  mode = 'vertical',
  selectedKey,
  defaultSelectedKey,
  onChange,
  collapsed = false,
  className,
}: MenuProps) {
  const [inner, setInner] = useState(defaultSelectedKey ?? '');
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const current = selectedKey ?? inner;
  // 展开状态只存在于垂直内联模式；水平与收起态的弹出面板由 CSS :hover / :focus-within 控制
  const inline = mode === 'vertical' && !collapsed;

  const select = (key: string) => {
    if (selectedKey === undefined) setInner(key);
    onChange?.(key);
  };

  const toggle = (key: string) => {
    setOpenKeys((keys) => (keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]));
  };

  const renderItem = (item: MenuItem, depth: number): ReactNode => {
    // 收起窄条只作用于顶层；弹出面板内的项始终完整展示
    const rail = collapsed && depth === 0;
    const selected = item.key === current;

    if (item.type === 'group') {
      // 收起态分组降级为分隔线 + 平铺（窄条上没有标题的位置）
      if (rail) {
        return (
          <Fragment key={item.key}>
            <li className="reef-menu__divider" role="separator" />
            {item.children?.map((child) => renderItem(child, depth))}
          </Fragment>
        );
      }
      return (
        <li key={item.key} className="reef-menu__group" role="none">
          <span className="reef-menu__group-title">{item.label}</span>
          <ul className="reef-menu__list" role="group">
            {item.children?.map((child) => renderItem(child, depth))}
          </ul>
        </li>
      );
    }

    const icon = item.icon && <span className="reef-menu__icon">{item.icon}</span>;

    if (item.children) {
      if (!inline) {
        // 水平模式 / 收起窄条：触发器 + 纯 CSS 弹出面板
        return (
          <li key={item.key} className="reef-menu__item--submenu" role="none">
            <button
              type="button"
              role="menuitem"
              aria-haspopup="true"
              className={cn('reef-menu__item', selected && 'reef-menu__item--selected', item.danger && 'reef-menu__item--danger', rail && 'reef-menu__item--rail')}
              title={rail && typeof item.label === 'string' ? item.label : undefined}
            >
              {rail ? <span className="reef-menu__icon">{item.icon ?? initial(item.label)}</span> : icon}
              {!rail && <span className="reef-menu__label">{item.label}</span>}
              {!rail && <Arrow />}
            </button>
            <ul className="reef-menu__popup" role="menu">
              {item.children.map((child) => renderItem(child, depth + 1))}
            </ul>
          </li>
        );
      }
      const open = openKeys.includes(item.key);
      return (
        <li key={item.key} role="none">
          <button
            type="button"
            role="menuitem"
            aria-expanded={open}
            className={cn('reef-menu__item', selected && 'reef-menu__item--selected', item.danger && 'reef-menu__item--danger')}
            onClick={() => toggle(item.key)}
          >
            {icon}
            <span className="reef-menu__label">{item.label}</span>
            <Arrow open={open} />
          </button>
          {open && (
            <ul className="reef-menu__list reef-menu__list--sub" role="menu">
              {item.children.map((child) => renderItem(child, depth + 1))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.key} role="none">
        <button
          type="button"
          role="menuitem"
          disabled={item.disabled}
          aria-current={selected || undefined}
          className={cn(
            'reef-menu__item',
            selected && 'reef-menu__item--selected',
            item.danger && 'reef-menu__item--danger',
            rail && 'reef-menu__item--rail',
          )}
          title={rail && typeof item.label === 'string' ? item.label : undefined}
          onClick={() => select(item.key)}
        >
          {rail ? <span className="reef-menu__icon">{item.icon ?? initial(item.label)}</span> : icon}
          {!rail && <span className="reef-menu__label">{item.label}</span>}
        </button>
      </li>
    );
  };

  return (
    <nav className={cn('reef-menu', `reef-menu--${mode}`, collapsed && 'reef-menu--collapsed', className)}>
      <ul className="reef-menu__list" role="menu">
        {items.map((item) => renderItem(item, 0))}
      </ul>
    </nav>
  );
}
