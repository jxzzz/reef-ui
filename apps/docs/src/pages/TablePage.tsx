import { Table, Tag, type TableColumn } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `const columns: TableColumn[] = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' },
  { key: 'city', title: '城市' },
  { key: 'role', title: '角色' },
];
const users = [
  { id: 1, name: '张三', age: 28, city: '杭州', role: '管理员' },
  { id: 2, name: '李四', age: 35, city: '北京', role: '编辑' },
  { id: 3, name: '王五', age: 22, city: '上海', role: '访客' },
];
<Table columns={columns} dataSource={users} rowKey="id" />`,
  en: `const columns: TableColumn[] = [
  { key: 'name', title: 'Name' },
  { key: 'age', title: 'Age' },
  { key: 'city', title: 'City' },
  { key: 'role', title: 'Role' },
];
const users = [
  { id: 1, name: 'John', age: 28, city: 'Hangzhou', role: 'Admin' },
  { id: 2, name: 'Jane', age: 35, city: 'Beijing', role: 'Editor' },
  { id: 3, name: 'Bob', age: 22, city: 'Shanghai', role: 'Viewer' },
];
<Table columns={columns} dataSource={users} rowKey="id" />`,
};

const sorterCode: Record<Lang, string> = {
  zh: `<Table
  rowKey="id"
  columns={[
    { key: 'name', title: '姓名' },
    { key: 'age', title: '年龄', sorter: (a, b) => a.age - b.age },
  ]}
  dataSource={users}
/>`,
  en: `<Table
  rowKey="id"
  columns={[
    { key: 'name', title: 'Name' },
    { key: 'age', title: 'Age', sorter: (a, b) => a.age - b.age },
  ]}
  dataSource={users}
/>`,
};

const renderCode: Record<Lang, string> = {
  zh: `<Table
  rowKey="id"
  columns={[
    { key: 'name', title: '姓名' },
    { key: 'role', title: '角色', render: (r) => <Tag color="brand">{r.role}</Tag> },
    { key: 'id', title: '操作', render: (r) => <a>编辑 {r.id}</a>, align: 'right' },
  ]}
  dataSource={users}
/>`,
  en: `<Table
  rowKey="id"
  columns={[
    { key: 'name', title: 'Name' },
    { key: 'role', title: 'Role', render: (r) => <Tag color="brand">{r.role}</Tag> },
    { key: 'id', title: 'Action', render: (r) => <a>Edit {r.id}</a>, align: 'right' },
  ]}
  dataSource={users}
/>`,
};

export function TablePage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const users = zh
    ? [
        { id: 1, name: '张三', age: 28, city: '杭州', role: '管理员' },
        { id: 2, name: '李四', age: 35, city: '北京', role: '编辑' },
        { id: 3, name: '王五', age: 22, city: '上海', role: '访客' },
      ]
    : [
        { id: 1, name: 'John', age: 28, city: 'Hangzhou', role: 'Admin' },
        { id: 2, name: 'Jane', age: 35, city: 'Beijing', role: 'Editor' },
        { id: 3, name: 'Bob', age: 22, city: 'Shanghai', role: 'Viewer' },
      ];
  const columns: TableColumn<(typeof users)[number]>[] = zh
    ? [
        { key: 'name', title: '姓名' },
        { key: 'age', title: '年龄' },
        { key: 'city', title: '城市' },
        { key: 'role', title: '角色' },
      ]
    : [
        { key: 'name', title: 'Name' },
        { key: 'age', title: 'Age' },
        { key: 'city', title: 'City' },
        { key: 'role', title: 'Role' },
      ];

  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Table 表格' : 'Table'}>
        {zh
          ? '行列结构化数据展示。v1 覆盖列配置、单元格渲染与排序；虚拟滚动、固定列后续按需增加。'
          : 'Displays structured data in rows and columns. v1 covers column configuration, cell rendering, and sorting; virtual scrolling and fixed columns may be added later as needed.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Table columns={columns} dataSource={users} rowKey="id" />
      </Demo>

      <Demo title={zh ? '排序（点击表头 asc ⇄ desc）' : 'Sorting (click header to toggle asc ⇄ desc)'} code={zh ? sorterCode.zh : sorterCode.en}>
        {zh ? (
          <Table
            rowKey="id"
            columns={[
              { key: 'name', title: '姓名' },
              { key: 'age', title: '年龄', sorter: (a: (typeof users)[number], b: (typeof users)[number]) => a.age - b.age },
            ]}
            dataSource={users}
          />
        ) : (
          <Table
            rowKey="id"
            columns={[
              { key: 'name', title: 'Name' },
              { key: 'age', title: 'Age', sorter: (a: (typeof users)[number], b: (typeof users)[number]) => a.age - b.age },
            ]}
            dataSource={users}
          />
        )}
      </Demo>

      <Demo title={zh ? 'render 自定义单元格' : 'Custom cells with render'} code={zh ? renderCode.zh : renderCode.en}>
        {zh ? (
          <Table
            rowKey="id"
            columns={[
              { key: 'name', title: '姓名' },
              { key: 'role', title: '角色', render: (r: (typeof users)[number]) => <Tag color="brand">{r.role}</Tag> },
              {
                key: 'id',
                title: '操作',
                align: 'right',
                render: (r: (typeof users)[number]) => <a href="#">编辑 {r.id}</a>,
              },
            ]}
            dataSource={users}
          />
        ) : (
          <Table
            rowKey="id"
            columns={[
              { key: 'name', title: 'Name' },
              { key: 'role', title: 'Role', render: (r: (typeof users)[number]) => <Tag color="brand">{r.role}</Tag> },
              {
                key: 'id',
                title: 'Action',
                align: 'right',
                render: (r: (typeof users)[number]) => <a href="#">Edit {r.id}</a>,
              },
            ]}
            dataSource={users}
          />
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          [
            'columns',
            zh ? '列配置 { key, title, width?, align?, ellipsis?, render?, sorter? }' : 'Column configuration { key, title, width?, align?, ellipsis?, render?, sorter? }',
            'TableColumn[]',
            zh ? '必填' : 'Required',
          ],
          ['dataSource', zh ? '数据源' : 'Data source', 'T[]', zh ? '必填' : 'Required'],
          ['rowKey', zh ? '行 key（属性名或函数），缺省用下标' : 'Row key (property name or function); falls back to the index', 'keyof T | (record, index) => string', '—'],
          ['empty', zh ? '空态内容' : 'Empty state content', 'ReactNode', '"暂无数据"'],
        ]}
      />

      <TypeBlock
        code={`interface TableColumn<T = Record<string, unknown>> {
  key: string;
  title: ReactNode;
  width?: number;
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  render?: (record: T, index: number) => ReactNode;
  sorter?: (a: T, b: T) => number;
}`}
      />
    </>
  );
}
