import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Modal } from './Modal';

afterEach(cleanup);

describe('Modal', () => {
  test('open 时通过 portal 渲染 dialog，open=false 不渲染', () => {
    const { rerender } = render(
      <Modal open title="标题">
        内容
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: '标题' })).toBeTruthy();
    expect(screen.getByText('内容')).toBeTruthy();

    rerender(
      <Modal open={false} title="标题">
        内容
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('Esc 触发 onClose', async () => {
    const handleClose = vi.fn();
    render(
      <Modal open onClose={handleClose}>
        内容
      </Modal>,
    );

    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('点击遮罩触发 onClose，点击对话框内部不触发', async () => {
    const handleClose = vi.fn();
    render(
      <Modal open onClose={handleClose}>
        <button type="button">内部按钮</button>
      </Modal>,
    );

    await userEvent.click(screen.getByRole('button', { name: '内部按钮' }));
    expect(handleClose).not.toHaveBeenCalled();

    // 遮罩 = dialog 的直接父级
    const overlay = screen.getByRole('dialog').parentElement!;
    await userEvent.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
