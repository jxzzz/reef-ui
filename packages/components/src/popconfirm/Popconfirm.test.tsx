import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { useState } from 'react';
import { Popconfirm } from './Popconfirm';

afterEach(cleanup);

const dialog = () => screen.queryByRole('dialog');

describe('Popconfirm', () => {
  test('默认隐藏，点击触发器打开，aria-expanded 随开合切换', async () => {
    render(
      <Popconfirm title="确定删除吗？">
        <button type="button">删除</button>
      </Popconfirm>,
    );

    expect(dialog()).toBeNull();
    const trigger = screen.getByRole('button', { name: '删除' });
    expect(trigger.parentElement?.getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(trigger);
    expect(dialog()).toBeTruthy();
    expect(trigger.parentElement?.getAttribute('aria-expanded')).toBe('true');
  });

  test('点击确定触发 onConfirm 并关闭（非受控）', async () => {
    const onConfirm = vi.fn();
    render(
      <Popconfirm title="确定删除吗？" onConfirm={onConfirm}>
        <button type="button">删除</button>
      </Popconfirm>,
    );

    await userEvent.click(screen.getByRole('button', { name: '删除' }));
    await userEvent.click(screen.getByRole('button', { name: '确定' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(dialog()).toBeNull();
  });

  test('点击取消触发 onCancel 并关闭', async () => {
    const onCancel = vi.fn();
    render(
      <Popconfirm title="确定删除吗？" onCancel={onCancel}>
        <button type="button">删除</button>
      </Popconfirm>,
    );

    await userEvent.click(screen.getByRole('button', { name: '删除' }));
    await userEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(dialog()).toBeNull();
  });

  test('点击气泡外部关闭', async () => {
    render(
      <Popconfirm title="确定删除吗？">
        <button type="button">删除</button>
      </Popconfirm>,
    );

    await userEvent.click(screen.getByRole('button', { name: '删除' }));
    expect(dialog()).toBeTruthy();

    await userEvent.click(document.body);
    expect(dialog()).toBeNull();
  });

  test('Escape 关闭', async () => {
    render(
      <Popconfirm title="确定删除吗？">
        <button type="button">删除</button>
      </Popconfirm>,
    );

    await userEvent.click(screen.getByRole('button', { name: '删除' }));
    expect(dialog()).toBeTruthy();

    await userEvent.keyboard('{Escape}');
    expect(dialog()).toBeNull();
  });

  test('受控 open：确定后不自动关闭，由使用方控制', async () => {
    const onConfirm = vi.fn();
    function Controlled() {
      const [open] = useState(true);
      return (
        <Popconfirm title="确定删除吗？" open={open} onConfirm={onConfirm}>
          <button type="button">删除</button>
        </Popconfirm>
      );
    }
    render(<Controlled />);

    expect(dialog()).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: '确定' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    // 受控 open 未变，气泡仍在
    expect(dialog()).toBeTruthy();
  });

  test('disabled 点击不打开', async () => {
    render(
      <Popconfirm title="确定删除吗？" disabled>
        <button type="button">删除</button>
      </Popconfirm>,
    );

    await userEvent.click(screen.getByRole('button', { name: '删除' }));
    expect(dialog()).toBeNull();
  });
});
