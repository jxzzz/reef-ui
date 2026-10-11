import { Checkbox } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Checkbox defaultChecked>选中</Checkbox>
<Checkbox>未选中</Checkbox>
<Checkbox disabled>禁用</Checkbox>`,
  en: `<Checkbox defaultChecked>Checked</Checkbox>
<Checkbox>Unchecked</Checkbox>
<Checkbox disabled>Disabled</Checkbox>`,
};

const indeterminateCode: Record<Lang, string> = {
  zh: `const [all, setAll] = useState(false);

<Checkbox indeterminate={!all}>全选</Checkbox>`,
  en: `const [all, setAll] = useState(false);

<Checkbox indeterminate={!all}>Select all</Checkbox>`,
};

export function CheckboxPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Checkbox 复选框' : 'Checkbox'}>
        {zh ? '在一组选项中选择一个或多个。支持半选态，常用于父级全选场景。' : 'Selects one or more options from a set. Supports an indeterminate state, commonly used for a parent select-all.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <>
            <Checkbox defaultChecked>选中</Checkbox>
            <Checkbox>未选中</Checkbox>
            <Checkbox disabled>禁用</Checkbox>
          </>
        ) : (
          <>
            <Checkbox defaultChecked>Checked</Checkbox>
            <Checkbox>Unchecked</Checkbox>
            <Checkbox disabled>Disabled</Checkbox>
          </>
        )}
      </Demo>

      <Demo title={zh ? '半选态' : 'Indeterminate'} code={zh ? indeterminateCode.zh : indeterminateCode.en}>
        {zh ? <Checkbox indeterminate>全选</Checkbox> : <Checkbox indeterminate>Select all</Checkbox>}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['indeterminate', zh ? '半选态样式，仅控制样式' : 'Indeterminate style; presentation only', 'boolean', 'false'],
          ['block', zh ? '标签占满整行' : 'Label fills the whole row', 'boolean', 'false'],
        ]}
      />
      <p>{zh ? '其余属性透传原生 checkbox，支持 checked、defaultChecked、disabled、onChange、ref 等。' : 'All other props are passed through to the native checkbox element, including checked, defaultChecked, disabled, onChange, ref, etc.'}</p>
    </>
  );
}
