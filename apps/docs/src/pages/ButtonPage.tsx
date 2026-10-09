import { useState } from 'react';
import { Button, Icon } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`;

const sizeCode = `<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>`;

const loadingCode = `const [loading, setLoading] = useState(false);

<Button loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>
  提交
</Button>`;

const iconCode = `<Button icon={<Icon name="search" />}>搜索</Button>
<Button variant="outline" icon={<Icon name="plus" />} aria-label="添加" />`;

export function ButtonPage() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <h2>Button 按钮</h2>
      <p>用于触发即时操作。支持 5 种类型、3 种尺寸、加载状态和图标。</p>

      <Demo title="类型" code={basicCode}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </Demo>

      <Demo title="尺寸" code={sizeCode}>
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
      </Demo>

      <Demo title="加载中" code={loadingCode}>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        >
          提交
        </Button>
      </Demo>

      <Demo title="图标" code={iconCode}>
        <Button icon={<Icon name="search" />}>搜索</Button>
        <Button variant="outline" icon={<Icon name="plus" />} aria-label="添加" />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['variant', '按钮类型', "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", "'primary'"],
          ['size', '按钮尺寸', "'small' | 'medium' | 'large'", "'medium'"],
          ['loading', '加载状态，期间禁止点击并显示 spinner', 'boolean', 'false'],
          ['block', '宽度撑满父容器', 'boolean', 'false'],
          ['icon', '左侧图标', 'ReactNode', '-'],
        ]}
      />
      <p>其余属性透传原生 button 元素，支持 disabled、type、ref 等。</p>
    </>
  );
}
