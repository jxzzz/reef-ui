import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Steps } from './Steps';

const items = [
  { key: 'a', title: '填写信息', description: '基本信息' },
  { key: 'b', title: '确认订单' },
  { key: 'c', title: '支付' },
];

afterEach(cleanup);

describe('Steps', () => {
  test('current=1 时第二步 process，之前步骤 finish 显示对勾', () => {
    render(<Steps items={items} defaultCurrent={1} />);

    expect(document.querySelector('.reef-steps__item--process')!.textContent).toContain('确认订单');
    expect(document.querySelector('.reef-steps__item--finish')!.textContent).toContain('填写信息');
    expect(screen.getByText('确认订单').closest('li')!.getAttribute('aria-current')).toBe('step');
  });

  test('点击步骤项触发 onChange(index)', async () => {
    const handleChange = vi.fn();
    render(<Steps items={items} defaultCurrent={0} onChange={handleChange} />);

    await userEvent.click(screen.getByText('支付'));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  test('受控模式：current 不变则点击不切换', async () => {
    const handleChange = vi.fn();
    render(<Steps items={items} current={0} onChange={handleChange} />);

    await userEvent.click(screen.getByText('支付'));
    expect(document.querySelector('.reef-steps__item--process')!.textContent).toContain('填写信息');
  });

  test('current 越界不崩溃也无 process 高亮（Review Focus #4）', () => {
    render(<Steps items={items} current={9} />);
    expect(document.querySelector('.reef-steps__item--process')).toBeNull();
  });

  test('可点击项带 button 角色，当前项没有（M-6）', () => {
    render(<Steps items={items} current={0} onChange={() => {}} />);

    // 可访问名含步骤序号（如 "2 确认订单"），按 li 属性断言而非名称匹配
    expect(screen.getByText('确认订单').closest('li')!.getAttribute('role')).toBe('button');
    expect(screen.getByText('填写信息').closest('li')!.getAttribute('role')).toBeNull();
  });
});
