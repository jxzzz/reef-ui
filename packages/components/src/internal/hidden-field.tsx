/**
 * 受控组件的原生取值桥：渲染隐藏 input，让 FormData（以及读 FormData 的 Form 校验）
 * 看得见 Select / DatePicker 这类无原生表单元素的组件的值。
 *
 * 不传 name 时什么都不渲染，组件 DOM 与之前完全一致。
 * 数组值渲染多个同名 input，FormData.getAll(name) 拿回完整数组；
 * 空数组也渲染一个空值 input，否则字段在 FormData 里缺席，required 会误判为已填。
 */
export function HiddenField({ name, value }: { name?: string; value: string | string[] }) {
  if (!name) return null;
  const list = Array.isArray(value) ? value : [value];
  const fields = list.length > 0 ? list : [''];
  return (
    <>
      {fields.map((v, i) => (
        <input key={`${i}-${v}`} type="hidden" name={name} value={v} />
      ))}
    </>
  );
}
