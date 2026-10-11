import { Button, Checkbox, Form, FormItem, Input, Switch } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const verticalCode: Record<Lang, string> = {
  zh: `<Form onSubmit={(e) => e.preventDefault()}>
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
  <FormItem label="偏好" htmlFor="f-notice">
    <Checkbox id="f-notice">订阅更新通知</Checkbox>
  </FormItem>
  <FormItem>
    <Button type="submit">提交</Button>
  </FormItem>
</Form>`,
  en: `<Form onSubmit={(e) => e.preventDefault()}>
  <FormItem
    name="username"
    label="Username"
    required
    validate={(v) => {
      if (!v.trim()) return 'Please enter a username';
      if (v.length < 4) return 'Username must be at least 4 characters';
      return null;
    }}
    help="4-16 characters"
  >
    <Input placeholder="Enter a username" />
  </FormItem>
  <FormItem
    name="email"
    label="Email"
    required
    validate={(v) => {
      if (!v.trim()) return 'Please enter an email';
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v)) return 'Invalid email format';
      return null;
    }}
  >
    <Input type="email" placeholder="name@example.com" />
  </FormItem>
  <FormItem label="Preferences" htmlFor="f-notice">
    <Checkbox id="f-notice">Subscribe to update notifications</Checkbox>
  </FormItem>
  <FormItem>
    <Button type="submit">Submit</Button>
  </FormItem>
</Form>`,
};

const horizontalCode: Record<Lang, string> = {
  zh: `<Form layout="horizontal">
  <FormItem label="用户名" required>
    <Input placeholder="请输入用户名" />
  </FormItem>
  <FormItem label="邮箱">
    <Input type="email" placeholder="name@example.com" />
  </FormItem>
  <FormItem label="通知">
    <Switch />
  </FormItem>
</Form>`,
  en: `<Form layout="horizontal">
  <FormItem label="Username" required>
    <Input placeholder="Enter a username" />
  </FormItem>
  <FormItem label="Email">
    <Input type="email" placeholder="name@example.com" />
  </FormItem>
  <FormItem label="Notifications">
    <Switch />
  </FormItem>
</Form>`,
};

const errorCode: Record<Lang, string> = {
  zh: `// 提交时 Form 一次性校验所有字段，错误同时列出；
// 已报错的字段在输入时会即时重校验，改对立即消除错误。
<Form onSubmit={(e) => e.preventDefault()}>
  <FormItem
    name="demo-name"
    label="用户名"
    required
    validate={(v) => (v.length < 4 ? '用户名至少 4 个字符' : null)}
  >
    <Input placeholder="先提交触发错误，再输入试试" />
  </FormItem>
</Form>`,
  en: `// On submit, Form validates all fields at once and lists every error;
// fields with errors are re-validated as you type and clear as soon as they pass.
<Form onSubmit={(e) => e.preventDefault()}>
  <FormItem
    name="demo-name"
    label="Username"
    required
    validate={(v) => (v.length < 4 ? 'Username must be at least 4 characters' : null)}
  >
    <Input placeholder="Submit to trigger an error, then start typing" />
  </FormItem>
</Form>`,
};

const inlineCode: Record<Lang, string> = {
  zh: `<Form layout="inline">
  <FormItem label="关键词">
    <Input placeholder="搜索" />
  </FormItem>
  <Button>搜索</Button>
</Form>`,
  en: `<Form layout="inline">
  <FormItem label="Keyword">
    <Input placeholder="Search" />
  </FormItem>
  <Button>Search</Button>
</Form>`,
};

