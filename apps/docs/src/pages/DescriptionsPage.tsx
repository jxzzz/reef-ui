import { Descriptions, type DescriptionsItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const items: DescriptionsItem[] = [
  { key: 'name', label: '用户名', children: '张三' },
  { key: 'role', label: '角色', children: '管理员' },
  { key: 'email', label: '邮箱', children: 'zhang@example.com' },
  { key: 'city', label: '城市', children: '杭州' },
];

const enItems: DescriptionsItem[] = [
  { key: 'name', label: 'Username', children: 'Zhang San' },
  { key: 'role', label: 'Role', children: 'Admin' },
  { key: 'email', label: 'Email', children: 'zhang@example.com' },
  { key: 'city', label: 'City', children: 'Hangzhou' },
];

const basicCode: Record<Lang, string> = {
  zh: `const items: DescriptionsItem[] = [
  { key: 'name', label: '用户名', children: '张三' },
  { key: 'role', label: '角色', children: '管理员' },
  { key: 'email', label: '邮箱', children: 'zhang@example.com' },
  { key: 'city', label: '城市', children: '杭州' },
];
<Descriptions title="用户详情" items={items} />`,
  en: `const items: DescriptionsItem[] = [
  { key: 'name', label: 'Username', children: 'Zhang San' },
  { key: 'role', label: 'Role', children: 'Admin' },
  { key: 'email', label: 'Email', children: 'zhang@example.com' },
  { key: 'city', label: 'City', children: 'Hangzhou' },
];
<Descriptions title="User details" items={items} />`,
};

const borderedCode: Record<Lang, string> = {
  zh: `const items: DescriptionsItem[] = [
  { key: 'name', label: '用户名', children: '张三' },
  { key: 'role', label: '角色', children: '管理员' },
  { key: 'email', label: '邮箱', children: 'zhang@example.com' },
  { key: 'city', label: '城市', children: '杭州' },
];
<Descriptions bordered column={2} items={items} />`,
  en: `const items: DescriptionsItem[] = [
  { key: 'name', label: 'Username', children: 'Zhang San' },
  { key: 'role', label: 'Role', children: 'Admin' },
  { key: 'email', label: 'Email', children: 'zhang@example.com' },
  { key: 'city', label: 'City', children: 'Hangzhou' },
];
<Descriptions bordered column={2} items={items} />`,
};

export function DescriptionsPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Descriptions 描述列表' : 'Descriptions'}>
        {zh ? '成组展示只读字段，常用于详情页。' : 'Displays read-only fields in groups, commonly used on detail pages.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Descriptions title={zh ? '用户详情' : 'User details'} items={zh ? items : enItems} />
      </Demo>

      <Demo title={zh ? '带边框两列' : 'Bordered two columns'} code={zh ? borderedCode.zh : borderedCode.en}>
        <Descriptions bordered column={2} items={zh ? items : enItems} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', zh ? '字段配置 { key, label, children }' : 'Field config { key, label, children }', 'DescriptionsItem[]', zh ? '必填' : 'Required'],
          ['column', zh ? '列数' : 'Number of columns', 'number', '3'],
          ['bordered', zh ? '是否带边框' : 'Whether to show borders', 'boolean', 'false'],
          ['title', zh ? '标题' : 'Title', 'ReactNode', '—'],
        ]}
      />

      <TypeBlock
        code={`interface DescriptionsItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
}`}
      />
    </>
  );
}
