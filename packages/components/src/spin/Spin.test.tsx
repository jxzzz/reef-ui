import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Spin } from './Spin';

afterEach(cleanup);

describe('Spin', () => {
  test('独立模式渲染 status 加载图标', () => {
    render(<Spin />);
    expect(screen.getByRole('status', { name: '加载中' })).toBeTruthy();
  });

  test('独立模式 spinning=false 不渲染', () => {
    render(<Spin spinning={false} />);
    expect(screen.queryByRole('status')).toBeNull();
  });

  test('包裹内容：spinning 有遮罩和 tip，关闭后只剩内容（Review Focus #5）', () => {
    const { rerender } = render(
      <Spin spinning tip="加载中…">
        <p>表格内容</p>
      </Spin>,
    );
    expect(screen.getByText('表格内容')).toBeTruthy();
    expect(screen.getByText('加载中…')).toBeTruthy();
    expect(document.querySelector('.reef-spin__overlay')).toBeTruthy();

    rerender(
      <Spin spinning={false} tip="加载中…">
        <p>表格内容</p>
      </Spin>,
    );
    expect(screen.getByText('表格内容')).toBeTruthy();
    expect(document.querySelector('.reef-spin__overlay')).toBeNull();
    expect(screen.queryByText('加载中…')).toBeNull();
  });

  test('size 透出修饰类', () => {
    const { container } = render(<Spin size="large" />);
    expect(container.firstElementChild!.className).toContain('reef-spin--large');
  });
});
