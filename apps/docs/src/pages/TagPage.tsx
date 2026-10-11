import { Tag } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Tag>默认</Tag>
<Tag color="brand">进行中</Tag>
<Tag color="success">已完成</Tag>
<Tag color="warning">待审核</Tag>
<Tag color="danger">已失败</Tag>`,
  en: `<Tag>Default</Tag>
<Tag color="brand">In progress</Tag>
<Tag color="success">Completed</Tag>
<Tag color="warning">Pending review</Tag>
<Tag color="danger">Failed</Tag>`,
};

const closableCode: Record<Lang, string> = {
  zh: `<Tag closable>可关闭</Tag>`,
  en: `<Tag closable>Closable</Tag>`,
};

export function TagPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Tag 标签' : 'Tag'}>
        {zh ? '标记状态与分类，支持五种预设色和关闭按钮。' : 'Marks status and categories, with five preset colors and an optional close button.'}
      </ComponentHeader>

      <Demo title={zh ? '五种预设色' : 'Five preset colors'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <>
            <Tag>默认</Tag>
            <Tag color="brand">进行中</Tag>
            <Tag color="success">已完成</Tag>
            <Tag color="warning">待审核</Tag>
            <Tag color="danger">已失败</Tag>
          </>
        ) : (
          <>
            <Tag>Default</Tag>
            <Tag color="brand">In progress</Tag>
            <Tag color="success">Completed</Tag>
            <Tag color="warning">Pending review</Tag>
            <Tag color="danger">Failed</Tag>
          </>
        )}
      </Demo>

      <Demo title={zh ? '可关闭' : 'Closable'} code={zh ? closableCode.zh : closableCode.en}>
        {zh ? <Tag closable>可关闭</Tag> : <Tag closable>Closable</Tag>}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['color', zh ? '预设色' : 'Preset color', "'neutral' | 'brand' | 'success' | 'warning' | 'danger'", "'neutral'"],
          ['closable', zh ? '显示关闭按钮' : 'Show close button', 'boolean', 'false'],
          ['onClose', zh ? '点击关闭回调' : 'Close click callback', '(e) => void', '—'],
        ]}
      />
    </>
  );
}
