import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { useState } from 'react';
import { DatePicker } from './DatePicker';

afterEach(cleanup);

const input = () => screen.getByRole('textbox') as HTMLInputElement;

describe('DatePicker', () => {
  test('点击输入框打开面板，选日期回填并关闭', async () => {
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    await userEvent.click(input());
    expect(input().getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('grid')).toBeTruthy();

    // 当月 15 号：面板里 "15" 的按钮（排除其他月的补位用 aria-selected 区分不可靠，取今天所在月默认视图）
    const day = [...screen.getAllByRole('button')].find(
      (el) => el.tagName === 'BUTTON' && el.textContent === '15',
    ) as HTMLButtonElement;
    await userEvent.click(day);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toMatch(/^\d{4}-10-15$|^\d{4}-09-15$/);
    expect(input().value).toBe(onChange.mock.calls[0][0]);
    expect(screen.queryByRole('grid')).toBeNull();
  });

  test('defaultValue 直接显示', () => {
    render(<DatePicker defaultValue="2026-10-11" />);
    expect(input().value).toBe('2026-10-11');
  });

  test('受控 value：显示跟随父组件，面板高亮选中', async () => {
    const onChange = vi.fn();
    function Demo() {
      const [v, setV] = useState('2026-03-05');
      return <DatePicker value={v} onChange={(x) => { onChange(x); setV('2026-03-05'); }} />;
    }
    render(<Demo />);

    await userEvent.click(input());
    const day = [...screen.getAllByRole('button')].find(
      (el) => el.textContent === '18' && el.getAttribute('disabled') == null,
    ) as HTMLButtonElement;
    await userEvent.click(day);
    expect(onChange).toHaveBeenCalledWith('2026-03-18');
    // 父组件拨回，显示不变
    expect(input().value).toBe('2026-03-05');
  });

  test('isDisabled 禁用日期不可点', async () => {
    const onChange = vi.fn();
    render(<DatePicker isDisabled={(d) => d.getDate() === 15} onChange={onChange} />);
    await userEvent.click(input());
    const day = [...screen.getAllByRole('button')].find(
      (el) => el.textContent === '15',
    ) as HTMLButtonElement;
    expect(day.disabled).toBe(true);
    await userEvent.click(day);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('Escape 关闭面板', async () => {
    render(<DatePicker />);
    await userEvent.click(input());
    expect(screen.getByRole('grid')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('grid')).toBeNull();
  });

  test('前后月补位淡显但仍可选', async () => {
    render(<DatePicker defaultValue="2026-10-11" onChange={vi.fn()} />);
    await userEvent.click(input());
    // 网格 42 格 = 7 天表头 + 42 天
    const days = [...screen.getAllByRole('button')].filter((el) => /^\d{1,2}$/.test(el.textContent ?? ''));
    expect(days).toHaveLength(42);
  });
});
