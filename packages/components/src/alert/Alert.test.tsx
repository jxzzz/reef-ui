import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Alert } from './Alert';

afterEach(cleanup);

describe('Alert', () => {
  test('渲染标题、正文，容器有 role=alert', () => {
    render(
      <Alert type="warning" title="磁盘空间不足">
        清理后重试
      </Alert>,
    );

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('磁盘空间不足')).toBeTruthy();
    expect(screen.getByText('清理后重试')).toBeTruthy();
  });

  test('closable 点击后消失并触发 onClose', async () => {
    const handleClose = vi.fn();
    render(
      <Alert title="提示" closable onClose={handleClose}>
        内容
      </Alert>,
    );

    await userEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
