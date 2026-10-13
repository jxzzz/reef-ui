import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { useState } from 'react';
import { Button } from '../button';
import { Popover } from './Popover';

afterEach(cleanup);

describe('Popover', () => {
  test('hover 触发：mouseenter 显示内容，mouseleave 150ms 后关闭', () => {
    vi.useFakeTimers();
    try {
      render(
        <Popover title="标题" content="卡片内容">
          <Button>触发</Button>
        </Popover>,
      );
      const root = screen.getByRole('button', { name: '触发' }).parentElement!;

      fireEvent.mouseEnter(root);
      expect(screen.getByText('卡片内容')).toBeTruthy();
      expect(screen.getByText('标题')).toBeTruthy();

      fireEvent.mouseLeave(root);
      expect(screen.getByText('卡片内容')).toBeTruthy(); // 延迟内不关

      act(() => {
        vi.advanceTimersByTime(151);
      });
      expect(screen.queryByText('卡片内容')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  test('click 触发：点击开关，点击卡片内部不关闭', async () => {
    render(
      <Popover content="卡片内容" trigger="click">
        <Button>触发</Button>
      </Popover>,
    );

    expect(screen.queryByText('卡片内容')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: '触发' }));
    expect(screen.getByText('卡片内容')).toBeTruthy();

    // 卡片在 root span 内，点击卡片内容不冒泡到触发器
    await userEvent.click(screen.getByText('卡片内容'));
    expect(screen.getByText('卡片内容')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: '触发' }));
    expect(screen.queryByText('卡片内容')).toBeNull();
  });

  test('click 模式：点击外部关闭', async () => {
    render(
      <>
        <Popover content="卡片内容" trigger="click">
          <Button>触发</Button>
        </Popover>
        <button type="button">外部</button>
      </>,
    );

    await userEvent.click(screen.getByRole('button', { name: '触发' }));
    expect(screen.getByText('卡片内容')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: '外部' }));
    expect(screen.queryByText('卡片内容')).toBeNull();
  });

  test('title 可选：不传时不渲染标题节点', async () => {
    const { container } = render(
      <Popover content="只有内容" trigger="click">
        <Button>触发</Button>
      </Popover>,
    );
    await userEvent.click(screen.getByRole('button', { name: '触发' }));

    expect(container.querySelector('.reef-popover__title')).toBeNull();
    expect(container.querySelector('.reef-popover__content')).toBeTruthy();
  });

  test('受控 visible：由使用方控制开关，onChange 收到变化', async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [visible, setVisible] = useState(false);
      return (
        <Popover
          content="卡片内容"
          trigger="click"
          visible={visible}
          onChange={(v) => {
            onChange(v);
            setVisible(v);
          }}
        >
          <Button>触发</Button>
        </Popover>
      );
    }
    render(<Controlled />);

    await userEvent.click(screen.getByRole('button', { name: '触发' }));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('卡片内容')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: '触发' }));
    expect(onChange).toHaveBeenCalledWith(false);
    expect(screen.queryByText('卡片内容')).toBeNull();
  });

  test('placement 透出对应 modifier 类', () => {
    const { container } = render(
      <Popover content="卡片内容" placement="bottom">
        <span>目标</span>
      </Popover>,
    );

    expect(container.firstElementChild!.className).toContain('reef-popover--bottom');
  });
});
