import { Input } from '@reef-ui/components';
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

      <h3>API</h3>
      <ApiTable
        rows={[
          ['size', '尺寸', "'small' | 'medium' | 'large'", "'medium'"],
          ['invalid', '校验失败态，边框显示危险色', 'boolean', 'false'],
          ['block', '宽度撑满父容器', 'boolean', 'false'],
        ]}
      />
      <p>其余属性透传原生 input 元素，支持 type、placeholder、disabled、defaultValue、ref 等。</p>
    </>
  );
}
