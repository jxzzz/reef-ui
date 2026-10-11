import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { TimePicker } from './TimePicker';

afterEach(cleanup);

// jsdom 未实现 scrollIntoView
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

const trigger = () => screen.getByRole('combobox');
const listboxes = () => document.querySelectorAll('[role="listbox"]');
const col = (i: number) => within(listboxes()[i] as HTMLElement);
const option = (i: number, n: number) =>
  col(i).getByRole('option', { name: String(n).padStart(2, '0') });

describe('TimePicker', () => {
  test('点击触发器打开三列面板', async () => {
    render(<TimePicker />);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(trigger());
    expect(listboxes().length).toBe(3);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  test('选时/分/秒后 onChange 抛 HH:mm:ss 且触发器显示该值', async () => {
    const onChange = vi.fn();
    render(<TimePicker onChange={onChange} />);

    await userEvent.click(trigger());
    await userEvent.click(option(0, 9));
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.click(option(1, 8));
    await userEvent.click(option(2, 7));
    expect(onChange).toHaveBeenCalledWith('09:08:07');
    expect(trigger().textContent).toBe('09:08:07');
  });

  test('minuteStep 只影响分钟列', async () => {
    render(<TimePicker minuteStep={15} />);
    await userEvent.click(trigger());

    expect(col(1).getAllByRole('option').length).toBe(4);
    expect(option(1, 15).textContent).toBe('15');
    expect(col(1).queryByRole('option', { name: '05' })).toBeNull();
    expect(col(0).getAllByRole('option').length).toBe(24);
    expect(col(2).getAllByRole('option').length).toBe(60);
  });

  test('defaultValue 直接显示', () => {
    render(<TimePicker defaultValue="09:30:00" />);
    expect(trigger().textContent).toBe('09:30:00');
  });

  test('清空按钮抛 null 并显示占位符', async () => {
    const onChange = vi.fn();
    render(<TimePicker defaultValue="09:30:00" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: '清空' }));
    expect(onChange).toHaveBeenCalledWith(null);
    expect(trigger().textContent).toBe('请选择时间');
  });

  test('Escape 关闭面板', async () => {
    render(<TimePicker />);
    await userEvent.click(trigger());
    await userEvent.keyboard('{Escape}');
    expect(listboxes().length).toBe(0);
  });

  test('disabled 不打开面板', async () => {
    render(<TimePicker disabled />);
    await userEvent.click(trigger());
    expect(listboxes().length).toBe(0);
  });
});
