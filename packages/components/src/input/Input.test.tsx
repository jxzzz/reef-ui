import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Input } from './Input';

afterEach(cleanup);

describe('Input', () => {
  test('无附加属性时渲染裸 input，无 wrapper', () => {
    render(<Input placeholder="普通输入框" />);
    expect(screen.getByPlaceholderText('普通输入框').className).toContain('reef-input');
    expect(document.querySelector('.reef-input__wrapper')).toBeNull();
  });

  test('clearable 有内容时显示清空按钮，点击清空、触发 onChange 并还焦点', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input clearable onChange={onChange} defaultValue="内容" />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('内容');
    expect(document.querySelector('.reef-input__clear')).toBeTruthy();

    await user.click(document.querySelector('.reef-input__clear')!);
    expect(input.value).toBe('');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toBe('');
    expect(document.activeElement).toBe(input);
  });

  test('clearable 空内容时不显示清空按钮，输入后出现', async () => {
    const user = userEvent.setup();
    render(<Input clearable />);
    const input = screen.getByRole('textbox');
    expect(document.querySelector('.reef-input__clear')).toBeNull();
    await user.type(input, 'a');
    expect(document.querySelector('.reef-input__clear')).toBeTruthy();
  });

  test('prefix/suffix 渲染在 wrapper 内', () => {
    render(<Input clearable prefix={<span data-testid="pre">￥</span>} suffix={<span data-testid="suf">元</span>} />);
    expect(screen.getByTestId('pre')).toBeTruthy();
    expect(screen.getByTestId('suf')).toBeTruthy();
    expect(screen.getByTestId('pre').closest('.reef-input__wrapper')).toBeTruthy();
  });

  test('受控 clearable 点击清空后 onChange 收到空值事件', async () => {
    // React 会在父级未更新 value 时还原 DOM 值，事件值需在回调内同步捕获
    let received: string | null = null;
    const user = userEvent.setup();
    render(
      <Input
        clearable
        value="abc"
        onChange={(e) => {
          received = e.target.value;
        }}
      />,
    );
    await user.click(document.querySelector('.reef-input__clear')!);
    expect(received).toBe('');
  });
});
