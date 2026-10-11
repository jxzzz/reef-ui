import { Card } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Card
  title="订单概览"
  extra={<a href="#card">更多</a>}
  footer="共 128 条记录"
>
  卡片内容区。
</Card>`,
  en: `<Card
  title="Order overview"
  extra={<a href="#card">More</a>}
  footer="128 records in total"
>
  Card content.
</Card>`,
};

export function CardPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Card 卡片' : 'Card'}>
        {zh ? '承载标题、内容与操作的容器，常用于仪表盘信息分组。' : 'A container for a title, content, and actions. Commonly used to group information on dashboards.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <Card title="订单概览" extra={<a href="#card">更多</a>} footer="共 128 条记录">
            卡片内容区。
          </Card>
        ) : (
          <Card title="Order overview" extra={<a href="#card">More</a>} footer="128 records in total">
            Card content.
          </Card>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['title', zh ? '标题' : 'Title', 'ReactNode', '—'],
          ['extra', zh ? '标题右侧操作区' : 'Action area on the right of the title', 'ReactNode', '—'],
          ['footer', zh ? '底部区域' : 'Footer area', 'ReactNode', '—'],
          ['bordered', zh ? '是否带边框' : 'Whether to show a border', 'boolean', 'true'],
          ['hoverable', zh ? '悬停浮起' : 'Lift on hover', 'boolean', 'false'],
        ]}
      />
    </>
  );
}
