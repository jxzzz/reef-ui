import { useState } from 'react';
import { Slider } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Slider defaultValue={30} />`,
  en: `<Slider defaultValue={30} />`,
};

const rangeCode: Record<Lang, string> = {
  zh: `const [temp, setTemp] = useState(26);

<Slider min={16} max={32} step={0.5} value={temp} onChange={setTemp} />
<p>当前温度：{temp}℃</p>`,
  en: `const [temp, setTemp] = useState(26);

<Slider min={16} max={32} step={0.5} value={temp} onChange={setTemp} />
<p>Current temperature: {temp}°C</p>`,
};

export function SliderPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [temp, setTemp] = useState(26);
  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Slider 滑动输入条' : 'Slider'}>
        {zh
          ? '基于原生 input[type=range] 的滑动输入条，键盘、触屏与 ARIA 开箱即用，轨道显示已填充进度。'
          : 'Slider built on the native input[type=range]: keyboard, touch and ARIA support for free, with a filled progress track.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Slider defaultValue={30} />
      </Demo>

      <Demo
        title={zh ? 'min / max / step（温度）' : 'min / max / step (temperature)'}
        code={zh ? rangeCode.zh : rangeCode.en}
      >
        <Slider min={16} max={32} step={0.5} value={temp} onChange={setTemp} />
        <p>{zh ? `当前温度：${temp}℃` : `Current temperature: ${temp}°C`}</p>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          [
            'value / defaultValue',
            zh
              ? '当前值；未传 defaultValue 时取 min'
              : 'Current value; falls back to min when defaultValue is unset',
            'number',
            '—',
          ],
          ['onChange', zh ? '值变化回调' : 'Value change callback', '(value: number) => void', '—'],
          [
            'min / max / step',
            zh ? '范围与步长' : 'Range and step',
            'number',
            zh ? '0 / 100 / 1' : '0 / 100 / 1',
          ],
          ['disabled', zh ? '禁用' : 'Disabled', 'boolean', 'false'],
        ]}
      />
      <p>
        {zh
          ? '其余属性透传原生 range input，支持 className、style、aria-label 等。'
          : 'All other props are passed through to the native range input, including className, style, aria-label, etc.'}
      </p>
    </>
  );
}
