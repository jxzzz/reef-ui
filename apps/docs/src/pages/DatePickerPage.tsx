import { DatePicker, DateRangePicker } from '@reef-ui/components';
import { ApiTable, Demo, TypeBlock } from '../docs-ui';

const disabledCode = `<DatePicker
  isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
/>`;

const rangeCode = `<DateRangePicker
  defaultValue={['2026-10-05', '2026-10-20']}
  onChange={(range) => console.log(range)}
/>`;

export function DatePickerPage() {
  return (
    <>
      <h2>DatePicker 日期选择</h2>
      <p>日历面板选择日期，值统一为 YYYY-MM-DD 字符串，与 Form 的 FormData 读取天然兼容。单选与 Range 共用同一套日历面板。</p>

      <Demo title="基础用法" code="<DatePicker onChange={(v) => console.log(v)} />">
        <DatePicker onChange={() => {}} />
      </Demo>

      <Demo title="禁用周末" code={disabledCode}>
        <DatePicker isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6} />
      </Demo>

      <Demo title="范围选择（两次点击，自动排序 start/end）" code={rangeCode}>
        <DateRangePicker defaultValue={['2026-10-05', '2026-10-20']} onChange={() => {}} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['value / defaultValue', '日期，YYYY-MM-DD 字符串（范围组件为 [start, end]）', 'DateString | DateRange', '—'],
          ['onChange', '选中回调，回传 YYYY-MM-DD', '(value) => void', '—'],
          ['isDisabled', '禁用日期（对所有月份生效）', '(date) => boolean', '—'],
          ['placeholder', '占位文字（Range 为 startPlaceholder / endPlaceholder）', 'string', '"请选择日期"'],
          ['invalid / disabled / block', '状态与布局', 'boolean', 'false'],
        ]}
      />

      <TypeBlock
        code={`type DateString = string; // 'YYYY-MM-DD'
type DateRange = [DateString | null, DateString | null];`}
      />
    </>
  );
}
