import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Segmented } from './Segmented';

afterEach(cleanup);

const OPTIONS = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
];

describe('Segmented', () => {
  test('渲染全部选项，默认选中第一项', () => {
    render(<Segmented options={OPTIONS} />);
    expect(screen.getByRole('radio', { name: '日' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: '月' }).getAttribute('aria-checked')).toBe('false');
  });

  test('点击切换选中并触发 onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Segmented options={OPTIONS} onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: '周' }));
    expect(onChange).toHaveBeenCalledWith('week');
    expect(screen.getByRole('radio', { name: '周' }).getAttribute('aria-checked')).toBe('true');
  });

  test('受控时点击不改变选中，但 onChange 仍触发（Review Focus #2）', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Segmented options={OPTIONS} value="day" onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: '月' }));
    expect(onChange).toHaveBeenCalledWith('month');
    expect(screen.getByRole('radio', { name: '月' }).getAttribute('aria-checked')).toBe('false');
    expect(screen.getByRole('radio', { name: '日' }).getAttribute('aria-checked')).toBe('true');
  });

  test('defaultValue 指定初始选中', () => {
    render(<Segmented options={OPTIONS} defaultValue="month" />);
    expect(screen.getByRole('radio', { name: '月' }).getAttribute('aria-checked')).toBe('true');
  });

  test('方向键移动选中（循环），非选中项 roving tabindex=-1', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Segmented options={OPTIONS} onChange={onChange} />);
    const day = screen.getByRole('radio', { name: '日' });
    expect(day.tabIndex).toBe(0);
    expect(screen.getByRole('radio', { name: '月' }).tabIndex).toBe(-1);

    day.focus();
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('week');
    expect(screen.getByRole('radio', { name: '周' }).getAttribute('aria-checked')).toBe('true');
    await user.keyboard('{ArrowLeft}');
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith('month');
    expect(screen.getByRole('radio', { name: '月' }).getAttribute('aria-checked')).toBe('true');
  });
});
