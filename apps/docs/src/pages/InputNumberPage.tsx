import { InputNumber } from '@reef-ui/components';
import { useState } from 'react';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang } from '../i18n';

const clampCode = `<InputNumber defaultValue={5} min={0} max={10} step={2} />`;

const controlledCode = `const [v, setV] = useState<number | null>(5);\n<InputNumber value={v} onChange={setV} />`;

export function InputNumberPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [v, setV] = useState<number | null>(5);
  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'InputNumber 数字输入框' : 'InputNumber'}>
        {zh
          ? '仅允许数字的输入框：±步进（按钮与上下方向键）、失焦钳到 min/max、空值回传 null。'
          : 'Numeric-only input: ±stepping (buttons and arrow keys), clamped to min/max on blur, null when empty.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code="<InputNumber onChange={(v) => console.log(v)} />">
        <InputNumber onChange={() => {}} />
      </Demo>

      <Demo title={zh ? 'min / max / step（失焦钳位）' : 'min / max / step (clamped on blur)'} code={clampCode}>
        <InputNumber defaultValue={5} min={0} max={10} step={2} />
      </Demo>

      <Demo title={zh ? '受控' : 'Controlled'} code={controlledCode}>
        <InputNumber value={v} onChange={setV} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['value / defaultValue', zh ? '数字或 null（空）' : 'Number or null (empty)', 'number | null', '—'],
          ['onChange', zh ? '值变化回调；空值回传 null' : 'Value change callback; null when empty', '(value: number | null) => void', '—'],
          ['min / max / step', zh ? '范围与步长，失焦钳到边界' : 'Range and step, clamped to bounds on blur', 'number', zh ? 'step 默认 1' : 'step defaults to 1'],
          ['invalid / disabled / block / size', zh ? '状态与布局，同 Input' : 'State and layout, same as Input', '—', '—'],
        ]}
      />
    </>
  );
}
