import { Alert } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const typesCode = `<Alert title="信息提示">这是一条信息提示。</Alert>
<Alert type="success" title="操作成功">数据已保存。</Alert>
<Alert type="warning" title="注意">配额即将用尽。</Alert>
<Alert type="error" title="操作失败">网络异常，请重试。</Alert>`;

const closableCode = `<Alert type="success" title="操作成功" closable onClose={() => {}}>
  数据已保存，点击 × 可关闭。
</Alert>`;

export function AlertPage() {
  return (
    <>
      <h2>Alert 警告提示</h2>
      <p>展示需要用户关注的信息，四种语义类型，可关闭。</p>

      <Demo title="四种类型" code={typesCode}>
        <Alert title="信息提示">这是一条信息提示。</Alert>
        <Alert type="success" title="操作成功">数据已保存。</Alert>
        <Alert type="warning" title="注意">配额即将用尽。</Alert>
        <Alert type="error" title="操作失败">网络异常，请重试。</Alert>
      </Demo>

      <Demo title="可关闭" code={closableCode}>
        <Alert type="success" title="操作成功" closable>数据已保存，点击 × 可关闭。</Alert>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['type', '语义类型', "'info' | 'success' | 'warning' | 'error'", "'info'"],
          ['title', '标题', 'ReactNode', '必填'],
          ['closable', '显示关闭按钮', 'boolean', 'false'],
          ['onClose', '关闭回调', '() => void', '—'],
        ]}
      />
    </>
  );
}
