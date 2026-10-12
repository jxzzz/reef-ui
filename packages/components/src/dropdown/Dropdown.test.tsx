import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { useState } from 'react';
import { Dropdown } from './Dropdown';
import type { DropdownItem } from './types';

afterEach(cleanup);

const actions: DropdownItem[] = [
  { key: 'edit', label: '编辑' },
  { key: 'copy', label: '复制' },
  { key: 'd1', label: '', type: 'divider' },
  { key: 'delete', label: '删除', danger: true },
];

const menu = () => screen.queryByRole('menu');

describe('Dropdown', () => {
  test('click 模式：点击触发器开关，aria-expanded 随开合切换', async () => {
    render(
      <Dropdown items={actions}>
        <button type="button">操作</button>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: '操作' });
    expect(menu()).toBeNull();
    expect(trigger.parentElement?.getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(trigger);
    expect(menu()).toBeTruthy();
    expect(trigger.parentElement?.getAttribute('aria-expanded')).toBe('true');

    await userEvent.click(trigger);
    expect(menu()).toBeNull();
  });

  test('hover 模式：mouseenter 打开', () => {
    render(
      <Dropdown items={actions} trigger="hover">
        <button type="button">操作</button>
      </Dropdown>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: '操作' }).parentElement!);
    expect(menu()).toBeTruthy();
  });

  test('hover 模式：mouseleave 150ms 后才关闭', () => {
    vi.useFakeTimers();
    try {
      render(
        <Dropdown items={actions} trigger="hover">
          <button type="button">操作</button>
        </Dropdown>,
      );
      const root = screen.getByRole('button', { name: '操作' }).parentElement!;

      fireEvent.mouseEnter(root);
      fireEvent.mouseLeave(root);
      vi.advanceTimersByTime(149);
      expect(menu()).toBeTruthy();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(menu()).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  test('点击项触发 onItemClick 并关闭（非受控）', async () => {
    const onItemClick = vi.fn();
    render(
      <Dropdown items={actions} onItemClick={onItemClick}>
        <button type="button">操作</button>
      </Dropdown>,
    );

    await userEvent.click(screen.getByRole('button', { name: '操作' }));
    await userEvent.click(screen.getByRole('menuitem', { name: '编辑' }));
    expect(onItemClick).toHaveBeenCalledWith('edit');
    expect(menu()).toBeNull();
  });

  test('受控 open：点击项不自动关闭，由使用方控制', async () => {
    const onItemClick = vi.fn();
    function Controlled() {
      const [open] = useState(true);
      return (
        <Dropdown items={actions} open={open} onItemClick={onItemClick}>
          <button type="button">操作</button>
        </Dropdown>
      );
    }
    render(<Controlled />);

    expect(menu()).toBeTruthy();
    await userEvent.click(screen.getByRole('menuitem', { name: '编辑' }));
    expect(onItemClick).toHaveBeenCalledWith('edit');
    // 受控 open 未变，菜单仍在
    expect(menu()).toBeTruthy();
  });

  test('disabled 项点击无效果', async () => {
    const onItemClick = vi.fn();
    render(
      <Dropdown items={[{ key: 'x', label: '不可用', disabled: true }]} onItemClick={onItemClick}>
        <button type="button">操作</button>
      </Dropdown>,
    );

    await userEvent.click(screen.getByRole('button', { name: '操作' }));
    await userEvent.click(screen.getByRole('menuitem', { name: '不可用' }));
    expect(onItemClick).not.toHaveBeenCalled();
    expect(menu()).toBeTruthy();
  });

  test('divider 渲染为 separator', async () => {
    render(
      <Dropdown items={actions}>
        <button type="button">操作</button>
      </Dropdown>,
    );

    await userEvent.click(screen.getByRole('button', { name: '操作' }));
    expect(screen.getByRole('separator')).toBeTruthy();
  });

  test('Escape 关闭', async () => {
    render(
      <Dropdown items={actions}>
        <button type="button">操作</button>
      </Dropdown>,
    );

    await userEvent.click(screen.getByRole('button', { name: '操作' }));
    expect(menu()).toBeTruthy();

    await userEvent.keyboard('{Escape}');
    expect(menu()).toBeNull();
  });

  test('键盘：↓ 移动高亮，Enter 激活', async () => {
    const onItemClick = vi.fn();
    render(
      <Dropdown items={actions} onItemClick={onItemClick}>
        <button type="button">操作</button>
      </Dropdown>,
    );

    const trigger = screen.getByRole('button', { name: '操作' });
    await userEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: '编辑' }).getAttribute('aria-current')).toBe('true');

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('menuitem', { name: '复制' }).getAttribute('aria-current')).toBe('true');

    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onItemClick).toHaveBeenCalledWith('copy');
    expect(menu()).toBeNull();
  });
});
