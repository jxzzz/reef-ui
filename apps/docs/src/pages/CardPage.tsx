import { Card } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Card
  title="订单概览"
  extra={<a href="#card">更多</a>}
  footer="共 128 条记录"
>
  卡片内容区。
</Card>`;

export function CardPage() {
  return (
    <>
      <h2>Card 卡片</h2>
      <p>承载标题、内容与操作的容器，常用于仪表盘信息分组。</p>

      <Demo title="基础用法" code={basicCode}>
        <Card title="订单概览" extra={<a href="#card">更多</a>} footer="共 128 条记录">
          卡片内容区。
        </Card>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['title', '标题', 'ReactNode', '—'],
          ['extra', '标题右侧操作区', 'ReactNode', '—'],
          ['footer', '底部区域', 'ReactNode', '—'],
          ['bordered', '是否带边框', 'boolean', 'true'],
          ['hoverable', '悬停浮起', 'boolean', 'false'],
        ]}
      />
    </>
  );
}
