import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Card } from './Card';

afterEach(cleanup);

describe('Card', () => {
  test('渲染标题、extra 与正文', () => {
    render(
      <Card title="订单概览" extra={<button type="button">更多</button>}>
        内容区
      </Card>,
    );
    expect(screen.getByText('订单概览')).toBeTruthy();
    expect(screen.getByRole('button', { name: '更多' })).toBeTruthy();
    expect(screen.getByText('内容区')).toBeTruthy();
  });

  test('bordered=false 不带边框修饰类', () => {
    const { container } = render(<Card bordered={false}>内容</Card>);
    expect(container.firstElementChild!.className).not.toContain('reef-card--bordered');
  });

  test('hoverable 带 hover 修饰类', () => {
    const { container } = render(<Card hoverable>内容</Card>);
    expect(container.firstElementChild!.className).toContain('reef-card--hoverable');
  });

  test('footer 渲染在正文之后', () => {
    render(<Card footer={<span>底部</span>}>内容</Card>);
    const footer = screen.getByText('底部');
    expect(footer.parentElement!.previousElementSibling!.textContent).toContain('内容');
  });
});
