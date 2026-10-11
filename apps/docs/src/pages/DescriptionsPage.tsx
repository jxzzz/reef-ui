import { Descriptions, type DescriptionsItem } from '@reef-ui/components';
import { ApiTable, Demo, TypeBlock } from '../docs-ui';

const items: DescriptionsItem[] = [
  { key: 'name', label: '用户名', children: '张三' },
  { key: 'role', label: '角色', children: '管理员' },
  { key: 'email', label: '邮箱', children: 'zhang@example.com' },
  { key: 'city', label: '城市', children: '杭州' },
];

const basicCode = `const items: DescriptionsItem[] = [
  { key: 'name', label: '用户名', children: '张三' },
  { key: 'role', label: '角色', children: '管理员' },
  { key: 'email', label: '邮箱', children: 'zhang@example.com' },
  { key: 'city', label: '城市', children: '杭州' },
];
<Descriptions title="用户详情" items={items} />`;

const borderedCode = `<Descriptions bordered column={2} items={items} />`;

export function DescriptionsPage() {
  return (
    <>
      <h2>Descriptions 描述列表</h2>
      <p>成组展示只读字段，常用于详情页。</p>

      <Demo title="基础用法" code={basicCode}>
        <Descriptions title="用户详情" items={items} />
      </Demo>

      <Demo title="带边框两列" code={borderedCode}>
        <Descriptions bordered column={2} items={items} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '字段配置 { key, label, children }', 'DescriptionsItem[]', '必填'],
          ['column', '列数', 'number', '3'],
          ['bordered', '是否带边框', 'boolean', 'false'],
          ['title', '标题', 'ReactNode', '—'],
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
