import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { useState } from 'react';
import { Select } from './Select';

afterEach(cleanup);

// jsdom 未实现 scrollIntoView
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '禁用项', value: 'gone', disabled: true },
];

const trigger = () => screen.getByRole('combobox');
const listbox = () => document.querySelector('[role="listbox"]');

describe('Select', () => {
  test('未选择时显示占位符，点开列表后点选回调并关闭', async () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);

    expect(trigger().textContent).toBe('请选择');
    await userEvent.click(trigger());
    expect(listbox()).toBeTruthy();

    await userEvent.click(screen.getByRole('option', { name: '香蕉' }));
    expect(onChange).toHaveBeenCalledWith('banana');
    expect(trigger().textContent).toBe('香蕉');
    expect(listbox()).toBeNull();
  });

  test('defaultValue 直接显示对应 label', () => {
    render(<Select options={options} defaultValue="apple" />);
    expect(trigger().textContent).toBe('苹果');
  });

  test('受控用法：value 不被内部状态覆盖', async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [v] = useState('apple');
      return <Select options={options} value={v} onChange={onChange} />;
    }
    render(<Controlled />);

    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('option', { name: '香蕉' }));
    expect(onChange).toHaveBeenCalledWith('banana');
    // 受控 value 未变，显示仍是苹果
    expect(trigger().textContent).toBe('苹果');
  });

  test('键盘：ArrowDown 打开并下移高亮，Enter 选中', async () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);

    trigger().focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(listbox()).toBeTruthy();

    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('banana');
  });

  test('Escape 关闭列表', async () => {
    render(<Select options={options} />);
    await userEvent.click(trigger());
    await userEvent.keyboard('{Escape}');
    expect(listbox()).toBeNull();
  });

  test('disabled 选项不可选中', async () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    await userEvent.click(trigger());
    const gone = screen.getByRole('option', { name: '禁用项' });
    expect(gone.getAttribute('aria-disabled')).toBe('true');
    await userEvent.click(gone);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('aria-expanded 随开合切换', async () => {
    render(<Select options={options} />);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(trigger());
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  test('multiple：选中两项后触发器显示两个标签，面板不关闭', async () => {
    const onChange = vi.fn();
    render(<Select options={options} multiple onChange={onChange} />);

    await userEvent.click(trigger());
    expect(listbox()?.getAttribute('aria-multiselectable')).toBe('true');

    await userEvent.click(screen.getByRole('option', { name: '苹果' }));
    await userEvent.click(screen.getByRole('option', { name: '香蕉' }));
    expect(onChange).toHaveBeenLastCalledWith(['apple', 'banana']);
    expect(trigger().textContent).toContain('苹果');
    expect(trigger().textContent).toContain('香蕉');
    expect(listbox()).toBeTruthy();
  });

  test('multiple：点标签 × 移除该项并抛出剩余数组', async () => {
    const onChange = vi.fn();
    render(<Select options={options} multiple defaultValue={['apple', 'banana']} onChange={onChange} />);

    await userEvent.click(screen.getAllByLabelText('关闭')[0]);
    expect(onChange).toHaveBeenCalledWith(['banana']);
    expect(trigger().textContent).toContain('香蕉');
    expect(trigger().textContent).not.toContain('苹果');
  });

  test('multiple：面板重复点选同一项切换选中态', async () => {
    const onChange = vi.fn();
    render(<Select options={options} multiple onChange={onChange} />);

    await userEvent.click(trigger());
    const opt = screen.getByRole('option', { name: '苹果' });
    await userEvent.click(opt);
    expect(onChange).toHaveBeenLastCalledWith(['apple']);
    expect(opt.getAttribute('aria-selected')).toBe('true');

    await userEvent.click(opt);
    expect(onChange).toHaveBeenLastCalledWith([]);
    expect(opt.getAttribute('aria-selected')).toBe('false');
  });

  test('multiple：div 触发器可聚焦，Enter/Space 打开面板，Enter 切换选中而非关闭', async () => {
    const onChange = vi.fn();
    render(<Select options={options} multiple onChange={onChange} />);

    // multiple 触发器是 div[role=combobox]，避免 Tag 的关闭按钮嵌套在 button 里
    expect(trigger().tagName).toBe('DIV');
    expect(trigger().getAttribute('tabindex')).toBe('0');

    trigger().focus();
    await userEvent.keyboard('{Enter}');
    expect(listbox()).toBeTruthy();

    await userEvent.keyboard('{Escape}');
    expect(listbox()).toBeNull();

    await userEvent.keyboard('{ }');
    expect(listbox()).toBeTruthy();

    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['banana']);
    expect(listbox()).toBeTruthy();
  });

  test('searchable：输入关键词过滤选项列表', async () => {
    render(<Select options={options} searchable />);

    await userEvent.click(trigger());
    const input = screen.getByPlaceholderText('搜索');
    await userEvent.type(input, '香');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: '香蕉' })).toBeTruthy();
  });

  test('searchable：单选选中后面板关闭且搜索词清空', async () => {
    const onChange = vi.fn();
    render(<Select options={options} searchable onChange={onChange} />);

    await userEvent.click(trigger());
    await userEvent.type(screen.getByPlaceholderText('搜索'), '香');
    await userEvent.click(screen.getByRole('option', { name: '香蕉' }));
    expect(onChange).toHaveBeenCalledWith('banana');
    expect(listbox()).toBeNull();

    // 重新打开，搜索词已清空，选项恢复全量
    await userEvent.click(trigger());
    const input = screen.getByPlaceholderText('搜索') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });
});
