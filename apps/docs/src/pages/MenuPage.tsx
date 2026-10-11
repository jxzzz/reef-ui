import { useState } from 'react';
import { Button, Icon, Menu, type MenuItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';

const items: MenuItem[] = [
  { key: 'home', label: '首页', icon: <Icon name="home" size={16} /> },
  {
    key: 'orders',
    label: '订单管理',
    icon: <Icon name="folder" size={16} />,
    children: [
      { key: 'order-list', label: '订单列表' },
      { key: 'order-refund', label: '退款管理' },
    ],
  },
  { key: 'exit', label: '退出登录', icon: <Icon name="log-out" size={16} />, danger: true },
  {
    key: 'settings-group',
    type: 'group',
    label: '设置',
    children: [{ key: 'profile', label: '个人资料' }],
  },
];

const plainItems: MenuItem[] = [
  { key: 'home', label: '首页' },
  {
    key: 'orders',
    label: '订单管理',
    children: [
      { key: 'order-list', label: '订单列表' },
      { key: 'order-refund', label: '退款管理' },
    ],
  },
  { key: 'exit', label: '退出登录', danger: true },
  {
    key: 'settings-group',
    type: 'group',
    label: '设置',
    children: [{ key: 'profile', label: '个人资料' }],
  },
];

const basicCode = `const items: MenuItem[] = [
  { key: 'home', label: '首页', icon: <Icon name="home" size={16} /> },
  {
    key: 'orders',
    label: '订单管理',
    icon: <Icon name="folder" size={16} />,
    children: [
      { key: 'order-list', label: '订单列表' },
      { key: 'order-refund', label: '退款管理' },
    ],
  },
  { key: 'exit', label: '退出登录', danger: true },
  {
    key: 'settings-group',
    type: 'group',
    label: '设置',
    children: [{ key: 'profile', label: '个人资料' }],
  },
];
<Menu defaultSelectedKey="home" items={items} />`;

const controlledCode = `<Menu items={items} selectedKey={current} onChange={setCurrent} />`;

const horizontalCode = `<Menu mode="horizontal" items={items} />`;

const collapsedCode = `const [collapsed, setCollapsed] = useState(false);
<Button onClick={() => setCollapsed(!collapsed)}>{collapsed ? '展开' : '收起'}</Button>
<Menu items={items} collapsed={collapsed} />`;

export function MenuPage() {
  const [current, setCurrent] = useState('home');
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <ComponentHeader group="导航" title="Menu 导航菜单">
        侧边或顶部导航。vertical 模式子菜单内联展开；horizontal 模式子菜单弹出；
        collapsed 把垂直菜单收成图标窄条（分组降级为分隔线）。弹出面板为 CSS 定位，
        与 Select 同策略，溢出容器内会被裁剪。
      </ComponentHeader>

      <Demo title="基础用法" code={basicCode}>
        <Menu defaultSelectedKey="home" items={items} />
      </Demo>

      <Demo title="受控用法" code={controlledCode}>
        <Menu items={items} selectedKey={current} onChange={setCurrent} />
      </Demo>

      <Demo title="收起窄条" code={collapsedCode}>
        <div>
          <p style={{ marginBottom: 12 }}>
            <Button onClick={() => setCollapsed(!collapsed)}>{collapsed ? '展开' : '收起'}</Button>
          </p>
          <Menu items={plainItems} collapsed={collapsed} />
        </div>
      </Demo>

      <Demo title="水平模式" code={horizontalCode}>
        <Menu mode="horizontal" items={items} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '菜单配置 { key, label, icon?, danger?, type?, children? }', 'MenuItem[]', '必填'],
          ['mode', '模式', "'vertical' | 'horizontal'", "'vertical'"],
          ['selectedKey / defaultSelectedKey', '当前选中 key', 'string', '—'],
          ['onChange', '选中回调', '(key: string) => void', '—'],
          ['collapsed', '收起为图标窄条（仅 vertical），子菜单与完整名称 hover 弹出', 'boolean', 'false'],
        ]}
      />

      <TypeBlock
        code={`interface MenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  type?: 'group';
  children?: MenuItem[];
}`}
      />
    </>
  );
}
