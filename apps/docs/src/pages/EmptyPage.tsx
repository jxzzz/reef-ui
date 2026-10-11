import { Button, Empty } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode = `<Empty />`;

const actionCode: Record<Lang, string> = {
  zh: `<Empty description="没有匹配的订单">
  <Button variant="primary">新建订单</Button>
</Empty>`,
  en: `<Empty description="No matching orders">
  <Button variant="primary">Create order</Button>
</Empty>`,
};

export function EmptyPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Empty 空状态' : 'Empty'}>
        {zh ? '列表或搜索结果为空时的占位提示，可附带操作入口。' : 'Placeholder shown when a list or search result is empty, with optional actions.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={basicCode}>
        <Empty />
      </Demo>

      <Demo title={zh ? '带操作' : 'With actions'} code={zh ? actionCode.zh : actionCode.en}>
        {zh ? (
          <Empty description="没有匹配的订单">
            <Button variant="primary">新建订单</Button>
          </Empty>
        ) : (
          <Empty description="No matching orders">
            <Button variant="primary">Create order</Button>
          </Empty>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['description', zh ? '描述文案' : 'Description text', 'ReactNode', zh ? '"暂无数据"（随语言包）' : '"No data" (locale)'],
          ['children', zh ? '底部操作区' : 'Footer action area', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
