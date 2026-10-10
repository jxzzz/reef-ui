import { Timeline } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Timeline
  items={[
    { key: 'a', content: '创建订单' },
    { key: 'b', content: '支付成功' },
    { key: 'c', content: '已发货' },
  ]}
/>`;

const dotCode = `<Timeline
  items={[
    { key: 'a', content: '关键节点', dot: <b>!</b> },
    { key: 'b', content: '普通节点' },
  ]}
/>`;

export function TimelinePage() {
  return (
    <>
      <h2>Timeline 时间轴</h2>
      <p>垂直时间轴，按序展示一系列节点。</p>

      <Demo title="基础用法" code={basicCode}>
        <Timeline
          items={[
            { key: 'a', content: '创建订单' },
            { key: 'b', content: '支付成功' },
            { key: 'c', content: '已发货' },
          ]}
        />
      </Demo>

      <Demo title="自定义节点" code={dotCode}>
        <Timeline
          items={[
            { key: 'a', content: '关键节点', dot: <b>!</b> },
            { key: 'b', content: '普通节点' },
          ]}
        />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '节点配置（content 必填）', 'TimelineItem[]', '必填'],
          ['items[].dot', '自定义节点圆点', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
