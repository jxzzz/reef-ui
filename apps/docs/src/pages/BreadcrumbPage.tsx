import { Breadcrumb, type BreadcrumbItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const breadcrumbItems: Record<Lang, BreadcrumbItem[]> = {
  zh: [
    { key: 'home', title: '首页', href: '#/' },
    { key: 'list', title: '订单管理', href: '#/orders' },
    { key: 'detail', title: '订单详情' },
  ],
  en: [
    { key: 'home', title: 'Home', href: '#/' },
    { key: 'list', title: 'Orders', href: '#/orders' },
    { key: 'detail', title: 'Order detail' },
  ],
};

const basicCode: Record<Lang, string> = {
  zh: `const breadcrumbItems: BreadcrumbItem[] = [
  { key: 'home', title: '首页', href: '#/' },
  { key: 'list', title: '订单管理', href: '#/orders' },
  { key: 'detail', title: '订单详情' },
];
<Breadcrumb items={breadcrumbItems} />`,
  en: `const breadcrumbItems: BreadcrumbItem[] = [
  { key: 'home', title: 'Home', href: '#/' },
  { key: 'list', title: 'Orders', href: '#/orders' },
  { key: 'detail', title: 'Order detail' },
];
<Breadcrumb items={breadcrumbItems} />`,
};

export function BreadcrumbPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="导航" title={zh ? 'Breadcrumb 面包屑' : 'Breadcrumb'}>
        {zh ? '显示当前页面在层级结构中的位置，最后一项为当前页，分隔符由样式提供。' : 'Shows the position of the current page in the hierarchy. The last item is the current page; the separator is provided by styles.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Breadcrumb items={zh ? breadcrumbItems.zh : breadcrumbItems.en} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', zh ? '层级数据 { key?, title, href? }，最后一项为当前页，有 href 渲染为链接' : 'Hierarchy data { key?, title, href? }; the last item is the current page, items with href render as links', 'BreadcrumbItem[]', zh ? '必填' : 'Required'],
        ]}
      />

      <TypeBlock
        code={`interface BreadcrumbItem {
  key?: string;
  title: ReactNode;
  href?: string;
}`}
      />
    </>
  );
}
