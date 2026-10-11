import { Icon, Input } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Input placeholder="请输入内容" />
<Input defaultValue="默认值" />
<Input disabled placeholder="禁用状态" />`,
  en: `<Input placeholder="Enter something" />
<Input defaultValue="Default value" />
<Input disabled placeholder="Disabled" />`,
};

const sizeCode = `<Input size="small" placeholder="Small" />
<Input size="medium" placeholder="Medium" />
<Input size="large" placeholder="Large" />`;

const invalidCode: Record<Lang, string> = {
  zh: `<Input invalid placeholder="校验失败" />
<Input block placeholder="占满整行" />`,
  en: `<Input invalid placeholder="Validation failed" />
<Input block placeholder="Full width" />`,
};

const passwordCode: Record<Lang, string> = {
  zh: `<Input type="password" placeholder="密码" />
<Input type="number" placeholder="年龄" />`,
  en: `<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Age" />`,
};

const clearableCode: Record<Lang, string> = {
  zh: `<Input clearable defaultValue="可清空" />
<Input clearable placeholder="输入后出现清空按钮" />`,
  en: `<Input clearable defaultValue="Clearable" />
<Input clearable placeholder="Clear button appears once you type" />`,
};

const affixCode: Record<Lang, string> = {
  zh: `<Input clearable block placeholder="搜索" prefix={<Icon name="search" size={14} />} />
<Input block defaultValue="100" suffix="元" />`,
  en: `<Input clearable block placeholder="Search" prefix={<Icon name="search" size={14} />} />
<Input block defaultValue="100" suffix="CNY" />`,
};

export function InputPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Input 输入框' : 'Input'}>
        {zh
          ? '通过键盘输入内容的基础表单控件。支持 3 种尺寸、校验失败态和全部原生 input 类型。'
          : 'A basic form control for keyboard input. Supports 3 sizes, an invalid state, and all native input types.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Input placeholder={zh ? '请输入内容' : 'Enter something'} />
        <Input defaultValue={zh ? '默认值' : 'Default value'} />
        <Input disabled placeholder={zh ? '禁用状态' : 'Disabled'} />
      </Demo>

      <Demo title={zh ? '尺寸' : 'Sizes'} code={sizeCode}>
        <Input size="small" placeholder="Small" />
        <Input size="medium" placeholder="Medium" />
        <Input size="large" placeholder="Large" />
      </Demo>

      <Demo title={zh ? '校验失败与整行' : 'Invalid and full width'} code={zh ? invalidCode.zh : invalidCode.en}>
        <Input invalid placeholder={zh ? '校验失败' : 'Validation failed'} />
        <Input block placeholder={zh ? '占满整行' : 'Full width'} />
      </Demo>

      <Demo title={zh ? '原生类型' : 'Native types'} code={zh ? passwordCode.zh : passwordCode.en}>
        <Input type="password" placeholder={zh ? '密码' : 'Password'} />
        <Input type="number" placeholder={zh ? '年龄' : 'Age'} />
      </Demo>

      <Demo title={zh ? '可清空' : 'Clearable'} code={zh ? clearableCode.zh : clearableCode.en}>
        <Input clearable defaultValue={zh ? '可清空' : 'Clearable'} />
        <Input clearable placeholder={zh ? '输入后出现清空按钮' : 'Clear button appears once you type'} />
      </Demo>

      <Demo title={zh ? '前缀与后缀' : 'Prefix and suffix'} code={zh ? affixCode.zh : affixCode.en}>
        <div style={{ width: '100%' }}>
          <Input clearable block placeholder={zh ? '搜索' : 'Search'} prefix={<Icon name="search" size={14} />} />
        </div>
        <div style={{ width: '100%' }}>
          <Input block defaultValue="100" suffix={zh ? '元' : 'CNY'} />
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['size', zh ? '尺寸' : 'Size', "'small' | 'medium' | 'large'", "'medium'"],
          ['invalid', zh ? '校验失败态，边框显示危险色' : 'Invalid state, renders the border in danger color', 'boolean', 'false'],
          ['block', zh ? '宽度撑满父容器' : 'Stretch to fill the parent container', 'boolean', 'false'],
          ['clearable', zh ? '有内容时显示清空按钮，点击清空并触发 onChange' : 'Show a clear button when there is content; clicking clears and fires onChange', 'boolean', 'false'],
          ['prefix', zh ? '前缀内容（图标、单位等）' : 'Prefix content (icon, unit, etc.)', 'ReactNode', '—'],
          ['suffix', zh ? '后缀内容（图标、单位等）' : 'Suffix content (icon, unit, etc.)', 'ReactNode', '—'],
        ]}
      />
      <p>
        {zh
          ? '其余属性透传原生 input 元素，支持 type、placeholder、disabled、defaultValue、ref 等。'
          : 'All other props are passed through to the native input element, including type, placeholder, disabled, defaultValue, ref, and more.'}
      </p>
    </>
  );
}
