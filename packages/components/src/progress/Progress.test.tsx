import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Progress } from './Progress';

afterEach(cleanup);

describe('Progress', () => {
  test('渲染填充宽度与百分比文本', () => {
    render(<Progress percent={50} />);

    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('50');
    expect(document.querySelector<HTMLElement>('.reef-progress__fill')!.style.width).toBe('50%');
    expect(screen.getByText('50%')).toBeTruthy();
  });

  test('percent 越界钳制到 [0,100]（Review Focus #2）', () => {
    const { rerender } = render(<Progress percent={150} />);
    expect(document.querySelector<HTMLElement>('.reef-progress__fill')!.style.width).toBe('100%');
    expect(screen.getByText('100%')).toBeTruthy();

    rerender(<Progress percent={-5} />);
    expect(document.querySelector<HTMLElement>('.reef-progress__fill')!.style.width).toBe('0%');
    expect(screen.getByText('0%')).toBeTruthy();
  });

  test('status=error 填充变 danger 色', () => {
    render(<Progress percent={40} status="error" />);
    expect(document.querySelector('.reef-progress__fill--error')).toBeTruthy();
  });

  test('showInfo=false 不渲染百分比文本', () => {
    render(<Progress percent={50} showInfo={false} />);
    expect(screen.queryByText('50%')).toBeNull();
  });

  test('非数值 percent 按 0 处理，不出现 NaN（M-5）', () => {
    render(<Progress percent={NaN} />);

    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
    expect(document.body.textContent).not.toContain('NaN');
  });
});
