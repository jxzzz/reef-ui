import { Breadcrumb } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Breadcrumb
  items={[
    { key: 'home', title: '首页', href: '#/' },
    { key: 'list', title: '订单管理', href: '#/orders' },
    { key: 'detail', title: '订单详情' },
  ]}
/>`;

export function BreadcrumbPage() {
  return (
    <>
      <h2>Breadcrumb 面包屑</h2>
      <p>显示当前页面在层级结构中的位置，最后一项为当前页，分隔符由样式提供。</p>

      <Demo title="基础用法" code={basicCode}>
        <Breadcrumb
          items={[
            { key: 'home', title: '首页', href: '#/' },
            { key: 'list', title: '订单管理', href: '#/orders' },
            { key: 'detail', title: '订单详情' },
          ]}
        />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '层级数据，最后一项为当前页', "{ key?: string; title: ReactNode; href?: string }[]", '必填'],
        ]}
      />
    </>
  );
}
