import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Menu } from './Menu';

const items = [
  { key: 'home', label: '首页' },
  {
    key: 'orders',
    label: '订单管理',
    children: [
      { key: 'order-list', label: '订单列表' },
      { key: 'order-refund', label: '退款管理' },
    ],
  },
  { key: 'exit', label: '退出登录', danger: true },
  {
    key: 'settings-group',
    type: 'group' as const,
    label: '设置',
    children: [{ key: 'profile', label: '个人资料' }],
  },
];

afterEach(cleanup);

describe('Menu', () => {
  test('垂直模式：点击叶子项选中并回调，aria-current 标注选中项', async () => {
    const handleChange = vi.fn();
    render(<Menu items={items} defaultSelectedKey="home" onChange={handleChange} />);

    const home = screen.getByRole('menuitem', { name: '首页' });
    expect(home.getAttribute('aria-current')).toBe('true');
    await userEvent.click(screen.getByRole('menuitem', { name: /订单管理/ })); // 先展开子菜单
    await userEvent.click(screen.getByRole('menuitem', { name: '退款管理' }));
    expect(handleChange).toHaveBeenCalledWith('order-refund');
  });

  test('受控模式：selectedKey 不变则点击不切换', async () => {
    render(<Menu items={items} selectedKey="home" />);

    await userEvent.click(screen.getByRole('menuitem', { name: /订单管理/ }));
    await userEvent.click(screen.getByRole('menuitem', { name: '退款管理' }));
    expect(screen.getByRole('menuitem', { name: '首页' }).getAttribute('aria-current')).toBe('true');
  });

  test('垂直模式：点击子菜单展开/收起，aria-expanded 同步', async () => {
    render(<Menu items={items} />);

    const trigger = screen.getByRole('menuitem', { name: /订单管理/ });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('menuitem', { name: '订单列表' })).toBeNull();

    await userEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menuitem', { name: '订单列表' })).toBeTruthy();

    await userEvent.click(trigger);
    expect(screen.queryByRole('menuitem', { name: '订单列表' })).toBeNull();
  });

  test('分组：标题不可选中，组内项可选', async () => {
    const handleChange = vi.fn();
    render(<Menu items={items} onChange={handleChange} />);

    expect(screen.getByText('设置')).toBeTruthy();
    expect(screen.queryByRole('menuitem', { name: '设置' })).toBeNull();
    await userEvent.click(screen.getByRole('menuitem', { name: '个人资料' }));
    expect(handleChange).toHaveBeenCalledWith('profile');
  });

  test('disabled 项点击不回调', async () => {
    const handleChange = vi.fn();
    render(
      <Menu
        items={[{ key: 'a', label: '可用' }, { key: 'b', label: '禁用', disabled: true }]}
        onChange={handleChange}
      />,
    );

    await userEvent.click(screen.getByRole('menuitem', { name: '禁用' }));
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('水平模式：子菜单项始终在文档中，点击可选中', async () => {
    const handleChange = vi.fn();
    render(<Menu items={items} mode="horizontal" onChange={handleChange} />);

    // 弹出面板的显隐由 CSS :hover / :focus-within 控制，DOM 始终可交互
    await userEvent.click(screen.getByRole('menuitem', { name: '订单列表' }));
    expect(handleChange).toHaveBeenCalledWith('order-list');
  });

  test('收起态：叶子项只显首字，完整 label 放在 title 上', () => {
    render(<Menu items={items} collapsed />);

    const home = screen.getByRole('menuitem', { name: '首' });
    expect(home.getAttribute('title')).toBe('首页');
    expect(screen.queryByRole('menuitem', { name: '首页' })).toBeNull();
  });
});
