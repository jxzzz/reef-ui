import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Space } from './Space';

afterEach(cleanup);

describe('Space', () => {
  test('默认水平渲染，无 vertical 类名', () => {
    const { container } = render(
      <Space>
        <button type="button">a</button>
        <button type="button">b</button>
      </Space>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('reef-space');
    expect(el.className).not.toContain('reef-space--vertical');
  });

  test('direction vertical 加 modifier', () => {
    const { container } = render(<Space direction="vertical" />);
    expect((container.firstElementChild as HTMLElement).className).toContain('reef-space--vertical');
  });

  test('size number 生成为内联 gap', () => {
    const { container } = render(<Space size={32} />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gap).toBe('32px');
  });

  test('size 预设映射 token', () => {
    const { container } = render(<Space size="large" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gap).toBe('var(--reef-space-xl)');
  });

  test('wrap 加换行类名', () => {
    const { container } = render(<Space wrap />);
    expect((container.firstElementChild as HTMLElement).className).toContain('reef-space--wrap');
  });

  test('children 直接铺开，数量一致', () => {
    const { container } = render(
      <Space>
        <button type="button">1</button>
        <button type="button">2</button>
        <button type="button">3</button>
      </Space>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.childElementCount).toBe(3);
    expect(screen.getByText('2')).toBeTruthy();
  });

  test('className 透传', () => {
    const { container } = render(<Space className="my-space" />);
    expect((container.firstElementChild as HTMLElement).className).toContain('my-space');
  });
});
