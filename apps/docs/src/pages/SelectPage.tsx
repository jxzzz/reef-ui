import { useState } from 'react';
import { Select } from '@reef-ui/components';
import type { SelectOption } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const cityOptionsCode = {
  zh: `const cityOptions = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou' },
  { label: '成都', value: 'chengdu' },
];`,
  en: `const cityOptions = [
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shenzhen', value: 'shenzhen' },
  { label: 'Hangzhou', value: 'hangzhou' },
  { label: 'Chengdu', value: 'chengdu' },
];`,
};

const basicCode: Record<Lang, string> = {
  zh: `${cityOptionsCode.zh}
<Select options={cityOptions} placeholder="请选择城市" />
<Select options={cityOptions} defaultValue="shanghai" />
<Select options={cityOptions} disabled />`,
  en: `${cityOptionsCode.en}
<Select options={cityOptions} placeholder="Select a city" />
<Select options={cityOptions} defaultValue="shanghai" />
<Select options={cityOptions} disabled />`,
};

const sizeCode: Record<Lang, string> = {
  zh: `${cityOptionsCode.zh}
<Select options={cityOptions} size="small" placeholder="小" />
<Select options={cityOptions} placeholder="中" />
<Select options={cityOptions} size="large" placeholder="大" />`,
  en: `${cityOptionsCode.en}
<Select options={cityOptions} size="small" placeholder="Small" />
<Select options={cityOptions} placeholder="Medium" />
<Select options={cityOptions} size="large" placeholder="Large" />`,
};

const stateCode: Record<Lang, string> = {
  zh: `const disabledOptions = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing', disabled: true },
  { label: '深圳', value: 'shenzhen' },
];
${cityOptionsCode.zh}
<Select options={disabledOptions} placeholder="有禁用项" />
<Select options={cityOptions} invalid placeholder="校验失败" />
<Select options={cityOptions} block placeholder="占满整行" />`,
  en: `const disabledOptions = [
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Beijing', value: 'beijing', disabled: true },
  { label: 'Shenzhen', value: 'shenzhen' },
];
${cityOptionsCode.en}
<Select options={disabledOptions} placeholder="With disabled option" />
<Select options={cityOptions} invalid placeholder="Validation failed" />
<Select options={cityOptions} block placeholder="Fill the row" />`,
};

const controlledCode: Record<Lang, string> = {
  zh: `const [city, setCity] = useState('');
${cityOptionsCode.zh}
<Select options={cityOptions} value={city} onChange={setCity} placeholder="受控选择" />
<span>当前值：{city || '-'}</span>`,
  en: `const [city, setCity] = useState('');
${cityOptionsCode.en}
<Select options={cityOptions} value={city} onChange={setCity} placeholder="Controlled select" />
<span>Current value: {city || '-'}</span>`,
};

