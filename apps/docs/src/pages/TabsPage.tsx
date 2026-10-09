import { Tabs } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Tabs
  defaultActiveKey="order"
  items={[
    { key: 'order', label: '订单', children: <p>订单列表</p> },
    { key: 'refund', label: '退款', children: <p>退款列表</p> },
    { key: 'settings', label: '设置', children: <p>设置面板</p> },
  ]}
/>`;

export function TabsPage() {
  return (
    <>
      <h2>Tabs 标签页</h2>
      <p>内容分区切换，支持 ← → 键盘导航（ARIA tabs 模式）。</p>

      <Demo title="基础用法" code={basicCode}>
        <Tabs
          defaultActiveKey="order"
          items={[
            { key: 'order', label: '订单', children: <p>订单列表</p> },
            { key: 'refund', label: '退款', children: <p>退款列表</p> },
            { key: 'settings', label: '设置', children: <p>设置面板</p> },
          ]}
        />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '标签页配置', 'TabsItem[]', '必填'],
          ['activeKey / defaultActiveKey', '当前 key', 'string', '第一项'],
          ['onChange', '切换回调', '(key: string) => void', '—'],
        ]}
      />
    </>
  );
}
