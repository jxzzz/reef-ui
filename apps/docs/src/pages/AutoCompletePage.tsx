import { useState } from 'react';
import { AutoComplete } from '@reef-ui/components';
import type { AutoCompleteOption } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const cityOptionsCode = {
  zh: `const cities = ['北京', '上海', '广州', '深圳', '杭州'];`,
  en: `const cities = ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hangzhou'];`,
};

const basicCode: Record<Lang, string> = {
  zh: `${cityOptionsCode.zh}
const [city, setCity] = useState('');
<AutoComplete options={cities} value={city} onChange={setCity} placeholder="输入城市" />
<span>当前值：{city || '-'}</span>`,
  en: `${cityOptionsCode.en}
const [city, setCity] = useState('');
<AutoComplete options={cities} value={city} onChange={setCity} placeholder="Type a city" />
<span>Current: {city || '-'}</span>`,
};

const objectCode: Record<Lang, string> = {
  zh: `const cityOptions = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
];
<AutoComplete options={cityOptions} placeholder="label 展示，value 回调" />`,
  en: `const cityOptions = [
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Guangzhou', value: 'guangzhou' },
];
<AutoComplete options={cityOptions} placeholder="Shows label, callback gets value" />`,
};

const noFilterCode: Record<Lang, string> = {
  zh: `${cityOptionsCode.zh}
<AutoComplete options={cities} filter={false} placeholder="不过滤，输入即展示全部" />`,
  en: `${cityOptionsCode.en}
<AutoComplete options={cities} filter={false} placeholder="No filtering, show all on typing" />`,
};

const disabledCode: Record<Lang, string> = {
  zh: `${cityOptionsCode.zh}
<AutoComplete options={cities} defaultValue="上海" disabled />`,
  en: `${cityOptionsCode.en}
<AutoComplete options={cities} defaultValue="Shanghai" disabled />`,
};

export function AutoCompletePage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [city, setCity] = useState('');

  const cities = zh ? ['北京', '上海', '广州', '深圳', '杭州'] : ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hangzhou'];

  const cityOptions: AutoCompleteOption[] = zh
    ? [
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
      ]
    : [
        { label: 'Beijing', value: 'beijing' },
        { label: 'Shanghai', value: 'shanghai' },
        { label: 'Guangzhou', value: 'guangzhou' },
      ];

  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'AutoComplete 自动完成' : 'AutoComplete'}>
        {zh ? (
          <>
            输入框与实时过滤的建议面板。输入即按 label 大小写不敏感过滤并展示匹配项，
            上下键移动高亮，Enter 选中，Esc 或点击外部关闭；复用 Input 作为文本域。
          </>
        ) : (
          <>
            A text input with a live-filtered suggestion panel. Typing filters options
            case-insensitively by label; arrow keys move the highlight, Enter selects, Esc or
            outside click closes. Reuses Input for the text field.
          </>
        )}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <>
          <AutoComplete options={cities} value={city} onChange={setCity} placeholder={zh ? '输入城市' : 'Type a city'} />
          <span>{city || '-'}</span>
        </>
      </Demo>

      <Demo title={zh ? '对象选项' : 'Object options'} code={zh ? objectCode.zh : objectCode.en}>
        <AutoComplete options={cityOptions} placeholder={zh ? 'label 展示，value 回调' : 'Shows label, callback gets value'} />
      </Demo>

      <Demo title={zh ? '关闭过滤' : 'Disable filtering'} code={zh ? noFilterCode.zh : noFilterCode.en}>
        <AutoComplete options={cities} filter={false} placeholder={zh ? '不过滤，输入即展示全部' : 'No filtering, show all on typing'} />
      </Demo>

      <Demo title={zh ? '禁用' : 'Disabled'} code={zh ? disabledCode.zh : disabledCode.en}>
        <AutoComplete options={cities} defaultValue={zh ? '上海' : 'Shanghai'} disabled />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['options', zh ? '选项数组，字符串或 { label, value }' : 'Array of string or { label, value }', 'AutoCompleteOption[]', '-'],
          ['value', zh ? '当前值（受控）' : 'Current value (controlled)', 'string', '-'],
          ['defaultValue', zh ? '默认值（非受控）' : 'Default value (uncontrolled)', 'string', "''"],
          ['onChange', zh ? '输入与选中均触发，参数为输入框内容' : 'Fires on typing and selecting, argument is the input value', '(value: string) => void', '-'],
          ['placeholder', zh ? '占位文字' : 'Placeholder text', 'string', '-'],
          ['disabled', zh ? '禁用输入框' : 'Disable the input', 'boolean', 'false'],
          ['filter', zh ? '输入时按 label 大小写不敏感过滤；false 展示全部' : 'Filter options case-insensitively by label while typing; false shows all', 'boolean', 'true'],
        ]}
      />

      <TypeBlock
        code={`type AutoCompleteOption = string | { label: string; value: string };`}
      />
    </>
  );
}
