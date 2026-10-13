import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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

// 多选复选用例的数据
const checkData: TreeNode[] = [
  {
    key: 'p',
    label: '父节点',
    children: [
      { key: 'a', label: '子A' },
      { key: 'b', label: '子B' },
    ],
  },
];

/** 取节点内的复选框原生 input（视觉隐藏，需 fireEvent 触发） */
const getCheckbox = (name: string) =>
  screen.getByRole('treeitem', { name }).querySelector('input') as HTMLInputElement;

describe('Tree 多选复选', () => {
  afterEach(cleanup);

  test('checkable 渲染每个节点的复选框，默认不渲染', () => {
    render(<Tree treeData={checkData} defaultExpandedKeys={['p']} checkable />);

    expect(screen.getByRole('treeitem', { name: '父节点' }).querySelector('input')).toBeTruthy();
    expect(getCheckbox('子A')).toBeTruthy();
    expect(getCheckbox('子B')).toBeTruthy();

    cleanup();
    render(<Tree treeData={checkData} defaultExpandedKeys={['p']} />);
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  test('勾选父节点级联勾选所有后代并触发 onCheck', () => {
    const handleCheck = vi.fn();
    render(
      <Tree treeData={checkData} defaultExpandedKeys={['p']} checkable onCheck={handleCheck} />,
    );

    fireEvent.click(getCheckbox('父节点'));
    expect(handleCheck).toHaveBeenCalledWith(['p', 'a', 'b'], {
      checked: true,
      node: expect.objectContaining({ key: 'p' }),
    });
    expect(getCheckbox('父节点').checked).toBe(true);
    expect(getCheckbox('子A').checked).toBe(true);
    expect(getCheckbox('子B').checked).toBe(true);
  });

  test('部分子节点勾选时父节点显示半选', () => {
    render(<Tree treeData={checkData} defaultExpandedKeys={['p']} checkable />);

    fireEvent.click(getCheckbox('子A'));
    const parent = getCheckbox('父节点');
    expect(parent.checked).toBe(false);
    expect(parent.indeterminate).toBe(true);
    expect(getCheckbox('子A').checked).toBe(true);
    expect(getCheckbox('子B').checked).toBe(false);
  });

  test('取消一个子节点后原本全选的父节点回到半选', () => {
    const handleCheck = vi.fn();
    render(
      <Tree treeData={checkData} defaultExpandedKeys={['p']} checkable onCheck={handleCheck} />,
    );

    fireEvent.click(getCheckbox('父节点'));
    fireEvent.click(getCheckbox('子A'));
    const parent = getCheckbox('父节点');
    expect(parent.checked).toBe(false);
    expect(parent.indeterminate).toBe(true);
    expect(handleCheck).toHaveBeenLastCalledWith(['b'], {
      checked: false,
      node: expect.objectContaining({ key: 'a' }),
    });
  });

  test('checkStrictly 不级联勾选子节点', () => {
    const handleCheck = vi.fn();
    render(
      <Tree
        treeData={checkData}
        defaultExpandedKeys={['p']}
        checkable
        checkStrictly
        onCheck={handleCheck}
      />,
    );

    fireEvent.click(getCheckbox('父节点'));
    expect(handleCheck).toHaveBeenCalledWith(['p'], {
      checked: true,
      node: expect.objectContaining({ key: 'p' }),
    });
    expect(getCheckbox('子A').checked).toBe(false);
    expect(getCheckbox('子B').checked).toBe(false);
  });

  test('受控 checkedKeys：勾选不改变界面，onCheck 仍触发', () => {
    const handleCheck = vi.fn();
    render(
      <Tree
        treeData={checkData}
        defaultExpandedKeys={['p']}
        checkable
        checkedKeys={['a']}
        onCheck={handleCheck}
      />,
    );

    expect(getCheckbox('子A').checked).toBe(true);
    fireEvent.click(getCheckbox('子B'));
    expect(handleCheck).toHaveBeenCalledWith(['a', 'b'], {
      checked: true,
      node: expect.objectContaining({ key: 'b' }),
    });
    expect(getCheckbox('子B').checked).toBe(false);
  });

  test('defaultCheckedKeys 传入父 key 时子节点全部勾选', () => {
    render(<Tree treeData={checkData} defaultExpandedKeys={['p']} checkable defaultCheckedKeys={['p']} />);

    expect(getCheckbox('父节点').checked).toBe(true);
    expect(getCheckbox('子A').checked).toBe(true);
    expect(getCheckbox('子B').checked).toBe(true);
  });
});

describe('Tree 异步加载', () => {
  afterEach(cleanup);

  test('展开无子节点的节点时调用 loadData 一次并显示加载状态', async () => {
    let resolveLoad: () => void = () => {};
    const loadData = vi.fn(
      () => new Promise<void>((resolve) => { resolveLoad = resolve; }),
    );
    const asyncData: TreeNode[] = [{ key: 'x', label: '可展开节点' }];
    render(<Tree treeData={asyncData} loadData={loadData} />);

    await userEvent.click(screen.getByRole('button', { name: '展开' }));
    expect(loadData).toHaveBeenCalledTimes(1);
    expect(loadData).toHaveBeenCalledWith(expect.objectContaining({ key: 'x' }));
    // 加载中：节点显示 spinner
    expect(screen.getByRole('status')).toBeTruthy();

    resolveLoad();
    await vi.waitFor(() => expect(screen.queryByRole('status')).toBeNull());

    // 收起再展开：已缓存，不重复调用
    await userEvent.click(screen.getByRole('button', { name: '收起' }));
    await userEvent.click(screen.getByRole('button', { name: '展开' }));
    expect(loadData).toHaveBeenCalledTimes(1);
  });

  test('isLeaf 节点不渲染箭头也不触发 loadData', async () => {
    const loadData = vi.fn(() => Promise.resolve());
    const leafData: TreeNode[] = [{ key: 'l', label: '叶子节点', isLeaf: true }];
    render(<Tree treeData={leafData} loadData={loadData} />);

    expect(screen.queryByRole('button', { name: '展开' })).toBeNull();
    await userEvent.click(screen.getByText('叶子节点'));
    expect(loadData).not.toHaveBeenCalled();
  });
});
