import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { DateRangePicker } from './DateRangePicker';

afterEach(cleanup);

const inputs = () => screen.getAllByRole('textbox') as HTMLInputElement[];
const days = () => [...screen.getAllByRole('button')].filter((el) => /^\d{1,2}$/.test(el.textContent ?? '')) as HTMLButtonElement[];

async function open() {
  await userEvent.click(inputs()[0]);
}

/** 点指定数字的日期（默认视图是当前月，测试日期都用当月） */
async function pickDay(n: number) {
  await userEvent.click(days().find((el) => el.textContent === String(n) && !el.disabled)!);
}

describe('DateRangePicker', () => {
  test('两次点击完成区间选择，起点终点自动排序', async () => {
    const onChange = vi.fn();
    render(<DateRangePicker onChange={onChange} />);
    await open();

    await pickDay(20);
    await pickDay(5);

    expect(onChange).toHaveBeenCalledTimes(1);
    const [s, e] = onChange.mock.calls[0][0];
    expect(e > s).toBe(true); // 5 号在前，20 号在后，已排序
    expect(inputs()[0].value).toBe(s);
    expect(inputs()[1].value).toBe(e);
    expect(screen.queryByRole('grid')).toBeNull();
  });

  test('defaultValue 直接显示两端', () => {
    render(<DateRangePicker defaultValue={['2026-10-05', '2026-10-20']} />);
    expect(inputs()[0].value).toBe('2026-10-05');
    expect(inputs()[1].value).toBe('2026-10-20');
  });

  test('同一天：start == end', async () => {
    const onChange = vi.fn();
    render(<DateRangePicker onChange={onChange} />);
    await open();
    await pickDay(10);
    await pickDay(10);
    expect(onChange).toHaveBeenCalledWith([onChange.mock.calls[0][0][0], onChange.mock.calls[0][0][1]]);
    const [s, e] = onChange.mock.calls[0][0];
    expect(s).toBe(e);
  });

  test('选完起点后面板保持打开，显示起点草稿', async () => {
    render(<DateRangePicker onChange={vi.fn()} />);
    await open();
    await pickDay(5);
    expect(screen.getByRole('grid')).toBeTruthy();
    expect(inputs()[0].value).toMatch(/-05$/);
    expect(inputs()[1].value).toBe('');
  });

  test('isDisabled 起点被禁则不响应', async () => {
    const onChange = vi.fn();
    // 全部禁用，点击格位不应产生任何选择
    render(<DateRangePicker isDisabled={() => true} onChange={onChange} />);
    await open();
    const day = days().find((el) => el.className.includes('other'))!;
    fireEvent.click(day);
    expect(screen.getByRole('grid')).toBeTruthy();
    expect(inputs()[0].value).toBe('');
    expect(onChange).not.toHaveBeenCalled();
  });
});
