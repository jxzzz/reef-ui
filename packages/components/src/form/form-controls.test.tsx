import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { ReactElement } from 'react';
import { Form } from './Form';
import { FormItem } from './FormItem';
import { AutoComplete } from '../auto-complete';
import { Cascader } from '../cascader';
import { DatePicker, DateRangePicker } from '../date-picker';
import { Rate } from '../rate';
import { Segmented } from '../segmented';
import { Select } from '../select';
import { Switch } from '../switch';
import { TimePicker } from '../time-picker';
import { Transfer } from '../transfer';
import { TreeSelect } from '../tree-select';

afterEach(cleanup);

const opts = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
];
const cityTree = [{ key: 'bj', label: '北京' }];
const area = [{ label: '浙江', value: 'zj', children: [{ label: '杭州', value: 'hz' }] }];
const items = [
  { key: 'a', title: 'A' },
  { key: 'b', title: 'B' },
];

/** [用例名, 有值时的控件, 无值时的控件, 期望提交到的值] */
const cases: Array<[string, ReactElement, ReactElement | null, unknown]> = [
  ['Select', <Select name="f" options={opts} value="bj" />, <Select name="f" options={opts} />, 'bj'],
  [
    'Select 多选',
    <Select name="f" multiple options={opts} value={['bj', 'sh']} />,
    <Select name="f" multiple options={opts} value={[]} />,
    ['bj', 'sh'],
  ],
  [
    'DatePicker',
    <DatePicker name="f" value="2024-01-01" />,
    <DatePicker name="f" />,
    '2024-01-01',
  ],
  [
    'DateRangePicker',
    <DateRangePicker name="f" value={['2024-01-01', '2024-01-31']} />,
    <DateRangePicker name="f" value={[null, null]} />,
    ['2024-01-01', '2024-01-31'],
  ],
  ['TimePicker', <TimePicker name="f" value="09:30" />, <TimePicker name="f" />, '09:30'],
  ['Cascader', <Cascader name="f" options={area} value={['zj', 'hz']} />, <Cascader name="f" options={area} />, ['zj', 'hz']],
  ['TreeSelect', <TreeSelect name="f" treeData={cityTree} value="bj" />, <TreeSelect name="f" treeData={cityTree} />, 'bj'],
  [
    'Transfer',
    <Transfer name="f" dataSource={items} targetKeys={['a', 'b']} />,
    <Transfer name="f" dataSource={items} targetKeys={[]} />,
    ['a', 'b'],
  ],
  ['Rate', <Rate name="f" value={3} />, <Rate name="f" value={0} />, '3'],
  ['Switch', <Switch name="f" checked />, <Switch name="f" />, 'true'],
  ['AutoComplete', <AutoComplete name="f" options={['hi']} value="hi" />, <AutoComplete name="f" options={['hi']} />, 'hi'],
  // Segmented 永远有选中项（同 radio group 默认值），没有「空」这一态
  ['Segmented', <Segmented name="f" options={opts} value="sh" />, null, 'sh'],
];

describe('受控组件接入 Form：name 让值进入 FormData', () => {
  test.each(cases)('%s：有值时提交，onFinish 拿到值', async (_label, filled, _empty, expected) => {
    const onFinish = vi.fn();
    render(
      <Form onFinish={onFinish}>
        <FormItem name="f" label="字段">
          {filled}
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(onFinish).toHaveBeenCalledWith({ f: expected });
  });

  test.each(cases.filter((c) => c[2] !== null))(
    '%s：无值时 required 规则报错，不触发 onFinish',
    async (_label, _filled, empty, _expected) => {
      const onFinish = vi.fn();
      render(
        <Form onFinish={onFinish}>
          <FormItem name="f" label="字段" rules={[{ required: true, message: '必填' }]}>
            {empty!}
          </FormItem>
          <button type="submit">提交</button>
        </Form>,
      );
      await userEvent.click(screen.getByRole('button', { name: '提交' }));
      expect((await screen.findByRole('alert')).textContent).toBe('必填');
      expect(onFinish).not.toHaveBeenCalled();
    },
  );

  test('不传 name 时不渲染隐藏 input，DOM 与原来一致', () => {
    const { container } = render(<Select options={opts} value="bj" />);
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });
});
