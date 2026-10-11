import { Timeline, type TimelineItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `const timelineItems: TimelineItem[] = [
  { key: 'a', content: '创建订单' },
  { key: 'b', content: '支付成功' },
  { key: 'c', content: '已发货' },
];
<Timeline items={timelineItems} />`,
  en: `const timelineItems: TimelineItem[] = [
  { key: 'a', content: 'Order created' },
  { key: 'b', content: 'Payment received' },
  { key: 'c', content: 'Shipped' },
];
<Timeline items={timelineItems} />`,
};

const dotCode: Record<Lang, string> = {
  zh: `<Timeline
  items={[
    { key: 'a', content: '关键节点', dot: <b>!</b> },
    { key: 'b', content: '普通节点' },
  ]}
/>`,
  en: `<Timeline
  items={[
    { key: 'a', content: 'Milestone', dot: <b>!</b> },
    { key: 'b', content: 'Regular node' },
  ]}
/>`,
};

export function TimelinePage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const timelineItems: TimelineItem[] = zh
    ? [
        { key: 'a', content: '创建订单' },
        { key: 'b', content: '支付成功' },
        { key: 'c', content: '已发货' },
      ]
    : [
        { key: 'a', content: 'Order created' },
        { key: 'b', content: 'Payment received' },
        { key: 'c', content: 'Shipped' },
      ];

  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Timeline 时间轴' : 'Timeline'}>
        {zh ? '垂直时间轴，按序展示一系列节点。' : 'A vertical timeline that displays a sequence of events in order.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Timeline items={timelineItems} />
      </Demo>

      <Demo title={zh ? '自定义节点' : 'Custom dot'} code={zh ? dotCode.zh : dotCode.en}>
        {zh ? (
          <Timeline
            items={[
              { key: 'a', content: '关键节点', dot: <b>!</b> },
              { key: 'b', content: '普通节点' },
            ]}
          />
        ) : (
          <Timeline
            items={[
              { key: 'a', content: 'Milestone', dot: <b>!</b> },
              { key: 'b', content: 'Regular node' },
            ]}
          />
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          [
            'items',
            zh ? '节点配置 { key?, content, dot? }，content 必填' : 'Node configuration { key?, content, dot? }, content is required',
            'TimelineItem[]',
            zh ? '必填' : 'Required',
          ],
          ['items[].dot', zh ? '自定义节点圆点' : 'Custom node dot', 'ReactNode', '—'],
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
