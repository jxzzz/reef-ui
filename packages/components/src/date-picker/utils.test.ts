import { describe, expect, test } from 'vitest';
import { dayState, formatDate, isSameDay, monthGrid, parseDate, startOfWeek } from './utils';

describe('date utils', () => {
  test('formatDate 补零', () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(formatDate(new Date(2026, 11, 31))).toBe('2026-12-31');
  });

  test('parseDate 往返一致，拒绝非法输入', () => {
    expect(formatDate(parseDate('2026-10-11')!)).toBe('2026-10-11');
    expect(parseDate('2026-13-01')).toBeNull();
    expect(parseDate('2026/10/11')).toBeNull();
    expect(parseDate('')).toBeNull();
    expect(parseDate(null)).toBeNull();
  });

  test('startOfWeek 以周一为起点', () => {
    // 2026-10-11 是周日，本周一为 10-05
    expect(formatDate(startOfWeek(new Date(2026, 9, 11)))).toBe('2026-10-05');
    // 2026-10-12 是周一，起点是它自己
    expect(formatDate(startOfWeek(new Date(2026, 9, 12)))).toBe('2026-10-12');
  });

  test('monthGrid 42 格且首格是周一起始', () => {
    const grid = monthGrid(2026, 9); // 2026-10
    expect(grid).toHaveLength(42);
    expect(grid[0].getDay()).toBe(1); // 周一
    expect(grid.some((d) => d.getMonth() === 9 && d.getDate() === 1)).toBe(true);
  });

  test('isSameDay 与 dayState', () => {
    const a = new Date(2026, 9, 10);
    const b = new Date(2026, 9, 20);
    expect(isSameDay(a, new Date(2026, 9, 10, 23, 59))).toBe(true);
    expect(isSameDay(a, null)).toBe(false);
    expect(dayState(new Date(2026, 9, 10), a, b)).toBe('selected');
    expect(dayState(new Date(2026, 9, 15), a, b)).toBe('in-range');
    // 端点顺序无关
    expect(dayState(new Date(2026, 9, 15), b, a)).toBe('in-range');
    expect(dayState(new Date(2026, 9, 25), a, b)).toBe('');
    // 单端点不产生 in-range
    expect(dayState(new Date(2026, 9, 15), a, null)).toBe('');
  });
});
