import { useState } from 'react';
import { Switch } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';

const basicCode = `const [on, setOn] = useState(false);

<Switch checked={on} onChange={setOn} />
<Switch checked={on} onChange={setOn} disabled />`;

export function SwitchPage() {
  const [on, setOn] = useState(false);

  return (
    <>
      <ComponentHeader group="数据录入" title="Switch 开关">
        表示两种状态之间的切换，点击立即生效。基于 role="switch" 实现，键盘可访问。
      </ComponentHeader>

      <Demo title="基础用法" code={basicCode}>
        <Switch checked={on} onChange={setOn} />
        <Switch onChange={setOn} disabled />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['checked', '是否开启', 'boolean', 'false'],
          ['disabled', '禁用状态', 'boolean', 'false'],
          ['onChange', '切换时回调 (checked, event)', 'function', '-'],
        ]}
      />
    </>
  );
}
