import { Tag } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Tag>默认</Tag>
<Tag color="brand">进行中</Tag>
<Tag color="success">已完成</Tag>
<Tag color="warning">待审核</Tag>
<Tag color="danger">已失败</Tag>`;

const closableCode = `<Tag closable onClose={handleClose}>可关闭</Tag>`;

export function TagPage() {
  return (
    <>
      <h2>Tag 标签</h2>
      <p>标记状态与分类，支持五种预设色和关闭按钮。</p>

      <Demo title="五种预设色" code={basicCode}>
        <Tag>默认</Tag>
        <Tag color="brand">进行中</Tag>
        <Tag color="success">已完成</Tag>
        <Tag color="warning">待审核</Tag>
        <Tag color="danger">已失败</Tag>
      </Demo>

      <Demo title="可关闭" code={closableCode}>
        <Tag closable>可关闭</Tag>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['color', '预设色', "'neutral' | 'brand' | 'success' | 'warning' | 'danger'", "'neutral'"],
          ['closable', '显示关闭按钮', 'boolean', 'false'],
          ['onClose', '点击关闭回调', '(e) => void', '—'],
        ]}
      />
    </>
  );
}
