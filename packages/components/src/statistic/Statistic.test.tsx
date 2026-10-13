import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Statistic } from './Statistic';

afterEach(cleanup);

describe('Statistic', () => {
  test('渲染标题与数值', () => {
    render(<Statistic title="销售额" value={12345} />);
    expect(screen.getByText('销售额').className).toBe('reef-statistic__title');
    expect(screen.getByText('12,345').className).toBe('reef-statistic__value');
  });

  test('precision 控制小数位，千分位分组生效（含负数）', () => {
    const { rerender } = render(<Statistic value={12345.6789} precision={2} />);
    expect(screen.getByText('12,345.68').textContent).toBe('12,345.68');
    rerender(<Statistic value={-9876543.5} precision={1} />);
    expect(screen.getByText('-9,876,543.5')).toBeTruthy();
  });

  test('separator 为 false 时不分组', () => {
    render(<Statistic value={1234567} separator={false} />);
    expect(screen.getByText('1234567')).toBeTruthy();
  });

  test('渲染前缀与后缀', () => {
    render(<Statistic value={66.6} prefix="¥" suffix="元" />);
    expect(screen.getByText('¥').className).toBe('reef-statistic__prefix');
    expect(screen.getByText('66.6').className).toBe('reef-statistic__value');
    expect(screen.getByText('元').className).toBe('reef-statistic__suffix');
  });

  test('字符串数值原样展示，不做分组与精度处理', () => {
    render(<Statistic value="1,234,567 起" precision={2} />);
    expect(screen.getByText('1,234,567 起')).toBeTruthy();
  });

  test('loading 时用占位符代替数值', () => {
    render(<Statistic value={123} loading />);
    expect(screen.getByText('—')).toBeTruthy();
    expect(screen.queryByText('123')).toBeNull();
  });
});
