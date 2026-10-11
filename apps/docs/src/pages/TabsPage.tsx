import { Tabs, type TabsItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';

const tabItems: TabsItem[] = [
  { key: 'order', label: '订单', children: <p>订单列表</p> },
  { key: 'refund', label: '退款', children: <p>退款列表</p> },
  { key: 'settings', label: '设置', children: <p>设置面板</p> },
];

const basicCode = `const tabItems: TabsItem[] = [
  { key: 'order', label: '订单', children: <p>订单列表</p> },
  { key: 'refund', label: '退款', children: <p>退款列表</p> },
  { key: 'settings', label: '设置', children: <p>设置面板</p> },
];
<Tabs defaultActiveKey="order" items={tabItems} />`;

export function TabsPage() {
  return (
    <>
      <ComponentHeader group="导航" title="Tabs 标签页">
        内容分区切换，支持 ← → 键盘导航（ARIA tabs 模式）。
      </ComponentHeader>

      <Demo title="基础用法" code={basicCode}>
        <Tabs defaultActiveKey="order" items={tabItems} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '标签页配置 { key, label, children }', 'TabsItem[]', '必填'],
          ['activeKey / defaultActiveKey', '当前 key', 'string', '第一项'],
          ['onChange', '切换回调', '(key: string) => void', '—'],
        ]}
      />

      <TypeBlock
        code={`interface TabsItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
}`}
      />
    </>
  );
}
