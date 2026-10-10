import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Timeline } from './Timeline';

afterEach(cleanup);

describe('Timeline', () => {
  test('按序渲染全部内容', () => {
    render(
      <Timeline
        items={[
          { key: 'a', content: '创建订单' },
          { key: 'b', content: '支付成功' },
          { key: 'c', content: '已发货' },
        ]}
      />,
    );
    const items = document.querySelectorAll('.reef-timeline__item');
    expect(items).toHaveLength(3);
    expect(screen.getByText('创建订单')).toBeTruthy();
    expect(screen.getByText('已发货')).toBeTruthy();
  });

  test('自定义 dot 替换默认圆点', () => {
    render(<Timeline items={[{ key: 'a', content: '标签', dot: <b className="my-dot">!</b> }]} />);
    expect(document.querySelector('.my-dot')).toBeTruthy();
    expect(document.querySelector('.reef-timeline__dot')).toBeNull();
  });

  test('默认渲染圆点元素', () => {
    render(<Timeline items={[{ key: 'a', content: '节点' }]} />);
    expect(document.querySelector('.reef-timeline__dot')).toBeTruthy();
  });
});
