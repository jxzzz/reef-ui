import { Pagination } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang } from '../i18n';

const basicCode = `<Pagination total={100} defaultCurrent={1} onChange={(page) => console.log(page)} />`;

const moreCode = `<Pagination total={200} defaultCurrent={10} />`;

export function PaginationPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="导航" title={zh ? 'Pagination 分页' : 'Pagination'}>
        {zh ? '长列表分页导航，页数多时自动折叠为省略号。' : 'Pagination for long lists, automatically collapsing into ellipses when there are many pages.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={basicCode}>
        <Pagination total={100} />
      </Demo>

      <Demo title={zh ? '页数较多' : 'More pages'} code={moreCode}>
        <Pagination total={200} defaultCurrent={10} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['total', zh ? '数据总条数' : 'Total number of items', 'number', zh ? '必填' : 'Required'],
          ['pageSize', zh ? '每页条数' : 'Items per page', 'number', '10'],
          ['current / defaultCurrent', zh ? '当前页' : 'Current page', 'number', '1'],
          ['onChange', zh ? '页码变化回调' : 'Page change callback', '(page: number) => void', '—'],
        ]}
      />
    </>
  );
}
