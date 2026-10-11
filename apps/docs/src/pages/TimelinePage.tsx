import { Timeline, type TimelineItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';

const timelineItems: TimelineItem[] = [
  { key: 'a', content: '创建订单' },
  { key: 'b', content: '支付成功' },
  { key: 'c', content: '已发货' },
];

const basicCode = `const timelineItems: TimelineItem[] = [
  { key: 'a', content: '创建订单' },
  { key: 'b', content: '支付成功' },
  { key: 'c', content: '已发货' },
];
<Timeline items={timelineItems} />`;

const dotCode = `<Timeline
  items={[
    { key: 'a', content: '关键节点', dot: <b>!</b> },
    { key: 'b', content: '普通节点' },
  ]}
/>`;

export function TimelinePage() {
  return (
    <>
      <ComponentHeader group="数据展示" title="Timeline 时间轴">
        垂直时间轴，按序展示一系列节点。
      </ComponentHeader>

      <Demo title="基础用法" code={basicCode}>
        <Timeline items={timelineItems} />
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
          ['items', '节点配置 { key?, content, dot? }，content 必填', 'TimelineItem[]', '必填'],
          ['items[].dot', '自定义节点圆点', 'ReactNode', '—'],
        ]}
      />

      <TypeBlock
        code={`interface TimelineItem {
  key?: string;
  content: ReactNode;
  dot?: ReactNode;
}`}
      />
    </>
  );
}
