import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Badge } from './Badge';

afterEach(cleanup);

describe('Badge', () => {
  test('渲染数字，超过 max 显示 max+', () => {
    const { rerender } = render(<Badge count={5} />);
    expect(screen.getByText('5')).toBeTruthy();
    rerender(<Badge count={100} />);
    expect(screen.getByText('99+')).toBeTruthy();
  });

  test('dot 只渲染圆点不渲染文字', () => {
    render(<Badge dot count={5} />);
    expect(screen.queryByText('5')).toBeNull();
    expect(document.querySelector('.reef-badge--dot')).toBeTruthy();
  });

  test('count 为 0 或负数不渲染（Review Focus #1）', () => {
    const { rerender } = render(<Badge count={0} />);
    expect(document.querySelector('.reef-badge')).toBeNull();
    rerender(<Badge count={-3} />);
    expect(document.querySelector('.reef-badge')).toBeNull();
  });

  test('包裹子元素时绝对定位于其上', () => {
    render(
      <Badge count={5}>
        <button type="button">消息</button>
      </Badge>,
    );
    expect(screen.getByRole('button', { name: '消息' })).toBeTruthy();
    expect(document.querySelector('.reef-badge__wrapper')).toBeTruthy();
  });
});
