import { useState } from 'react';
import { Rate } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `const [value, setValue] = useState(0);

<Rate value={value} onChange={setValue} />
<span>当前分：{value}</span>`,
  en: `const [value, setValue] = useState(0);

<Rate value={value} onChange={setValue} />
<span>Score: {value}</span>`,
};

const readonlyCode: Record<Lang, string> = {
  zh: `<Rate defaultValue={3} readonly />`,
  en: `<Rate defaultValue={3} readonly />`,
};

const clearableCode: Record<Lang, string> = {
  zh: `<Rate defaultValue={2} allowClear />`,
  en: `<Rate defaultValue={2} allowClear />`,
};

export function RatePage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [value, setValue] = useState(0);

  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Rate 评分' : 'Rate'}>
        {zh
          ? '星形评分组件，支持受控/非受控、只读与点击清零。基于 role="radiogroup" 实现，键盘可访问。'
          : 'Star rating with controlled/uncontrolled modes, readonly and click-to-clear. Built on role="radiogroup" with keyboard accessibility.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Rate value={value} onChange={setValue} />
        <span>{zh ? `当前分：${value}` : `Score: ${value}`}</span>
      </Demo>

      <Demo title={zh ? '只读' : 'Readonly'} code={zh ? readonlyCode.zh : readonlyCode.en}>
        <Rate defaultValue={3} readonly />
      </Demo>

      <Demo title={zh ? '允许清除' : 'Allow clear'} code={zh ? clearableCode.zh : clearableCode.en}>
        <Rate defaultValue={2} allowClear />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['value', zh ? '受控值（0 ~ count）' : 'Value (controlled, 0 ~ count)', 'number', '—'],
          ['defaultValue', zh ? '非受控初始值' : 'Initial value (uncontrolled)', 'number', '0'],
          ['onChange', zh ? '选择变化回调' : 'Called when the value changes', '(value: number) => void', '—'],
          ['count', zh ? '星星总数' : 'Total number of stars', 'number', '5'],
          ['disabled', zh ? '禁用状态' : 'Disabled state', 'boolean', 'false'],
          ['readonly', zh ? '只读：保留焦点但不可交互' : 'Readonly: focusable but not interactive', 'boolean', 'false'],
          ['allowClear', zh ? '再次点击当前值时清零' : 'Clicking the current value resets to 0', 'boolean', 'false'],
        ]}
      />
    </>
  );
}
