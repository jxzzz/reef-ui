import { Table, Tag } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const users = [
  { id: 1, name: '张三', age: 28, city: '杭州', role: '管理员' },
  { id: 2, name: '李四', age: 35, city: '北京', role: '编辑' },
  { id: 3, name: '王五', age: 22, city: '上海', role: '访客' },
];

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄' },
  { key: 'city', title: '城市' },
  { key: 'role', title: '角色' },
];

const basicCode = `<Table columns={columns} dataSource={users} rowKey="id" />`;

const sorterCode = `<Table
  rowKey="id"
  columns={[
    { key: 'name', title: '姓名' },
    { key: 'age', title: '年龄', sorter: (a, b) => a.age - b.age },
  ]}
  dataSource={users}
/>`;

const renderCode = `<Table
  rowKey="id"
  columns={[
    { key: 'name', title: '姓名' },
    { key: 'role', title: '角色', render: (r) => <Tag color="brand">{r.role}</Tag> },
    { key: 'id', title: '操作', render: (r) => <a>编辑 {r.id}</a>, align: 'right' },
  ]}
  dataSource={users}
/>`;

export function TablePage() {
  return (
    <>
      <h2>Table 表格</h2>
      <p>行列结构化数据展示。v1 覆盖列配置、单元格渲染与排序；虚拟滚动、固定列后续按需增加。</p>

      <Demo title="基础用法" code={basicCode}>
        <Table columns={columns} dataSource={users} rowKey="id" />
      </Demo>

      <Demo title="排序（点击表头 asc ⇄ desc）" code={sorterCode}>
        <Table
          rowKey="id"
          columns={[
            { key: 'name', title: '姓名' },
            { key: 'age', title: '年龄', sorter: (a: (typeof users)[number], b: (typeof users)[number]) => a.age - b.age },
          ]}
          dataSource={users}
        />
      </Demo>

      <Demo title="render 自定义单元格" code={renderCode}>
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
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['columns', '列配置（key/title 必填，render 单元格，sorter 启用排序）', 'TableColumn[]', '必填'],
          ['dataSource', '数据源', 'T[]', '必填'],
          ['rowKey', '行 key（属性名或函数），缺省用下标', 'keyof T | (record, index) => string', '—'],
          ['empty', '空态内容', 'ReactNode', '"暂无数据"'],
        ]}
      />
    </>
  );
}
