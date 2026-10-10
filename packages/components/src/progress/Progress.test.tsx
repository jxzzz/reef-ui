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

  test('type=circle 渲染 SVG 圆环，dashoffset 随 percent 变化', () => {
    render(<Progress type="circle" percent={50} />);

    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.tagName).toBe('svg');
    const fill = progressbar.querySelector('.reef-progress__fill') as SVGCircleElement;
    const offset = Number(fill.getAttribute('stroke-dashoffset'));
    const circumference = Number(fill.getAttribute('stroke-dasharray'));
    // 50% → 偏移约半周长
    expect(offset).toBeCloseTo(circumference / 2, 1);
  });

  test('type=circle 越界与文本：钳制 + 百分比居中在环内', () => {
    const { rerender } = render(<Progress type="circle" percent={150} />);
    const fill = document.querySelector('.reef-progress__fill') as SVGCircleElement;
    expect(Number(fill.getAttribute('stroke-dashoffset'))).toBeCloseTo(0, 1);
    expect(screen.getByText('100%')).toBeTruthy();

    rerender(<Progress type="circle" percent={-5} />);
    const fill2 = document.querySelector('.reef-progress__fill') as SVGCircleElement;
    const circumference = Number(fill2.getAttribute('stroke-dasharray'));
    expect(Number(fill2.getAttribute('stroke-dashoffset'))).toBeCloseTo(circumference, 1);
    expect(screen.getByText('0%')).toBeTruthy();
  });

  test('type=circle status=error 环用 danger 色', () => {
    render(<Progress type="circle" percent={40} status="error" />);
    expect(document.querySelector('.reef-progress__fill--error')).toBeTruthy();
  });

  test('type=circle showInfo=false 不渲染文本', () => {
    render(<Progress type="circle" percent={50} showInfo={false} />);
    expect(screen.queryByText('50%')).toBeNull();
  });

  test('type=circle 进度弧两端圆头，0% 时收起避免渲染圆点', () => {
    const { rerender } = render(<Progress type="circle" percent={50} />);
    const fill = document.querySelector('.reef-progress__fill') as SVGCircleElement;
    expect(fill.getAttribute('stroke-linecap')).toBe('round');

    rerender(<Progress type="circle" percent={0} />);
    const fill0 = document.querySelector('.reef-progress__fill') as SVGCircleElement;
    expect(fill0.getAttribute('stroke-linecap')).toBe('butt');
  });
});