export function FormPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Form 表单' : 'Form'}>
        {zh ? (
          <>
            用 <code>Form</code> 承载表单布局，<code>FormItem</code> 负责标签、必填标记和校验错误展示。
            给 FormItem 传 <code>name</code> 和 <code>validate</code>，提交时 Form 会一次性校验全部字段，
            所有错误同时显示；已报错的字段在输入时即时重校验。
          </>
        ) : (
          <>
            Use <code>Form</code> for form layout; <code>FormItem</code> handles the label, required mark, and validation
            error display. Pass <code>name</code> and <code>validate</code> to a FormItem, and Form validates all fields at
            once on submit, showing every error together; fields with errors are re-validated as you type.
          </>
        )}
      </ComponentHeader>

      <Demo title={zh ? '垂直布局 + 校验' : 'Vertical layout + validation'} code={zh ? verticalCode.zh : verticalCode.en}>
        <Form style={{ maxWidth: 380 }} onSubmit={(e) => e.preventDefault()}>
          <FormItem
            name="username"
            label={zh ? '用户名' : 'Username'}
            required
            validate={
              zh
                ? (v) => {
                    if (!v.trim()) return '请输入用户名';
                    if (v.length < 4) return '用户名至少 4 个字符';
                    return null;
                  }
                : (v) => {
                    if (!v.trim()) return 'Please enter a username';
                    if (v.length < 4) return 'Username must be at least 4 characters';
                    return null;
                  }
            }
            help={zh ? '4-16 个字符' : '4-16 characters'}
          >
            <Input placeholder={zh ? '请输入用户名' : 'Enter a username'} />
          </FormItem>
          <FormItem
            name="email"
            label={zh ? '邮箱' : 'Email'}
            required
            validate={
              zh
                ? (v) => {
                    if (!v.trim()) return '请输入邮箱';
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return '邮箱格式不正确';
                    return null;
                  }
                : (v) => {
                    if (!v.trim()) return 'Please enter an email';
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Invalid email format';
                    return null;
                  }
            }
          >
            <Input type="email" placeholder="name@example.com" />
          </FormItem>
          <FormItem label={zh ? '偏好' : 'Preferences'} htmlFor="f-notice">
            <Checkbox id="f-notice">{zh ? '订阅更新通知' : 'Subscribe to update notifications'}</Checkbox>
          </FormItem>
          <FormItem>
            <Button type="submit">{zh ? '提交' : 'Submit'}</Button>
          </FormItem>
        </Form>
      </Demo>

      <Demo title={zh ? '水平布局' : 'Horizontal layout'} code={zh ? horizontalCode.zh : horizontalCode.en}>
        <Form layout="horizontal" style={{ maxWidth: 480 }}>
          <FormItem label={zh ? '用户名' : 'Username'} required>
            <Input placeholder={zh ? '请输入用户名' : 'Enter a username'} />
          </FormItem>
          <FormItem label={zh ? '邮箱' : 'Email'}>
            <Input type="email" placeholder="name@example.com" />
          </FormItem>
          <FormItem label={zh ? '通知' : 'Notifications'}>
            <Switch />
          </FormItem>
        </Form>
      </Demo>

      <Demo title={zh ? '即时重校验' : 'Live re-validation'} code={zh ? errorCode.zh : errorCode.en}>
        <Form style={{ maxWidth: 380 }} onSubmit={(e) => e.preventDefault()}>
          <FormItem
            name="demo-name"
            label={zh ? '用户名' : 'Username'}
            required
            validate={(v) => (v.length < 4 ? (zh ? '用户名至少 4 个字符' : 'Username must be at least 4 characters') : null)}
          >
            <Input placeholder={zh ? '先提交触发错误，再输入试试' : 'Submit to trigger an error, then start typing'} />
          </FormItem>
        </Form>
      </Demo>

      <Demo title={zh ? '行内布局' : 'Inline layout'} code={zh ? inlineCode.zh : inlineCode.en}>
        <Form layout="inline">
          <FormItem label={zh ? '关键词' : 'Keyword'}>
            <Input placeholder={zh ? '搜索' : 'Search'} />
          </FormItem>
          <Button>{zh ? '搜索' : 'Search'}</Button>
        </Form>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['Form.layout', zh ? '布局方向' : 'Layout direction', "'vertical' | 'horizontal' | 'inline'", "'vertical'"],
          ['FormItem.name', zh ? '字段名，作为表单值的 key' : 'Field name, used as the key in form values', 'string', '-'],
          ['FormItem.validate', zh ? '校验函数 (value, values) => 错误信息 | null' : 'Validation function (value, values) => error message | null', 'function', '-'],
          ['FormItem.label', zh ? '字段标签' : 'Field label', 'ReactNode', '-'],
          ['FormItem.htmlFor', zh ? '关联控件 id，点击标签聚焦' : 'Associated control id; clicking the label focuses it', 'string', '-'],
          ['FormItem.required', zh ? '标签前显示红色星号' : 'Show a red asterisk before the label', 'boolean', 'false'],
          ['FormItem.error', zh ? '手动指定错误信息，红色，优先于 help' : 'Manually set error message, shown in red, takes priority over help', 'ReactNode', '-'],
          ['FormItem.help', zh ? '辅助说明文字' : 'Helper text', 'ReactNode', '-'],
        ]}
      />
      <p>
        {zh ? (
          <>
            表单值从 DOM 读取（FormData），控件保持非受控即可。校验完全自定义，Form 内部已设
            <code> noValidate</code>，不会弹浏览器原生气泡。
          </>
        ) : (
          <>
            Form values are read from the DOM (FormData), so controls can stay uncontrolled. Validation is fully custom; Form
            sets <code> noValidate</code> internally, so the browser's native bubbles never appear.
          </>
        )}
      </p>
    </>
  );
}
