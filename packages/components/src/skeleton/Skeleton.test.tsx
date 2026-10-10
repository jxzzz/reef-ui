import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Skeleton } from './Skeleton';

afterEach(cleanup);

describe('Skeleton', () => {
  test('loading 时按 rows 渲染骨架行，不渲染 children', () => {
    const { container } = render(<Skeleton rows={2}>真实内容</Skeleton>);
    expect(container.querySelectorAll('.reef-skeleton__row')).toHaveLength(2);
    expect(screen.queryByText('真实内容')).toBeNull();
  });

  test('loading=false 只渲染 children', () => {
    const { container } = render(
      <Skeleton loading={false}>
        <p>已加载</p>
      </Skeleton>,
    );
    expect(screen.getByText('已加载')).toBeTruthy();
    expect(container.querySelector('.reef-skeleton')).toBeNull();
  });

  test('avatar 开关渲染头像块', () => {
    const { container } = render(<Skeleton avatar rows={1} />);
    expect(container.querySelector('.reef-skeleton__avatar')).toBeTruthy();
  });
});
