import { Pagination } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';

const basicCode = `<Pagination total={100} defaultCurrent={1} onChange={(page) => console.log(page)} />`;

const moreCode = `<Pagination total={200} defaultCurrent={10} />`;

export function PaginationPage() {
  return (
    <>
      <ComponentHeader group="导航" title="Pagination 分页">
        长列表分页导航，页数多时自动折叠为省略号。
      </ComponentHeader>

      <Demo title="基础用法" code={basicCode}>
        <Pagination total={100} />
      </Demo>

      <Demo title="页数较多" code={moreCode}>
        <Pagination total={200} defaultCurrent={10} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['total', '数据总条数', 'number', '必填'],
          ['pageSize', '每页条数', 'number', '10'],
          ['current / defaultCurrent', '当前页', 'number', '1'],
          ['onChange', '页码变化回调', '(page: number) => void', '—'],
        ]}
      />
    </>
  );
}
