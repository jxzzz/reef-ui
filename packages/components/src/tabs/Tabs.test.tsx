import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Tabs } from './Tabs';

const items = [
  { key: 'a', label: '标签一', children: <p>内容一</p> },
  { key: 'b', label: '标签二', children: <p>内容二</p> },
  { key: 'c', label: '标签三', children: <p>内容三</p> },
];

afterEach(cleanup);

describe('Tabs', () => {
  test('点击切换激活 tab 与 panel，aria-selected 正确', async () => {
    const handleChange = vi.fn();
    render(<Tabs items={items} defaultActiveKey="a" onChange={handleChange} />);

    expect(screen.getByRole('tab', { name: '标签一' }).getAttribute('aria-selected')).toBe('true');
    await userEvent.click(screen.getByRole('tab', { name: '标签二' }));
    expect(handleChange).toHaveBeenCalledWith('b');
    expect(screen.getByText('内容二')).toBeTruthy();
    expect(screen.getByText('内容一').closest('[role="tabpanel"]')).toHaveProperty('hidden', true);
  });

  test('← → 键盘切换，到边界即停不循环', async () => {
    render(<Tabs items={items} defaultActiveKey="a" />);

    const first = screen.getByRole('tab', { name: '标签一' });
    first.focus();
    await userEvent.keyboard('{ArrowLeft}'); // 已在最左，应停在标签一
    expect(screen.getByRole('tab', { name: '标签一' }).getAttribute('aria-selected')).toBe('true');

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: '标签二' }).getAttribute('aria-selected')).toBe('true');
  });

  test('受控模式：activeKey 不变则点击不切换', async () => {
    render(<Tabs items={items} activeKey="a" />);

    await userEvent.click(screen.getByRole('tab', { name: '标签三' }));
    expect(screen.getByRole('tab', { name: '标签一' }).getAttribute('aria-selected')).toBe('true');
  });
});
