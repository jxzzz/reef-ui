import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Pagination } from './Pagination';

afterEach(cleanup);

describe('Pagination', () => {
  test('渲染页码，点击翻页触发 onChange', async () => {
    const handleChange = vi.fn();
    render(<Pagination total={100} defaultCurrent={1} onChange={handleChange} />);

    await userEvent.click(screen.getByRole('button', { name: '第 2 页' }));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  test('上一页/下一页按钮与禁用态', async () => {
    const handleChange = vi.fn();
    render(<Pagination total={30} defaultCurrent={1} onChange={handleChange} />);

    const prev = screen.getByRole('button', { name: '上一页' });
    expect((prev as HTMLButtonElement).disabled).toBe(true);

    await userEvent.click(screen.getByRole('button', { name: '下一页' }));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  test('current 越界钳制到最后一页（Review Focus #3）', () => {
    render(<Pagination total={30} current={99} />);
    expect(screen.getByRole('button', { name: '第 3 页' }).getAttribute('aria-current')).toBe('page');
  });

  test('页数多时出现省略号', () => {
    render(<Pagination total={200} current={10} />);
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
  });
});
