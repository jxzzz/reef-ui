import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Tree } from './Tree';
import type { TreeNode } from './types';

// 默认语言包 zhCN：箭头按钮 aria-label 为「展开」/「收起」

const treeData: TreeNode[] = [
  {
    key: 'hq',
    label: '总部',
    children: [
      { key: 'dev', label: '研发部', children: [{ key: 'fe', label: '前端组' }] },
      { key: 'hr', label: '人事部' },
    ],
  },
  { key: 'sh', label: '上海分部', disabled: true },
];

afterEach(cleanup);

describe('Tree', () => {
  test('默认渲染根层级，子节点不渲染', () => {
    render(<Tree treeData={treeData} />);

    expect(screen.getByRole('tree')).toBeTruthy();
    expect(screen.getByRole('treeitem', { name: '总部' })).toBeTruthy();
    expect(screen.queryByText('研发部')).toBeNull();
    expect(screen.getByRole('treeitem', { name: '上海分部' }).getAttribute('aria-disabled')).toBe('true');
  });

  test('defaultExpandedKeys 展开多层节点', () => {
    render(<Tree treeData={treeData} defaultExpandedKeys={['hq', 'dev']} />);

    expect(screen.getByRole('treeitem', { name: '总部' }).getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('前端组')).toBeTruthy();
  });

  test('点击箭头展开/收起，aria-expanded 与回调联动', async () => {
    const handleExpanded = vi.fn();
    render(<Tree treeData={treeData} onExpandedKeysChange={handleExpanded} />);

    const arrow = screen.getByRole('button', { name: '展开' });
    expect(screen.getByRole('treeitem', { name: '总部' }).getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(arrow);
    expect(screen.getByRole('treeitem', { name: '总部' }).getAttribute('aria-expanded')).toBe('true');
    expect(handleExpanded).toHaveBeenCalledWith(['hq']);
    expect(screen.getByText('研发部')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: '收起' }));
    expect(screen.getByRole('treeitem', { name: '总部' }).getAttribute('aria-expanded')).toBe('false');
    expect(handleExpanded).toHaveBeenCalledWith([]);
  });

  test('点击 label 选中并触发 onChange，disabled 节点不触发', async () => {
    const handleChange = vi.fn();
    render(<Tree treeData={treeData} onChange={handleChange} />);

    await userEvent.click(screen.getByText('总部'));
    expect(handleChange).toHaveBeenCalledWith('hq');
    expect(screen.getByRole('treeitem', { name: '总部' }).getAttribute('aria-selected')).toBe('true');

    await userEvent.click(screen.getByText('上海分部'));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('treeitem', { name: '上海分部' }).getAttribute('aria-selected')).toBe('false');
  });

  test('受控 value：点击不改变选中，onChange 仍触发', async () => {
    const handleChange = vi.fn();
    render(<Tree treeData={treeData} value="sh" onChange={handleChange} />);

    await userEvent.click(screen.getByText('总部'));
    expect(handleChange).toHaveBeenCalledWith('hq');
    expect(screen.getByRole('treeitem', { name: '总部' }).getAttribute('aria-selected')).toBe('false');
    expect(screen.getByRole('treeitem', { name: '上海分部' }).getAttribute('aria-selected')).toBe('true');
  });

  test('受控 expandedKeys：回调触发但展开状态由外部决定', async () => {
    const handleExpanded = vi.fn();
    render(<Tree treeData={treeData} expandedKeys={[]} onExpandedKeysChange={handleExpanded} />);

    await userEvent.click(screen.getByRole('button', { name: '展开' }));
    expect(handleExpanded).toHaveBeenCalledWith(['hq']);
    expect(screen.queryByText('研发部')).toBeNull();
  });

  test('selectable=false 点击不选中', async () => {
    const handleChange = vi.fn();
    render(<Tree treeData={treeData} selectable={false} onChange={handleChange} />);

    const item = screen.getByRole('treeitem', { name: '总部' });
    await userEvent.click(screen.getByText('总部'));
    expect(handleChange).not.toHaveBeenCalled();
    expect(item.getAttribute('aria-selected')).toBeNull();
  });

  test('键盘 Enter 选中节点', async () => {
    const handleChange = vi.fn();
    render(<Tree treeData={treeData} defaultExpandedKeys={['hq']} onChange={handleChange} />);

    screen.getByRole('treeitem', { name: '研发部' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledWith('dev');
  });
});
