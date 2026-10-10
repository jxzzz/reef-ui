import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Icon, ICON_NAMES } from './Icon';
import type { IconName } from './types';

afterEach(cleanup);

describe('Icon', () => {
  test('渲染指定图标，decorative 默认 aria-hidden', () => {
    const { container } = render(<Icon name="settings" size={20} />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('width')).toBe('20');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.querySelectorAll('path, circle, rect, line, polyline, polygon, ellipse').length).toBeGreaterThan(0);
  });

  test('ICON_NAMES 与 paths 全量对应且不重复', () => {
    expect(ICON_NAMES.length).toBeGreaterThan(50);
    expect(new Set(ICON_NAMES).size).toBe(ICON_NAMES.length);
    for (const name of ICON_NAMES) render(<Icon name={name as IconName} />);
  });
});
