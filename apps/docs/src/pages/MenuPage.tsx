import { useState } from 'react';
import { Button, Icon, Menu, type IconName, type MenuItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

function makeItems(withIcon: boolean, zh: boolean): MenuItem[] {
  const t = (z: string, e: string) => (zh ? z : e);
  const icon = (name: IconName) => (withIcon ? <Icon name={name} size={16} /> : undefined);
  return [
    { key: 'home', label: t('首页', 'Home'), icon: icon('home') },
    {
      key: 'orders',
      label: t('订单管理', 'Orders'),
      icon: icon('folder'),
      children: [
        { key: 'order-list', label: t('订单列表', 'Order list') },
        { key: 'order-refund', label: t('退款管理', 'Refunds') },
      ],
    },
    { key: 'exit', label: t('退出登录', 'Sign out'), icon: icon('log-out'), danger: true },
    {
      key: 'settings-group',
      type: 'group',
      label: t('设置', 'Settings'),
      children: [{ key: 'profile', label: t('个人资料', 'Profile') }],
    },
  ];
}

const basicCode: Record<Lang, string> = {
  zh: `const items: MenuItem[] = [
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
<Menu defaultSelectedKey="home" items={items} />`,
  en: `const items: MenuItem[] = [
  { key: 'home', label: 'Home', icon: <Icon name="home" size={16} /> },
  {
    key: 'orders',
    label: 'Orders',
    icon: <Icon name="folder" size={16} />,
    children: [
      { key: 'order-list', label: 'Order list' },
      { key: 'order-refund', label: 'Refunds' },
    ],
  },
  { key: 'exit', label: 'Sign out', danger: true },
  {
    key: 'settings-group',
    type: 'group',
    label: 'Settings',
    children: [{ key: 'profile', label: 'Profile' }],
  },
];
<Menu defaultSelectedKey="home" items={items} />`,
};

const controlledCode = `<Menu items={items} selectedKey={current} onChange={setCurrent} />`;

const horizontalCode = `<Menu mode="horizontal" items={items} />`;

const collapsedCode: Record<Lang, string> = {
  zh: `const [collapsed, setCollapsed] = useState(false);
<Button onClick={() => setCollapsed(!collapsed)}>{collapsed ? '展开' : '收起'}</Button>
<Menu items={items} collapsed={collapsed} />`,
  en: `const [collapsed, setCollapsed] = useState(false);
<Button onClick={() => setCollapsed(!collapsed)}>{collapsed ? 'Expand' : 'Collapse'}</Button>
<Menu items={items} collapsed={collapsed} />`,
};

export function MenuPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [current, setCurrent] = useState('home');
  const [collapsed, setCollapsed] = useState(false);
  const items = makeItems(true, zh);
  const plainItems = makeItems(false, zh);
  return (
    <>
      <ComponentHeader group="导航" title={zh ? 'Menu 导航菜单' : 'Menu'}>
        {zh ? (
          <>
            侧边或顶部导航。vertical 模式子菜单内联展开；horizontal 模式子菜单弹出；
            collapsed 把垂直菜单收成图标窄条（分组降级为分隔线）。弹出面板为 CSS 定位，
            与 Select 同策略，溢出容器内会被裁剪。
          </>
        ) : (
          <>
            Side or top navigation. In vertical mode submenus expand inline; in horizontal mode they open as popovers.
            collapsed turns the vertical menu into a narrow icon strip (groups degrade to separators). Popover panels are CSS-positioned,
            same strategy as Select, and are clipped inside overflow containers.
          </>
        )}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Menu defaultSelectedKey="home" items={items} />
      </Demo>

      <Demo title={zh ? '受控用法' : 'Controlled'} code={controlledCode}>
        <Menu items={items} selectedKey={current} onChange={setCurrent} />
      </Demo>

      <Demo title={zh ? '收起窄条' : 'Collapsed'} code={zh ? collapsedCode.zh : collapsedCode.en}>
        <div>
          <p style={{ marginBottom: 12 }}>
            <Button onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? (zh ? '展开' : 'Expand') : (zh ? '收起' : 'Collapse')}
            </Button>
          </p>
          <Menu items={plainItems} collapsed={collapsed} />
        </div>
      </Demo>

      <Demo title={zh ? '水平模式' : 'Horizontal mode'} code={horizontalCode}>
        <Menu mode="horizontal" items={items} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', zh ? '菜单配置 { key, label, icon?, danger?, type?, children? }' : 'Menu items { key, label, icon?, danger?, type?, children? }', 'MenuItem[]', zh ? '必填' : 'Required'],
          ['mode', zh ? '模式' : 'Mode', "'vertical' | 'horizontal'", "'vertical'"],
          ['selectedKey / defaultSelectedKey', zh ? '当前选中 key' : 'Currently selected key', 'string', '—'],
          ['onChange', zh ? '选中回调' : 'Selection callback', '(key: string) => void', '—'],
          ['collapsed', zh ? '收起为图标窄条（仅 vertical），子菜单与完整名称 hover 弹出' : 'Collapse into a narrow icon strip (vertical only); submenus and full labels appear on hover', 'boolean', 'false'],
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
