import { Radio, RadioGroup } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';

const basicCode = `<RadioGroup name="city" defaultValue="hz">
  <Radio value="hz">杭州</Radio>
  <Radio value="sh">上海</Radio>
  <Radio value="sz" disabled>深圳（禁用）</Radio>
</RadioGroup>`;

export function RadioPage() {
  return (
    <>
      <ComponentHeader group="数据录入" title="Radio 单选框">
        在一组互斥选项中选择一个，配合 RadioGroup 使用。
      </ComponentHeader>

      <Demo title="基础用法" code={basicCode}>
        <RadioGroup name="city" defaultValue="hz">
          <Radio value="hz">杭州</Radio>
          <Radio value="sh">上海</Radio>
          <Radio value="sz" disabled>深圳（禁用）</Radio>
        </RadioGroup>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['name', '注入子 Radio 的原生 name', 'string', '必填'],
          ['value / defaultValue', '选中值', 'string', '—'],
          ['onChange', '选中变化回调', '(value: string) => void', '—'],
          ['disabled', '整组禁用（Radio 上也可单独设置）', 'boolean', 'false'],
        ]}
      />
    </>
  );
}
