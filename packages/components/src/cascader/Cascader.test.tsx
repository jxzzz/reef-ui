import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { useState } from 'react';
import { Cascader } from './Cascader';
import type { CascaderOption } from './types';
import { LocaleProvider, enUS } from '../locale';

afterEach(cleanup);

// jsdom 未实现 scrollIntoView
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

const options: CascaderOption[] = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '滨江区', value: 'binjiang' },
        ],
      },
    ],
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      {
        label: '南京',
        value: 'nanjing',
        children: [{ label: '玄武区', value: 'xuanwu' }],
      },
    ],
  },
  {
    label: '台湾',
    value: 'taiwan',
    disabled: true,
    children: [{ label: '台北', value: 'taipei' }],
  },
];

const trigger = () => screen.getByRole('combobox');
const colCount = () => document.querySelectorAll('[role="listbox"]').length;

describe('Cascader', () => {
  test('逐级点选到叶子：抛完整路径数组、触发器显示路径并关闭', async () => {
    const onChange = vi.fn();
    render(<Cascader options={options} onChange={onChange} />);

    await userEvent.click(trigger());
    expect(colCount()).toBe(1);

    await userEvent.click(screen.getByRole('option', { name: '浙江' }));
    expect(colCount()).toBe(2);

    await userEvent.click(screen.getByRole('option', { name: '杭州' }));
    expect(colCount()).toBe(3);

    await userEvent.click(screen.getByRole('option', { name: '西湖区' }));
    expect(onChange).toHaveBeenCalledWith(['zhejiang', 'hangzhou', 'xihu']);
    expect(trigger().textContent).toBe('浙江 / 杭州 / 西湖区');
    expect(colCount()).toBe(0);
  });

  test('切换同级选项时截断已展开的列', async () => {
    render(<Cascader options={options} />);

    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('option', { name: '浙江' }));
    await userEvent.click(screen.getByRole('option', { name: '杭州' }));
    expect(colCount()).toBe(3);

    await userEvent.click(screen.getByRole('option', { name: '江苏' }));
    expect(colCount()).toBe(2);
  });

  test('placeholder 随语言包：enUS 下显示 Select', () => {
    render(
      <LocaleProvider locale={enUS}>
        <Cascader options={options} />
      </LocaleProvider>,
    );
    expect(trigger().textContent).toBe('Select');
  });

  test('defaultValue 直接显示路径文本', () => {
    render(<Cascader options={options} defaultValue={['zhejiang', 'hangzhou', 'xihu']} />);
    expect(trigger().textContent).toBe('浙江 / 杭州 / 西湖区');
  });

  test('受控用法：value 不被内部状态覆盖', async () => {
    const onChange = vi.fn();
    function Controlled() {
      const [v] = useState<string[]>(['jiangsu', 'nanjing', 'xuanwu']);
      return <Cascader options={options} value={v} onChange={onChange} />;
    }
    render(<Controlled />);

    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('option', { name: '浙江' }));
    await userEvent.click(screen.getByRole('option', { name: '杭州' }));
    await userEvent.click(screen.getByRole('option', { name: '西湖区' }));
    expect(onChange).toHaveBeenCalledWith(['zhejiang', 'hangzhou', 'xihu']);
    // 受控 value 未变，显示仍是江苏路径
    expect(trigger().textContent).toBe('江苏 / 南京 / 玄武区');
  });

  test('disabled 选项点击无效果：不展开列也不触发回调', async () => {
    const onChange = vi.fn();
    render(<Cascader options={options} onChange={onChange} />);
    await userEvent.click(trigger());

    const gone = screen.getByRole('option', { name: '台湾' });
    expect(gone.getAttribute('aria-disabled')).toBe('true');
    await userEvent.click(gone);
    expect(colCount()).toBe(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('键盘：ArrowDown 打开，Enter 逐级展开并选中叶子', async () => {
    const onChange = vi.fn();
    render(<Cascader options={options} onChange={onChange} />);

    trigger().focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(colCount()).toBe(1);

    // Enter 展开第一项（浙江）、再展开杭州，ArrowDown 移动后 Enter 选中滨江区
    await userEvent.keyboard('{Enter}');
    expect(colCount()).toBe(2);
    await userEvent.keyboard('{Enter}');
    expect(colCount()).toBe(3);
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith(['zhejiang', 'hangzhou', 'binjiang']);
  });

  test('Escape 关闭面板', async () => {
    render(<Cascader options={options} />);
    await userEvent.click(trigger());
    expect(trigger().getAttribute('aria-expanded')).toBe('true');

    await userEvent.keyboard('{Escape}');
    expect(colCount()).toBe(0);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });
});
