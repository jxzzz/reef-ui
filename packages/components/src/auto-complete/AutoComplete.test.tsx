import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { AutoComplete } from './AutoComplete';

afterEach(cleanup);

// jsdom 未实现 scrollIntoView
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

const cities = ['北京', '上海', '广州'];

const input = () => document.querySelector('.reef-autocomplete input') as HTMLInputElement;
const listbox = () => document.querySelector('[role="listbox"]');

describe('AutoComplete', () => {
  test('输入后面板打开并按关键词过滤选项', async () => {
    render(<AutoComplete options={cities} />);

    await userEvent.type(input(), '北');
    expect(listbox()).toBeTruthy();
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: '北京' })).toBeTruthy();
  });

  test('点击选项触发 onChange 并回填输入框，面板关闭', async () => {
    const onChange = vi.fn();
    render(<AutoComplete options={cities} onChange={onChange} />);

    await userEvent.type(input(), '上');
    await userEvent.click(screen.getByRole('option', { name: '上海' }));
    expect(onChange).toHaveBeenLastCalledWith('上海');
    expect(input().value).toBe('上海');
    expect(listbox()).toBeNull();
  });

  test('Escape 关闭面板，再次输入重新打开', async () => {
    render(<AutoComplete options={cities} />);

    await userEvent.type(input(), '北');
    expect(listbox()).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(listbox()).toBeNull();

    await userEvent.type(input(), '京');
    expect(listbox()).toBeTruthy();
  });

  test('键盘：ArrowDown 下移高亮，Enter 选中', async () => {
    const onChange = vi.fn();
    render(<AutoComplete options={cities} filter={false} onChange={onChange} />);

    await userEvent.type(input(), '北');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('上海');
    expect(input().value).toBe('上海');
  });

  test('无匹配选项时面板不显示', async () => {
    render(<AutoComplete options={cities} />);
    await userEvent.type(input(), '深');
    expect(listbox()).toBeNull();
  });

  test('受控用法：外部 value 不被内部状态覆盖', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<AutoComplete options={cities} value="北京" onChange={onChange} />);

    expect(input().value).toBe('北京');
    await userEvent.type(input(), '上');
    expect(onChange).toHaveBeenCalledWith('北京上');

    // 父组件保持 value 不变，重渲染后输入框仍是北京
    rerender(<AutoComplete options={cities} value="北京" onChange={onChange} />);
    expect(input().value).toBe('北京');
  });

  test('对象选项：按 label 过滤，onChange 抛出 value', async () => {
    const onChange = vi.fn();
    const options = [
      { label: 'New York', value: 'new-york' },
      { label: 'Los Angeles', value: 'la' },
    ];
    render(<AutoComplete options={options} onChange={onChange} />);

    await userEvent.type(input(), 'los');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    await userEvent.click(screen.getByRole('option', { name: 'Los Angeles' }));
    expect(onChange).toHaveBeenLastCalledWith('la');
    expect(input().value).toBe('la');
  });

  test('filter=false 时输入展示全部选项', async () => {
    render(<AutoComplete options={cities} filter={false} />);

    await userEvent.type(input(), '北');
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  test('defaultValue 直接回填输入框', () => {
    render(<AutoComplete options={cities} defaultValue="广州" />);
    expect(input().value).toBe('广州');
  });

  test('点击外部关闭面板', async () => {
    render(<AutoComplete options={cities} />);

    await userEvent.type(input(), '北');
    expect(listbox()).toBeTruthy();
    await userEvent.click(document.body);
    expect(listbox()).toBeNull();
  });

  test('disabled 时输入不弹面板', async () => {
    render(<AutoComplete options={cities} disabled />);
    expect(input().disabled).toBe(true);
    await userEvent.type(input(), '北').catch(() => {});
    expect(listbox()).toBeNull();
  });
});
