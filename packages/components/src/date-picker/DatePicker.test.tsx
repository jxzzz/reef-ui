import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { useState } from 'react';
import { DatePicker } from './DatePicker';
import { DateRangePicker } from './DateRangePicker';
import type { DateRange } from './types';

afterEach(cleanup);

const input = () => screen.getByRole('textbox') as HTMLInputElement;

/** 取当前面板里指定「日」的按钮，排除前后月补位格（class 带 --other） */
const dayBtn = (n: number) =>
  [...screen.getAllByRole('button')].find(
    (el) => el.textContent === String(n) && !el.className.includes('reef-datepicker__day--other'),
  ) as HTMLButtonElement;

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

  test('月份/年份导航：切年切月后标题变化，可选中导航后月份的日期', async () => {
    const onChange = vi.fn();
    render(<DatePicker defaultValue="2026-10-11" onChange={onChange} />);
    await userEvent.click(input());

    expect(screen.getByText('2026年10月')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: '下一年' }));
    expect(screen.getByText('2027年10月')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: '上一月' }));
    expect(screen.getByText('2027年9月')).toBeTruthy();

    await userEvent.click(dayBtn(15));
    expect(onChange).toHaveBeenCalledWith('2027-09-15');
    expect(input().value).toBe('2027-09-15');
    expect(screen.queryByRole('grid')).toBeNull();
  });

  test('disabled 时点击输入框不打开面板', async () => {
    render(<DatePicker disabled />);
    expect(input().disabled).toBe(true);
    await userEvent.click(input());
    expect(input().getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('grid')).toBeNull();
  });

  test('点击面板外部关闭', async () => {
    render(<DatePicker />);
    await userEvent.click(input());
    expect(screen.getByRole('grid')).toBeTruthy();
    await userEvent.click(document.body);
    expect(screen.queryByRole('grid')).toBeNull();
  });

  test('DateRangePicker 受控 value：选择后显示跟随父组件，onChange 抛出区间', async () => {
    const onChange = vi.fn();
    function Demo() {
      const [v] = useState<DateRange>(['2026-10-01', '2026-10-31']);
      return <DateRangePicker value={v} onChange={onChange} />;
    }
    render(<Demo />);
    const fields = screen.getAllByRole('textbox') as HTMLInputElement[];

    await userEvent.click(fields[0]);
    await userEvent.click(dayBtn(20));
    await userEvent.click(dayBtn(5));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(['2026-10-05', '2026-10-20']);
    // 父组件未更新 value，显示保持受控值
    expect(fields[0].value).toBe('2026-10-01');
    expect(fields[1].value).toBe('2026-10-31');
    expect(screen.queryByRole('grid')).toBeNull();
  });

  test('DateRangePicker 点击终点输入框可打开面板；选完起点 hover 高亮区间', async () => {
    render(
      <DateRangePicker defaultValue={['2026-10-01', '2026-10-02']} onChange={vi.fn()} />,
    );
    await userEvent.click(screen.getAllByRole('textbox')[1]);
    expect(screen.getByRole('grid')).toBeTruthy();

    await userEvent.click(dayBtn(8));
    expect(dayBtn(8).className).toContain('reef-datepicker__day--selected');

    // hover 中间日期：单选进行中，以 hover 为草稿终点，中间格显示 in-range
    fireEvent.mouseOver(dayBtn(15));
    expect(dayBtn(15).className).toContain('reef-datepicker__day--selected');
    expect(dayBtn(12).className).toContain('reef-datepicker__day--in-range');
    expect(dayBtn(20).className).not.toContain('reef-datepicker__day--in-range');
  });
});
