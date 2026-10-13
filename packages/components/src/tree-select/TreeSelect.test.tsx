import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { useState } from 'react';
import type { TreeNode } from '../tree/types';
import { TreeSelect } from './TreeSelect';

afterEach(cleanup);

const treeData: TreeNode[] = [
  {
    key: 'zhejiang',
    label: '浙江',
    children: [
      { key: 'hangzhou', label: '杭州' },
      { key: 'ningbo', label: '宁波' },
    ],
  },
  {
    key: 'jiangsu',
    label: '江苏',
    children: [{ key: 'nanjing', label: '南京' }],
  },
];

const trigger = () => screen.getByRole('combobox');
const panel = () => document.querySelector('.reef-treeselect__panel');
const tree = () => document.querySelector('[role="tree"]');

const openAndExpand = async (label: string) => {
  await userEvent.click(trigger());
  await userEvent.click(screen.getAllByRole('button', { name: '展开' })[0]);
  return screen.getByText(label);
};

describe('TreeSelect', () => {
  test('未选择时显示占位符', () => {
    render(<TreeSelect treeData={treeData} />);
    expect(trigger().textContent).toBe('请选择');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  test('自定义占位符与 defaultValue 回显节点 label', () => {
    render(<TreeSelect treeData={treeData} placeholder="选个城市" defaultValue="ningbo" />);
    expect(trigger().textContent).toBe('宁波');
  });

  test('单选：展开后点选叶子，触发器显示 label 且面板关闭', async () => {
    const onChange = vi.fn();
    render(<TreeSelect treeData={treeData} onChange={onChange} />);

    const leaf = await openAndExpand('杭州');
    await userEvent.click(leaf);

    expect(onChange).toHaveBeenCalledWith('hangzhou');
    expect(trigger().textContent).toBe('杭州');
    expect(panel()).toBeNull();
  });

  test('单选：点选父节点同样选中并关闭', async () => {
    const onChange = vi.fn();
    render(<TreeSelect treeData={treeData} onChange={onChange} />);

    await userEvent.click(trigger());
    await userEvent.click(screen.getByText('浙江'));

    expect(onChange).toHaveBeenCalledWith('zhejiang');
    expect(trigger().textContent).toBe('浙江');
    expect(tree()).toBeNull();
  });

  test('multiple：可连续选中多项，面板保持打开', async () => {
    const onChange = vi.fn();
    render(<TreeSelect treeData={treeData} multiple onChange={onChange} />);

    await userEvent.click(trigger());
    await userEvent.click(screen.getAllByRole('button', { name: '展开' })[0]);

    await userEvent.click(screen.getByText('杭州'));
    await userEvent.click(screen.getByText('宁波'));
    expect(onChange).toHaveBeenLastCalledWith(['hangzhou', 'ningbo']);
    expect(trigger().textContent).toContain('杭州');
    expect(trigger().textContent).toContain('宁波');
    expect(tree()).toBeTruthy();

    // 重复点选同一项取消选中（此时触发器 Tag 与树节点同名，限定在树内查找）
    await userEvent.click(within(tree() as HTMLElement).getByText('杭州'));
    expect(onChange).toHaveBeenLastCalledWith(['ningbo']);
  });

  test('multiple：点标签 × 移除该项', async () => {
    const onChange = vi.fn();
    render(
      <TreeSelect treeData={treeData} multiple defaultValue={['hangzhou', 'ningbo']} onChange={onChange} />,
    );

    await userEvent.click(screen.getAllByLabelText('关闭')[0]);
    expect(onChange).toHaveBeenCalledWith(['ningbo']);
    expect(trigger().textContent).toContain('宁波');
    expect(trigger().textContent).not.toContain('杭州');
  });

  test('searchable：输入关键词过滤节点并自动展开命中路径', async () => {
    const onChange = vi.fn();
    render(<TreeSelect treeData={treeData} searchable onChange={onChange} />);

    await userEvent.click(trigger());
    const input = screen.getByPlaceholderText('搜索');
    await userEvent.type(input, '宁');

    // 只剩 浙江 → 宁波 这条路径，未命中节点不渲染
    expect(screen.getByText('宁波')).toBeTruthy();
    expect(screen.queryByText('杭州')).toBeNull();
    expect(screen.queryByText('南京')).toBeNull();

    // 命中路径已自动展开，无需手动点箭头即可选中
    await userEvent.click(screen.getByText('宁波'));
    expect(onChange).toHaveBeenCalledWith('ningbo');
    expect(trigger().textContent).toBe('宁波');
  });

  test('受控用法：外部 value 不被内部状态覆盖', async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [v] = useState('ningbo');
      return <TreeSelect treeData={treeData} value={v} onChange={onChange} />;
    }
    render(<Controlled />);

    const leaf = await openAndExpand('杭州');
    await userEvent.click(leaf);

    expect(onChange).toHaveBeenCalledWith('hangzhou');
    // 受控 value 未变，触发器仍显示宁波
    expect(trigger().textContent).toBe('宁波');
  });

  test('allowClear：单选有值时显示 ×，点击后清空回到占位符', async () => {
    const onChange = vi.fn();
    render(<TreeSelect treeData={treeData} defaultValue="ningbo" allowClear onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('关闭'));
    expect(onChange).toHaveBeenCalledWith('');
    expect(trigger().textContent).toBe('请选择');
  });

  test('allowClear：无值时不显示清空按钮', () => {
    render(<TreeSelect treeData={treeData} allowClear />);
    expect(screen.queryByLabelText('关闭')).toBeNull();
    // 单选无值时触发器仍是 button
    expect(trigger().tagName).toBe('BUTTON');
  });

  test('disabled：点击不打开面板', async () => {
    render(<TreeSelect treeData={treeData} disabled />);
    await userEvent.click(trigger());
    expect(panel()).toBeNull();
  });

  test('键盘：Enter 打开面板，Escape 关闭', async () => {
    render(<TreeSelect treeData={treeData} />);

    trigger().focus();
    await userEvent.keyboard('{Enter}');
    expect(tree()).toBeTruthy();

    await userEvent.keyboard('{Escape}');
    expect(tree()).toBeNull();
  });
});
