import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Collapse } from './Collapse';

const items = [
  { key: 'a', label: '问题一', children: <p>答案一</p> },
  { key: 'b', label: '问题二', children: <p>答案二</p> },
  { key: 'c', label: '问题三', children: <p>答案三</p> },
];

afterEach(cleanup);

const header = (name: string) => screen.getByRole('button', { name });

describe('Collapse', () => {
  test('默认全部收起', () => {
    render(<Collapse items={items} />);
    expect(header('问题一').getAttribute('aria-expanded')).toBe('false');
    expect(header('问题二').getAttribute('aria-expanded')).toBe('false');
    expect(header('问题三').getAttribute('aria-expanded')).toBe('false');
  });

  test('defaultActiveKey 初始展开', () => {
    render(<Collapse items={items} defaultActiveKey={['a', 'c']} />);
    expect(header('问题一').getAttribute('aria-expanded')).toBe('true');
    expect(header('问题二').getAttribute('aria-expanded')).toBe('false');
    expect(header('问题三').getAttribute('aria-expanded')).toBe('true');
  });

  test('点击头部切换 aria-expanded', async () => {
    render(<Collapse items={items} />);
    await userEvent.click(header('问题二'));
    expect(header('问题二').getAttribute('aria-expanded')).toBe('true');
    await userEvent.click(header('问题二'));
    expect(header('问题二').getAttribute('aria-expanded')).toBe('false');
  });

  test('accordion 模式只保留一个展开', async () => {
    render(<Collapse items={items} accordion />);
    await userEvent.click(header('问题一'));
    await userEvent.click(header('问题二'));
    expect(header('问题一').getAttribute('aria-expanded')).toBe('false');
    expect(header('问题二').getAttribute('aria-expanded')).toBe('true');
  });

  test('受控模式：activeKey 不变则点击不切换', async () => {
    render(<Collapse items={items} activeKey={['a']} />);
    await userEvent.click(header('问题三'));
    expect(header('问题一').getAttribute('aria-expanded')).toBe('true');
    expect(header('问题三').getAttribute('aria-expanded')).toBe('false');
  });

  test('disabled 项不展开', async () => {
    render(
      <Collapse items={[{ key: 'd', label: '禁用项', children: <p>内容</p>, disabled: true }]} />,
    );
    await userEvent.click(header('禁用项'));
    expect(header('禁用项').getAttribute('aria-expanded')).toBe('false');
  });

  test('onChange 抛出 keys 数组', async () => {
    const handleChange = vi.fn();
    render(<Collapse items={items} onChange={handleChange} />);
    await userEvent.click(header('问题一'));
    expect(handleChange).toHaveBeenCalledWith(['a']);
    await userEvent.click(header('问题二'));
    expect(handleChange).toHaveBeenCalledWith(['a', 'b']);
  });
});
