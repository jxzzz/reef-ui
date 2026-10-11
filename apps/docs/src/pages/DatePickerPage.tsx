import { DatePicker, DateRangePicker } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang } from '../i18n';

const disabledCode = `<DatePicker
  isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
/>`;

const rangeCode = `<DateRangePicker
  defaultValue={['2026-10-05', '2026-10-20']}
  onChange={(range) => console.log(range)}
/>`;

export function DatePickerPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'DatePicker 日期选择' : 'DatePicker'}>
        {zh ? '日历面板选择日期，值统一为 YYYY-MM-DD 字符串，与 Form 的 FormData 读取天然兼容。单选与 Range 共用同一套日历面板。' : 'Pick a date from a calendar panel. Values are always YYYY-MM-DD strings, naturally compatible with Form’s FormData reads. Single and Range pickers share the same calendar panel.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code="<DatePicker onChange={(v) => console.log(v)} />">
        <DatePicker onChange={() => {}} />
      </Demo>

      <Demo title={zh ? '禁用周末' : 'Disable weekends'} code={disabledCode}>
        <DatePicker isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6} />
      </Demo>

      <Demo title={zh ? '范围选择（两次点击，自动排序 start/end）' : 'Range selection (two clicks, start/end sorted automatically)'} code={rangeCode}>
        <DateRangePicker defaultValue={['2026-10-05', '2026-10-20']} onChange={() => {}} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['value / defaultValue', zh ? '日期，YYYY-MM-DD 字符串（范围组件为 [start, end]）' : 'Date as a YYYY-MM-DD string ([start, end] for the range component)', 'DateString | DateRange', '—'],
          ['onChange', zh ? '选中回调，回传 YYYY-MM-DD' : 'Selection callback; returns YYYY-MM-DD', '(value) => void', '—'],
          ['isDisabled', zh ? '禁用日期（对所有月份生效）' : 'Disable dates (applies to all months)', '(date) => boolean', '—'],
          ['placeholder', zh ? '占位文字（Range 为 startPlaceholder / endPlaceholder）' : 'Placeholder text (startPlaceholder / endPlaceholder for Range)', 'string', '"请选择日期"'],
          ['invalid / disabled / block', zh ? '状态与布局' : 'State and layout', 'boolean', 'false'],
        ]}
      />

      <TypeBlock
        code={`type DateString = string; // 'YYYY-MM-DD'
type DateRange = [DateString | null, DateString | null];`}
      />
    </>
  );
}
