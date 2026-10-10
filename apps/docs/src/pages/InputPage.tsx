import { Icon, Input } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Input placeholder="请输入内容" />
<Input defaultValue="默认值" />
<Input disabled placeholder="禁用状态" />`;

const sizeCode = `<Input size="small" placeholder="Small" />
<Input size="medium" placeholder="Medium" />
<Input size="large" placeholder="Large" />`;

const invalidCode = `<Input invalid placeholder="校验失败" />
<Input block placeholder="占满整行" />`;

const passwordCode = `<Input type="password" placeholder="密码" />
<Input type="number" placeholder="年龄" />`;

const clearableCode = `<Input clearable defaultValue="可清空" />
<Input clearable placeholder="输入后出现清空按钮" />`;

const affixCode = `<Input clearable block placeholder="搜索" prefix={<Icon name="search" size={14} />} />
<Input block defaultValue="100" suffix="元" />`;

export function InputPage() {
  return (
    <>
      <h2>Input 输入框</h2>
      <p>通过键盘输入内容的基础表单控件。支持 3 种尺寸、校验失败态和全部原生 input 类型。</p>

      <Demo title="基础用法" code={basicCode}>
        <Input placeholder="请输入内容" />
        <Input defaultValue="默认值" />
        <Input disabled placeholder="禁用状态" />
      </Demo>

      <Demo title="尺寸" code={sizeCode}>
        <Input size="small" placeholder="Small" />
        <Input size="medium" placeholder="Medium" />
        <Input size="large" placeholder="Large" />
      </Demo>

      <Demo title="校验失败与整行" code={invalidCode}>
        <Input invalid placeholder="校验失败" />
        <Input block placeholder="占满整行" />
      </Demo>

      <Demo title="原生类型" code={passwordCode}>
        <Input type="password" placeholder="密码" />
        <Input type="number" placeholder="年龄" />
      </Demo>

      <Demo title="可清空" code={clearableCode}>
        <Input clearable defaultValue="可清空" />
        <Input clearable placeholder="输入后出现清空按钮" />
      </Demo>

      <Demo title="前缀与后缀" code={affixCode}>
        <div style={{ width: '100%' }}>
          <Input clearable block placeholder="搜索" prefix={<Icon name="search" size={14} />} />
        </div>
        <div style={{ width: '100%' }}>
          <Input block defaultValue="100" suffix="元" />
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['size', '尺寸', "'small' | 'medium' | 'large'", "'medium'"],
          ['invalid', '校验失败态，边框显示危险色', 'boolean', 'false'],
          ['block', '宽度撑满父容器', 'boolean', 'false'],
          ['clearable', '有内容时显示清空按钮，点击清空并触发 onChange', 'boolean', 'false'],
          ['prefix', '前缀内容（图标、单位等）', 'ReactNode', '—'],
          ['suffix', '后缀内容（图标、单位等）', 'ReactNode', '—'],
        ]}
      />
      <p>其余属性透传原生 input 元素，支持 type、placeholder、disabled、defaultValue、ref 等。</p>
    </>
  );
}
