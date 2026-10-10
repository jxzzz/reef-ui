import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Empty } from './Empty';

afterEach(cleanup);

describe('Empty', () => {
  test('默认文案"暂无数据"', () => {
    render(<Empty />);
    expect(screen.getByText('暂无数据')).toBeTruthy();
  });

  test('自定义描述', () => {
    render(<Empty description="没有匹配的订单" />);
    expect(screen.getByText('没有匹配的订单')).toBeTruthy();
    expect(screen.queryByText('暂无数据')).toBeNull();
  });

  test('children 作为底部操作区渲染', () => {
    render(
      <Empty>
        <button type="button">新建订单</button>
      </Empty>,
    );
    expect(screen.getByRole('button', { name: '新建订单' })).toBeTruthy();
  });
});
