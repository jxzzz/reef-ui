import { useState } from 'react';
import { Switch } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang } from '../i18n';

const basicCode = `const [on, setOn] = useState(false);

<Switch checked={on} onChange={setOn} />
<Switch checked={on} onChange={setOn} disabled />`;

export function SwitchPage() {
  const [on, setOn] = useState(false);
  const { lang } = useLang();
  const zh = lang === 'zh';

  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Switch 开关' : 'Switch'}>
        {zh
          ? '表示两种状态之间的切换，点击立即生效。基于 role="switch" 实现，键盘可访问。'
          : 'Toggles between two states, taking effect on click. Built on role="switch" with keyboard accessibility.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={basicCode}>
        <Switch checked={on} onChange={setOn} />
        <Switch onChange={setOn} disabled />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['checked', zh ? '是否开启' : 'Whether checked', 'boolean', 'false'],
          ['disabled', zh ? '禁用状态' : 'Disabled state', 'boolean', 'false'],
          ['onChange', zh ? '切换时回调 (checked, event)' : 'Callback on toggle (checked, event)', 'function', '-'],
        ]}
      />
    </>
  );
}
