import { Button, Empty } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';

const basicCode = `<Empty />`;

const actionCode = `<Empty description="没有匹配的订单">
  <Button variant="primary">新建订单</Button>
</Empty>`;

export function EmptyPage() {
  return (
    <>
      <ComponentHeader group="数据展示" title="Empty 空状态">
        列表或搜索结果为空时的占位提示，可附带操作入口。
      </ComponentHeader>

      <Demo title="基础用法" code={basicCode}>
        <Empty />
      </Demo>

      <Demo title="带操作" code={actionCode}>
        <Empty description="没有匹配的订单">
          <Button variant="primary">新建订单</Button>
        </Empty>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['description', '描述文案', 'ReactNode', "'暂无数据'"],
          ['children', '底部操作区', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
