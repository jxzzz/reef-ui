import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Descriptions } from './Descriptions';

afterEach(cleanup);

const ITEMS = [
  { key: 'name', label: '用户名', children: '张三' },
  { key: 'role', label: '角色', children: '管理员' },
];

describe('Descriptions', () => {
  test('渲染全部 label 与值', () => {
    render(<Descriptions items={ITEMS} />);
    expect(screen.getByText('用户名')).toBeTruthy();
    expect(screen.getByText('张三')).toBeTruthy();
    expect(screen.getByText('管理员')).toBeTruthy();
  });

  test('column 生效到 grid 列数，bordered 加类名', () => {
    const { container } = render(<Descriptions items={ITEMS} column={2} bordered />);
    const body = container.querySelector('.reef-descriptions__body') as HTMLElement;
    expect(body.style.gridTemplateColumns).toContain('2');
    expect((container.firstElementChild as HTMLElement).className).toContain('reef-descriptions--bordered');
  });

  test('空 items 只渲染标题与空 body，不崩溃（Review Focus #4）', () => {
    const { container } = render(<Descriptions items={[]} title="详情" />);
    expect(screen.getByText('详情')).toBeTruthy();
    expect(container.querySelector('.reef-descriptions__item')).toBeNull();
  });
});
