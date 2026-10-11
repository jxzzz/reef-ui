import { Tabs, type TabsItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `const tabItems: TabsItem[] = [
  { key: 'order', label: '订单', children: <p>订单列表</p> },
  { key: 'refund', label: '退款', children: <p>退款列表</p> },
  { key: 'settings', label: '设置', children: <p>设置面板</p> },
];
<Tabs defaultActiveKey="order" items={tabItems} />`,
  en: `const tabItems: TabsItem[] = [
  { key: 'order', label: 'Orders', children: <p>Order list</p> },
  { key: 'refund', label: 'Refunds', children: <p>Refund list</p> },
  { key: 'settings', label: 'Settings', children: <p>Settings panel</p> },
];
<Tabs defaultActiveKey="order" items={tabItems} />`,
};

export function TabsPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const tabItems: TabsItem[] = zh
    ? [
        { key: 'order', label: '订单', children: <p>订单列表</p> },
        { key: 'refund', label: '退款', children: <p>退款列表</p> },
        { key: 'settings', label: '设置', children: <p>设置面板</p> },
      ]
    : [
        { key: 'order', label: 'Orders', children: <p>Order list</p> },
        { key: 'refund', label: 'Refunds', children: <p>Refund list</p> },
        { key: 'settings', label: 'Settings', children: <p>Settings panel</p> },
      ];

  return (
    <>
      <ComponentHeader group="导航" title={zh ? 'Tabs 标签页' : 'Tabs'}>
        {zh ? '内容分区切换，支持 ← → 键盘导航（ARIA tabs 模式）。' : 'Switches between content sections, with ← → keyboard navigation (ARIA tabs pattern).'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Tabs defaultActiveKey="order" items={tabItems} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', zh ? '标签页配置 { key, label, children }' : 'Tab configuration { key, label, children }', 'TabsItem[]', zh ? '必填' : 'Required'],
          ['activeKey / defaultActiveKey', zh ? '当前 key' : 'Current key', 'string', zh ? '第一项' : 'First item'],
          ['onChange', zh ? '切换回调' : 'Callback on tab change', '(key: string) => void', '—'],
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