export function SelectPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [city, setCity] = useState('');

  const cityOptions: SelectOption[] = zh
    ? [
        { label: '上海', value: 'shanghai' },
        { label: '北京', value: 'beijing' },
        { label: '深圳', value: 'shenzhen' },
        { label: '杭州', value: 'hangzhou' },
        { label: '成都', value: 'chengdu' },
      ]
    : [
        { label: 'Shanghai', value: 'shanghai' },
        { label: 'Beijing', value: 'beijing' },
        { label: 'Shenzhen', value: 'shenzhen' },
        { label: 'Hangzhou', value: 'hangzhou' },
        { label: 'Chengdu', value: 'chengdu' },
      ];

  const disabledOptions: SelectOption[] = zh
    ? [
        { label: '上海', value: 'shanghai' },
        { label: '北京', value: 'beijing', disabled: true },
        { label: '深圳', value: 'shenzhen' },
      ]
    : [
        { label: 'Shanghai', value: 'shanghai' },
        { label: 'Beijing', value: 'beijing', disabled: true },
        { label: 'Shenzhen', value: 'shenzhen' },
      ];

  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Select 选择器' : 'Select'}>
        {zh ? (
          <>
            从一组选项中选择一项。自绘弹层，暗色主题下样式一致；支持键盘操作
            （Enter / 空格打开，上下键移动，Enter 选中，Esc 关闭）。
          </>
        ) : (
          <>
            Select one item from a set of options. Custom-drawn popup keeps styling consistent in
            dark themes; supports keyboard operation (Enter / Space to open, arrow keys to move,
            Enter to select, Esc to close).
          </>
        )}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <>
            <Select options={cityOptions} placeholder="请选择城市" />
            <Select options={cityOptions} defaultValue="shanghai" />
            <Select options={cityOptions} disabled />
          </>
        ) : (
          <>
            <Select options={cityOptions} placeholder="Select a city" />
            <Select options={cityOptions} defaultValue="shanghai" />
            <Select options={cityOptions} disabled />
          </>
        )}
      </Demo>

      <Demo title={zh ? '尺寸' : 'Sizes'} code={zh ? sizeCode.zh : sizeCode.en}>
        {zh ? (
          <>
            <Select options={cityOptions} size="small" placeholder="小" />
            <Select options={cityOptions} placeholder="中" />
            <Select options={cityOptions} size="large" placeholder="大" />
          </>
        ) : (
          <>
            <Select options={cityOptions} size="small" placeholder="Small" />
            <Select options={cityOptions} placeholder="Medium" />
            <Select options={cityOptions} size="large" placeholder="Large" />
          </>
        )}
      </Demo>

      <Demo title={zh ? '禁用选项与状态' : 'Disabled options and states'} code={zh ? stateCode.zh : stateCode.en}>
        {zh ? (
          <>
            <Select options={disabledOptions} placeholder="有禁用项" />
            <Select options={cityOptions} invalid placeholder="校验失败" />
            <Select options={cityOptions} block placeholder="占满整行" />
          </>
        ) : (
          <>
            <Select options={disabledOptions} placeholder="With disabled option" />
            <Select options={cityOptions} invalid placeholder="Validation failed" />
            <Select options={cityOptions} block placeholder="Fill the row" />
          </>
        )}
      </Demo>

      <Demo title={zh ? '受控' : 'Controlled'} code={zh ? controlledCode.zh : controlledCode.en}>
        {zh ? (
          <>
            <Select options={cityOptions} value={city} onChange={setCity} placeholder="受控选择" />
            <span>当前值：{city || '-'}</span>
          </>
        ) : (
          <>
            <Select options={cityOptions} value={city} onChange={setCity} placeholder="Controlled select" />
            <span>Current value: {city || '-'}</span>
          </>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['options', zh ? '选项数组 { label, value, disabled? }' : 'Array of options { label, value, disabled? }', 'SelectOption[]', '-'],
          ['value', zh ? '当前值（受控）' : 'Current value (controlled)', 'string', '-'],
          ['defaultValue', zh ? '默认值（非受控）' : 'Default value (uncontrolled)', 'string', '-'],
          ['onChange', zh ? '选中回调 (value)' : 'Called when an option is selected (value)', '(value: string) => void', '-'],
          ['placeholder', zh ? '占位文字' : 'Placeholder text', 'string', zh ? '"请选择"（随语言包）' : '"Select" (locale)'],
          ['size', zh ? '尺寸' : 'Size', "'small' | 'medium' | 'large'", "'medium'"],
          ['invalid', zh ? '校验失败态' : 'Validation-failed state', 'boolean', 'false'],
          ['block', zh ? '宽度撑满父容器' : 'Fill the parent container width', 'boolean', 'false'],
          ['disabled', zh ? '禁用整只选择器' : 'Disable the whole select', 'boolean', 'false'],
        ]}
      />

      <TypeBlock
        code={`interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}`}
      />
      <p>
        {zh
          ? '支持受控与非受控两种用法；disabled 选项键盘导航仍可经过，但无法选中。'
          : 'Supports both controlled and uncontrolled usage; disabled options can still be traversed with keyboard navigation but cannot be selected.'}
      </p>
    </>
  );
}
