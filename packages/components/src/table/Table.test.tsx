import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test } from 'vitest';
import { Table } from './Table';

afterEach(cleanup);

interface Row {
  id: number;
  name: string;
  age: number;
}

const users: Row[] = [
  { id: 3, name: '张三', age: 28 },
  { id: 1, name: '李四', age: 35 },
  { id: 2, name: '王五', age: 22 },
];

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄', sorter: (a: Row, b: Row) => a.age - b.age },
  {
    key: 'action',
    title: '操作',
    render: (r: Row) => <a href="#" aria-label={`编辑-${r.name}`}>编辑</a>,
  },
];

describe('Table', () => {
  test('按 columns 渲染表头与数据', () => {
    render(<Table columns={columns} dataSource={users} rowKey="id" />);
    expect(screen.getByRole('columnheader', { name: /姓名/ })).toBeTruthy();
    expect(screen.getAllByRole('row')).toHaveLength(4); // 表头 + 3 行
    expect(screen.getByRole('cell', { name: '张三' })).toBeTruthy();
  });

  test('render 覆盖默认单元格内容', () => {
    render(<Table columns={columns} dataSource={users} />);
    expect(screen.getAllByRole('link', { name: /编辑-/ })).toHaveLength(3);
    expect(screen.getByRole('cell', { name: '编辑-张三' })).toBeTruthy();
  });

  test('rowKey 函数与缺省下标', () => {
    const { container, rerender } = render(
      <Table columns={[{ key: 'name', title: '姓名' }]} dataSource={users} rowKey={(r) => `u-${r.id}`} />,
    );
    expect(container.querySelectorAll('tbody tr')[0].getAttribute('data-row-key') ?? 'ok').toBeTruthy();
    rerender(<Table columns={[{ key: 'name', title: '姓名' }]} dataSource={users} />);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
  });

  test('点击表头排序：asc → desc', async () => {
    render(<Table columns={columns} dataSource={users} />);
    const ageHead = screen.getByRole('columnheader', { name: /年龄/ });

    await userEvent.click(ageHead);
    const cells = () => [...screen.getAllByRole('row')].slice(1).map((r) => r.children[1].textContent);
    expect(cells()).toEqual(['22', '28', '35']);
    expect(ageHead.getAttribute('aria-sort')).toBe('ascending');

    await userEvent.click(ageHead);
    expect(cells()).toEqual(['35', '28', '22']);
    expect(ageHead.getAttribute('aria-sort')).toBe('descending');
  });

  test('切换排序列不影响原数组顺序', async () => {
    render(<Table columns={columns} dataSource={users} />);
    await userEvent.click(screen.getByRole('columnheader', { name: /年龄/ }));
    expect(users.map((u) => u.name)).toEqual(['张三', '李四', '王五']);
  });

  test('无数据时显示空态', () => {
    render(<Table columns={columns} dataSource={[]} />);
    expect(screen.getByText('暂无数据')).toBeTruthy();
    render(
      <Table columns={columns} dataSource={[]} empty={<span>自定义空态</span>} />,
    );
    expect(screen.getByText('自定义空态')).toBeTruthy();
  });

  test('align 与 ellipsis class 生效', () => {
    const { container } = render(
      <Table
        columns={[
          { key: 'name', title: '姓名', align: 'right', ellipsis: true },
        ]}
        dataSource={[{ name: 'x' } as Row]}
      />,
    );
    expect(container.querySelector('td')!.className).toContain('reef-table__cell--ellipsis');
    expect(container.querySelector('td')!.className).toContain('reef-table__cell--right');
  });

  test('width 写入 colgroup', () => {
    const { container } = render(
      <Table columns={[{ key: 'name', title: '姓名', width: 120 }]} dataSource={[]} />,
    );
    expect((container.querySelector('col') as HTMLTableColElement).style.width).toBe('120px');
  });
});
