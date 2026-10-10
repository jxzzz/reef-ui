import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Message } from './Message';

afterEach(cleanup);

describe('Message', () => {
  test('按序渲染全部消息', () => {
    render(
      <Message
        items={[
          { key: '1', content: '第一条' },
          { key: '2', type: 'success', content: '第二条' },
        ]}
      />,
    );
    expect(screen.getByText('第一条')).toBeTruthy();
    expect(screen.getByText('第二条')).toBeTruthy();
    expect(document.querySelector(".reef-message__item[data-type='success']")).toBeTruthy();
  });

  test('items 为空不渲染任何东西', () => {
    const { container } = render(<Message items={[]} />);
    expect(container.innerHTML).toBe('');
    expect(document.querySelector('.reef-message')).toBeNull();
  });

  test('点关闭按钮触发 onClose 且携带该条 key（Review Focus #3）', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Message
        items={[
          { key: 'first', content: '第一条' },
          { key: 'second', content: '第二条' },
        ]}
        onClose={onClose}
      />,
    );
    const closes = document.querySelectorAll('.reef-message__close');
    await user.click(closes[1]);
    expect(onClose).toHaveBeenCalledWith('second');
    expect(onClose).not.toHaveBeenCalledWith('first');
  });
});
