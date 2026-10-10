import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Divider } from './Divider';

afterEach(cleanup);

describe('Divider', () => {
  test('渲染文字标签', () => {
    render(<Divider>中间文字</Divider>);
    expect(screen.getByText('中间文字')).toBeTruthy();
  });

  test('vertical 渲染竖线类名，无文字', () => {
    const { container } = render(<Divider vertical />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('reef-divider--vertical');
    expect(el.className).not.toContain('reef-divider--dashed');
  });

  test('dashed 加虚线类名', () => {
    const { container } = render(<Divider dashed />);
    expect((container.firstElementChild as HTMLElement).className).toContain('reef-divider--dashed');
  });
});
