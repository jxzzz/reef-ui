import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { InputNumber } from './InputNumber';

afterEach(cleanup);

const input = () => screen.getByRole('spinbutton') as HTMLInputElement;

describe('InputNumber', () => {
  test('defaultValue 初始显示，输入时回调数字', async () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={5} onChange={onChange} />);
    expect(input().value).toBe('5');

    await userEvent.clear(input());
    await userEvent.type(input(), '42');
    expect(onChange).toHaveBeenLastCalledWith(42);
    expect(input().value).toBe('42');
  });

  test('清空后 onChange 收到 null', async () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={5} onChange={onChange} />);
    await userEvent.clear(input());
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(input().value).toBe('');
  });

  test('点击步进按钮 ±step，键盘上下键同效', async () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={5} step={10} onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: '增加' }));
    expect(input().value).toBe('15');

    await userEvent.click(screen.getByRole('button', { name: '减少' }));
    await userEvent.click(screen.getByRole('button', { name: '减少' }));
    expect(input().value).toBe('-5');

    input().focus();
    await userEvent.keyboard('{ArrowUp}');
    expect(input().value).toBe('5');
  });

  test('失焦钳到 min/max，非法输入按空处理', async () => {
    const onChange = vi.fn();
    render(<InputNumber defaultValue={5} min={0} max={10} onChange={onChange} />);

    await userEvent.clear(input());
    await userEvent.type(input(), '99');
    await userEvent.tab();
    expect(input().value).toBe('10');

    await userEvent.clear(input());
    await userEvent.type(input(), '-3');
    await userEvent.tab();
    expect(input().value).toBe('0');

    // type=number 下无法键入非法字符的场景由 emit 拦截兜底
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  test('受控 value：显示跟随父组件', async () => {
    const { rerender } = render(<InputNumber value={5} />);
    expect(input().value).toBe('5');

    rerender(<InputNumber value={8} />);
    expect(input().value).toBe('8');
  });
});
