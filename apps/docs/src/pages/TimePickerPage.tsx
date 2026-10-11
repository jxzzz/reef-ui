import { useState } from 'react';
import { TimePicker } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `const [time, setTime] = useState<string | null>(null);

<TimePicker value={time ?? undefined} onChange={setTime} />
<p>已选：{time ?? '未选择'}</p>`,
  en: `const [time, setTime] = useState<string | null>(null);

<TimePicker value={time ?? undefined} onChange={setTime} />
<p>Selected: {time ?? 'none'}</p>`,
};

const stepCode: Record<Lang, string> = {
  zh: `<TimePicker
  minuteStep={15}
  defaultValue="09:00:00"
  onChange={(v) => console.log(v)}
/>`,
  en: `<TimePicker
  minuteStep={15}
  defaultValue="09:00:00"
  onChange={(v) => console.log(v)}
/>`,
};

export function TimePickerPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [time, setTime] = useState<string | null>(null);
  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'TimePicker 时间选择器' : 'TimePicker'}>
        {zh
          ? '三列（时/分/秒）面板选择时间，值统一为 HH:mm:ss 字符串，三列都有值才回调 onChange。'
          : 'Pick a time from three columns (hour/minute/second). Values are always HH:mm:ss strings; onChange fires only when all three columns are set.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <TimePicker value={time ?? undefined} onChange={setTime} />
        <p>{zh ? `已选：${time ?? '未选择'}` : `Selected: ${time ?? 'none'}`}</p>
      </Demo>

      <Demo
        title={zh ? '会议时间段（minuteStep=15）' : 'Meeting slots (minuteStep=15)'}
        code={zh ? stepCode.zh : stepCode.en}
      >
        <TimePicker minuteStep={15} defaultValue="09:00:00" onChange={(v) => console.log(v)} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          [
            'value / defaultValue',
            zh
              ? "时间，'HH:mm:ss' 字符串（'' 或不传表示空）"
              : "Time as an 'HH:mm:ss' string ('' or omitted means empty)",
            'string',
            '—',
          ],
          [
            'onChange',
            zh
              ? "选中回传 'HH:mm:ss'，清空回传 null"
              : "Returns 'HH:mm:ss' on selection, null on clear",
            '(value: string | null) => void',
            '—',
          ],
          [
            'placeholder',
            zh ? '占位文字' : 'Placeholder text',
            'string',
            zh ? '"请选择时间"（随语言包）' : '"Select time" (locale)',
          ],
          ['disabled', zh ? '禁用' : 'Disabled', 'boolean', 'false'],
          [
            'minuteStep',
            zh ? '分钟列步进（仅影响分钟列）' : 'Step of the minute column (minute column only)',
            'number',
            '1',
          ],
        ]}
      />
    </>
  );
}
