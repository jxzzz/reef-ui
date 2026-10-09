import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Tag } from './Tag';

afterEach(cleanup);

describe('Tag', () => {
  test('渲染文本内容', () => {
    render(<Tag color="brand">进行中</Tag>);
    expect(screen.getByText('进行中')).toBeTruthy();
  });

  test('closable 显示关闭按钮，点击触发 onClose', async () => {
    const handleClose = vi.fn();
    render(
      <Tag closable onClose={handleClose}>
        可关闭
      </Tag>,
    );

    await userEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('非 closable 不渲染关闭按钮', () => {
    render(<Tag>静态</Tag>);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
