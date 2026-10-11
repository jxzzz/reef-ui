import { InputNumber } from '@reef-ui/components';
import { useState } from 'react';
import { ApiTable, Demo } from '../docs-ui';

const clampCode = `<InputNumber defaultValue={5} min={0} max={10} step={2} />`;

export function InputNumberPage() {
  const [v, setV] = useState<number | null>(5);
  return (
    <>
      <h2>InputNumber 数字输入框</h2>
      <p>仅允许数字的输入框：±步进（按钮与上下方向键）、失焦钳到 min/max、空值回传 null。</p>

      <Demo title="基础用法" code="<InputNumber onChange={(v) => console.log(v)} />">
        <InputNumber onChange={() => {}} />
      </Demo>

      <Demo title="min / max / step（失焦钳位）" code={clampCode}>
        <InputNumber defaultValue={5} min={0} max={10} step={2} />
      </Demo>

      <Demo title="受控" code={`const [v, setV] = useState<number | null>(5);\n<InputNumber value={v} onChange={setV} />`}>
        <InputNumber value={v} onChange={setV} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['value / defaultValue', '数字或 null（空）', 'number | null', '—'],
          ['onChange', '值变化回调；空值回传 null', '(value: number | null) => void', '—'],
          ['min / max / step', '范围与步长，失焦钳到边界', 'number', 'step 默认 1'],
          ['invalid / disabled / block / size', '状态与布局，同 Input', '—', '—'],
        ]}
      />
    </>
  );
}
