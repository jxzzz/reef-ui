import { useState } from 'react';
import { Select } from '@reef-ui/components';
import type { SelectOption } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const cityOptions: SelectOption[] = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou' },
  { label: '成都', value: 'chengdu' },
];

const disabledOptions: SelectOption[] = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing', disabled: true },
  { label: '深圳', value: 'shenzhen' },
];

const basicCode = `<Select options={cityOptions} placeholder="请选择城市" />
<Select options={cityOptions} defaultValue="shanghai" />
<Select options={cityOptions} disabled />`;

const sizeCode = `<Select options={cityOptions} size="small" placeholder="Small" />
<Select options={cityOptions} placeholder="Medium" />
<Select options={cityOptions} size="large" placeholder="Large" />`;

const stateCode = `<Select options={cityOptions} invalid placeholder="校验失败" />
<Select options={cityOptions} block placeholder="占满整行" />`;

const controlledCode = `const [city, setCity] = useState('');
<Select options={cityOptions} value={city} onChange={setCity} />`;

export function SelectPage() {
  const [city, setCity] = useState('');

  return (
    <>
      <h2>Select 选择器</h2>
      <p>
        从一组选项中选择一项。自绘弹层，暗色主题下样式一致；支持键盘操作
        （Enter / 空格打开，上下键移动，Enter 选中，Esc 关闭）。
      </p>

      <Demo title="基础用法" code={basicCode}>
        <Select options={cityOptions} placeholder="请选择城市" />
        <Select options={cityOptions} defaultValue="shanghai" />
        <Select options={cityOptions} disabled />
      </Demo>

      <Demo title="尺寸" code={sizeCode}>
        <Select options={cityOptions} size="small" placeholder="Small" />
        <Select options={cityOptions} placeholder="Medium" />
        <Select options={cityOptions} size="large" placeholder="Large" />
      </Demo>

      <Demo title="禁用选项与状态" code={stateCode}>
        <Select options={disabledOptions} placeholder="有禁用项" />
        <Select options={cityOptions} invalid placeholder="校验失败" />
        <Select options={cityOptions} block placeholder="占满整行" />
      </Demo>

      <Demo title="受控" code={controlledCode}>
        <Select options={cityOptions} value={city} onChange={setCity} placeholder="受控选择" />
        <span>当前值：{city || '-'}</span>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['options', '选项数组 { label, value, disabled? }', 'SelectOption[]', '-'],
          ['value', '当前值（受控）', 'string', '-'],
          ['defaultValue', '默认值（非受控）', 'string', '-'],
          ['onChange', '选中回调 (value)', 'function', '-'],
          ['placeholder', '占位文字', 'string', "'请选择'"],
          ['size', '尺寸', "'small' | 'medium' | 'large'", "'medium'"],
          ['invalid', '校验失败态', 'boolean', 'false'],
          ['block', '宽度撑满父容器', 'boolean', 'false'],
        ]}
      />
      <p>支持受控与非受控两种用法；disabled 选项键盘导航仍可经过，但无法选中。</p>
    </>
  );
}
