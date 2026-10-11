import { useState } from 'react';
import { Segmented, type SegmentedOption } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `const options: SegmentedOption[] = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
];
<Segmented options={options} />`,
  en: `const options: SegmentedOption[] = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];
<Segmented options={options} />`,
};

const controlledCode = `const [range, setRange] = useState('week');
<Segmented options={options} value={range} onChange={setRange} />`;

export function SegmentedPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [range, setRange] = useState('week');
  const options: SegmentedOption[] = zh
    ? [
        { label: '日', value: 'day' },
        { label: '周', value: 'week' },
        { label: '月', value: 'month' },
      ]
    : [
        { label: 'Day', value: 'day' },
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
      ];
  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Segmented 分段控制器' : 'Segmented'}>
        {zh ? '在一组互斥选项中切换单个值。' : 'Switch a single value among a set of mutually exclusive options.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Segmented options={options} />
      </Demo>

      <Demo title={zh ? '受控用法' : 'Controlled'} code={controlledCode}>
        <Segmented options={options} value={range} onChange={setRange} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['options', zh ? '选项数组 { label, value }' : 'Array of options { label, value }', 'SegmentedOption[]', zh ? '必填' : 'Required'],
          ['value', zh ? '受控选中值' : 'Selected value (controlled)', 'string', '—'],
          ['defaultValue', zh ? '非受控初始值（默认第一项）' : 'Initial value (uncontrolled, defaults to the first option)', 'string', '—'],
          ['onChange', zh ? '选中变化回调' : 'Called when the selection changes', '(value: string) => void', '—'],
        ]}
      />

      <TypeBlock
        code={`interface SegmentedOption {
  label: ReactNode;
  value: string;
}`}
      />
    </>
  );
}
