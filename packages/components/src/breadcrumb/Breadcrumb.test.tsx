import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

const items = [
  { key: 'home', title: '首页', href: '#/' },
  { key: 'list', title: '订单管理', href: '#/orders' },
  { key: 'detail', title: '订单详情' },
];

afterEach(cleanup);

describe('Breadcrumb', () => {
  test('非最后项渲染为链接，最后一项是当前页文本', () => {
    render(<Breadcrumb items={items} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('#/');
    expect(links[1].getAttribute('href')).toBe('#/orders');

    const current = screen.getByText('订单详情');
    expect(current.getAttribute('aria-current')).toBeNull();
    expect(current.closest('li')!.getAttribute('aria-current')).toBe('page');
  });

  test('带 aria-current 的只有最后一项', () => {
    render(<Breadcrumb items={items} />);
    const currents = document.querySelectorAll('[aria-current="page"]');
    expect(currents).toHaveLength(1);
  });

  test('无 href 的项渲染为纯文本', () => {
    render(<Breadcrumb items={[{ title: '仅文本' }]} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('仅文本')).toBeTruthy();
  });
});
