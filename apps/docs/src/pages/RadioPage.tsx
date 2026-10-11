import { Radio, RadioGroup } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<RadioGroup name="city" defaultValue="hz">
  <Radio value="hz">杭州</Radio>
  <Radio value="sh">上海</Radio>
  <Radio value="sz" disabled>深圳（禁用）</Radio>
</RadioGroup>`,
  en: `<RadioGroup name="city" defaultValue="hz">
  <Radio value="hz">Hangzhou</Radio>
  <Radio value="sh">Shanghai</Radio>
  <Radio value="sz" disabled>Shenzhen (disabled)</Radio>
</RadioGroup>`,
};

export function RadioPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Radio 单选框' : 'Radio'}>
        {zh ? '在一组互斥选项中选择一个，配合 RadioGroup 使用。' : 'Select one from a set of mutually exclusive options, used with RadioGroup.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <RadioGroup name="city" defaultValue="hz">
            <Radio value="hz">杭州</Radio>
            <Radio value="sh">上海</Radio>
            <Radio value="sz" disabled>深圳（禁用）</Radio>
          </RadioGroup>
        ) : (
          <RadioGroup name="city" defaultValue="hz">
            <Radio value="hz">Hangzhou</Radio>
            <Radio value="sh">Shanghai</Radio>
            <Radio value="sz" disabled>Shenzhen (disabled)</Radio>
          </RadioGroup>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['name', zh ? '注入子 Radio 的原生 name' : 'Native name passed to child radios', 'string', zh ? '必填' : 'Required'],
          ['value / defaultValue', zh ? '选中值' : 'Selected value', 'string', '—'],
          ['onChange', zh ? '选中变化回调' : 'Selection change callback', '(value: string) => void', '—'],
          ['disabled', zh ? '整组禁用（Radio 上也可单独设置）' : 'Disable the whole group (can also be set per Radio)', 'boolean', 'false'],
        ]}
      />
    </>
  );
}
