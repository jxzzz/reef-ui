import { Button, Checkbox, Form, FormItem, Input, Switch } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const verticalCode = `<Form onSubmit={(e) => e.preventDefault()}>
  <FormItem
    name="username"
    label="用户名"
    required
    validate={(v) => {
      if (!v.trim()) return '请输入用户名';
      if (v.length < 4) return '用户名至少 4 个字符';
      return null;
    }}
    help="4-16 个字符"
  >
    <Input placeholder="请输入用户名" />
  </FormItem>
  <FormItem
    name="email"
    label="邮箱"
    required
    validate={(v) => {
      if (!v.trim()) return '请输入邮箱';
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v)) return '邮箱格式不正确';
      return null;
    }}
  >
    <Input type="email" placeholder="name@example.com" />
  </FormItem>
  <FormItem label="备注">
    <Input name="remark" placeholder="选填" />
  </FormItem>
  <FormItem>
    <Button type="submit">提交</Button>
  </FormItem>
</Form>`;

const horizontalCode = `<Form layout="horizontal">
  <FormItem label="用户名" required>
    <Input placeholder="请输入用户名" />
  </FormItem>
  <FormItem label="邮箱">
    <Input type="email" placeholder="name@example.com" />
  </FormItem>
</Form>`;

const errorCode = `// 提交时 Form 一次性校验所有字段，错误同时列出；
// 已报错的字段在输入时会即时重校验，改对立即消除错误。
<FormItem
  name="username"
  label="用户名"
  required
  validate={(v) => (v.length < 4 ? '用户名至少 4 个字符' : null)}
>
  <Input value={name} onChange={(e) => setName(e.target.value)} />
</FormItem>`;

const inlineCode = `<Form layout="inline">
  <FormItem label="关键词">
    <Input placeholder="搜索" />
  </FormItem>
  <Button>搜索</Button>
</Form>`;

export function FormPage() {
  return (
    <>
      <h2>Form 表单</h2>
      <p>
        用 <code>Form</code> 承载表单布局，<code>FormItem</code> 负责标签、必填标记和校验错误展示。
        给 FormItem 传 <code>name</code> 和 <code>validate</code>，提交时 Form 会一次性校验全部字段，
        所有错误同时显示；已报错的字段在输入时即时重校验。
      </p>

      <Demo title="垂直布局 + 校验" code={verticalCode}>
        <Form style={{ maxWidth: 380 }} onSubmit={(e) => e.preventDefault()}>
          <FormItem
            name="username"
            label="用户名"
            required
            validate={(v) => {
              if (!v.trim()) return '请输入用户名';
              if (v.length < 4) return '用户名至少 4 个字符';
              return null;
            }}
            help="4-16 个字符"
          >
            <Input placeholder="请输入用户名" />
          </FormItem>
          <FormItem
            name="email"
            label="邮箱"
            required
            validate={(v) => {
              if (!v.trim()) return '请输入邮箱';
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return '邮箱格式不正确';
              return null;
            }}
          >
            <Input type="email" placeholder="name@example.com" />
          </FormItem>
          <FormItem label="偏好" htmlFor="f-notice">
            <Checkbox id="f-notice">订阅更新通知</Checkbox>
          </FormItem>
          <FormItem>
            <Button type="submit">提交</Button>
          </FormItem>
        </Form>
      </Demo>

      <Demo title="水平布局" code={horizontalCode}>
        <Form layout="horizontal" style={{ maxWidth: 480 }}>
          <FormItem label="用户名" required>
            <Input placeholder="请输入用户名" />
          </FormItem>
          <FormItem label="邮箱">
            <Input type="email" placeholder="name@example.com" />
          </FormItem>
          <FormItem label="通知">
            <Switch />
          </FormItem>
        </Form>
      </Demo>

      <Demo title="即时重校验" code={errorCode}>
        <Form style={{ maxWidth: 380 }} onSubmit={(e) => e.preventDefault()}>
          <FormItem
            name="demo-name"
            label="用户名"
            required
            validate={(v) => (v.length < 4 ? '用户名至少 4 个字符' : null)}
          >
            <Input placeholder="先提交触发错误，再输入试试" />
          </FormItem>
        </Form>
      </Demo>

      <Demo title="行内布局" code={inlineCode}>
        <Form layout="inline">
          <FormItem label="关键词">
            <Input placeholder="搜索" />
          </FormItem>
          <Button>搜索</Button>
        </Form>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['Form.layout', '布局方向', "'vertical' | 'horizontal' | 'inline'", "'vertical'"],
          ['FormItem.name', '字段名，作为表单值的 key', 'string', '-'],
          ['FormItem.validate', '校验函数 (value, values) => 错误信息 | null', 'function', '-'],
          ['FormItem.label', '字段标签', 'ReactNode', '-'],
          ['FormItem.htmlFor', '关联控件 id，点击标签聚焦', 'string', '-'],
          ['FormItem.required', '标签前显示红色星号', 'boolean', 'false'],
          ['FormItem.error', '手动指定错误信息，红色，优先于 help', 'ReactNode', '-'],
          ['FormItem.help', '辅助说明文字', 'ReactNode', '-'],
        ]}
      />
      <p>
        表单值从 DOM 读取（FormData），控件保持非受控即可。校验完全自定义，Form 内部已设
        <code> noValidate</code>，不会弹浏览器原生气泡。
      </p>
    </>
  );
}
