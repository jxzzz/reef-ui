import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Transfer } from './Transfer';
import type { TransferItem } from './types';

afterEach(cleanup);

const data: TransferItem[] = [
  { key: 'a', title: '苹果' },
  { key: 'b', title: '香蕉' },
  { key: 'c', title: '樱桃', disabled: true },
  { key: 'd', title: '葡萄' },
];

const leftBody = () => document.querySelector('.reef-transfer__panel--left .reef-transfer__body');
const rightBody = () => document.querySelector('.reef-transfer__panel--right .reef-transfer__body');
const moveRight = () => screen.getByRole('button', { name: '移到右侧' });
const moveLeft = () => screen.getByRole('button', { name: '移到左侧' });

describe('Transfer', () => {
  test('初始按 targetKeys 分布两侧并显示默认标题与计数', () => {
    render(<Transfer dataSource={data} targetKeys={['b', 'd']} />);
    expect(leftBody()?.textContent).toContain('苹果');
    expect(leftBody()?.textContent).toContain('樱桃');
    expect(rightBody()?.textContent).toContain('香蕉');
    expect(rightBody()?.textContent).toContain('葡萄');
    expect(document.querySelector('.reef-transfer__panel--left .reef-transfer__title')?.textContent).toBe('未选择');
    expect(document.querySelector('.reef-transfer__panel--right .reef-transfer__title')?.textContent).toBe('已选择');
  });

  test('勾选后点右移触发 onChange，携带新的 targetKeys 与移动项', async () => {
    const onChange = vi.fn();
    render(<Transfer dataSource={data} targetKeys={['b', 'd']} onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('苹果'));
    expect(moveRight().hasAttribute('disabled')).toBe(false);
    await userEvent.click(moveRight());

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(['a', 'b', 'd'], 'right', ['a']);
  });

  test('非受控：defaultTargetKeys 起步，右移后内部状态更新', async () => {
    render(<Transfer dataSource={data} defaultTargetKeys={['b']} />);

    await userEvent.click(screen.getByLabelText('苹果'));
    await userEvent.click(moveRight());

    expect(leftBody()?.textContent).not.toContain('苹果');
    expect(rightBody()?.textContent).toContain('苹果');
    expect(rightBody()?.textContent).toContain('香蕉');
  });

  test('禁用项渲染为未选中且不可勾选，移动按钮保持禁用', async () => {
    render(<Transfer dataSource={data} targetKeys={['b']} />);

    const disabledBox = screen.getByLabelText('樱桃') as HTMLInputElement;
    expect(disabledBox.disabled).toBe(true);
    expect(disabledBox.checked).toBe(false);
    expect(disabledBox.closest('.reef-transfer__item')?.classList.contains('reef-transfer__item--disabled')).toBe(true);

    await userEvent.click(disabledBox);
    expect(moveRight().hasAttribute('disabled')).toBe(true);
  });

  test('右移后再左移触发 onChange 且方向为 left', async () => {
    const onChange = vi.fn();
    render(<Transfer dataSource={data} defaultTargetKeys={['b']} onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('香蕉'));
    await userEvent.click(moveLeft());

    expect(onChange).toHaveBeenCalledWith([], 'left', ['b']);
    expect(leftBody()?.textContent).toContain('香蕉');
  });

  test('searchable：输入关键词按 title 过滤且不区分大小写', async () => {
    render(<Transfer dataSource={data} targetKeys={['d']} searchable />);

    const input = screen.getByLabelText('搜索未选择列表');
    await userEvent.type(input, '苹');
    expect(leftBody()?.textContent).toContain('苹果');
    expect(leftBody()?.textContent).not.toContain('樱桃');

    await userEvent.clear(input);
    await userEvent.type(input, 'C'); // 无匹配时列表为空
    expect(leftBody()?.textContent).not.toContain('苹果');
  });

  test('受控：targetKeys 不被内部状态覆盖', async () => {
    const onChange = vi.fn();
    render(<Transfer dataSource={data} targetKeys={['b']} onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('苹果'));
    await userEvent.click(moveRight());

    expect(onChange).toHaveBeenCalledWith(['a', 'b'], 'right', ['a']);
    // 受控 targetKeys 未变，苹果仍在左侧
    expect(leftBody()?.textContent).toContain('苹果');
  });
});
