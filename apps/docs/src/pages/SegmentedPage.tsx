import { useState } from 'react';
import { Segmented } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const options = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
];

const basicCode = `<Segmented options={options} />`;

const controlledCode = `const [range, setRange] = useState('week');
<Segmented options={options} value={range} onChange={setRange} />`;

export function SegmentedPage() {
  const [range, setRange] = useState('week');
  return (
    <>
      <h2>Segmented 分段控制器</h2>
      <p>在一组互斥选项中切换单个值。</p>

      <Demo title="基础用法" code={basicCode}>
        <Segmented options={options} />
      </Demo>

      <Demo title="受控用法" code={controlledCode}>
        <Segmented options={options} value={range} onChange={setRange} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['options', '选项配置', 'SegmentedOption[]', '必填'],
          ['value', '受控选中值', 'string', '—'],
          ['defaultValue', '非受控初始值（默认第一项）', 'string', '—'],
          ['onChange', '选中变化回调', '(value: string) => void', '—'],
        ]}
      />
    </>
  );
}
