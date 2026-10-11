import { Alert } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const typesCode: Record<Lang, string> = {
  zh: `<Alert title="信息提示">这是一条信息提示。</Alert>
<Alert type="success" title="操作成功">数据已保存。</Alert>
<Alert type="warning" title="注意">配额即将用尽。</Alert>
<Alert type="error" title="操作失败">网络异常，请重试。</Alert>`,
  en: `<Alert title="Notice">This is an informational alert.</Alert>
<Alert type="success" title="Success">Data has been saved.</Alert>
<Alert type="warning" title="Warning">Quota is almost used up.</Alert>
<Alert type="error" title="Error">Network error, please retry.</Alert>`,
};

const closableCode: Record<Lang, string> = {
  zh: `<Alert type="success" title="操作成功" closable>
  数据已保存，点击 × 可关闭。
</Alert>`,
  en: `<Alert type="success" title="Success" closable>
  Data has been saved. Click × to dismiss.
</Alert>`,
};

export function AlertPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="反馈" title={zh ? 'Alert 警告提示' : 'Alert'}>
        {zh ? '展示需要用户关注的信息，四种语义类型，可关闭。' : 'Displays information that needs user attention, in four semantic types, dismissable.'}
      </ComponentHeader>

      <Demo title={zh ? '四种类型' : 'Four types'} code={zh ? typesCode.zh : typesCode.en}>
        {zh ? (
          <>
            <Alert title="信息提示">这是一条信息提示。</Alert>
            <Alert type="success" title="操作成功">数据已保存。</Alert>
            <Alert type="warning" title="注意">配额即将用尽。</Alert>
            <Alert type="error" title="操作失败">网络异常，请重试。</Alert>
          </>
        ) : (
          <>
            <Alert title="Notice">This is an informational alert.</Alert>
            <Alert type="success" title="Success">Data has been saved.</Alert>
            <Alert type="warning" title="Warning">Quota is almost used up.</Alert>
            <Alert type="error" title="Error">Network error, please retry.</Alert>
          </>
        )}
      </Demo>

      <Demo title={zh ? '可关闭' : 'Closable'} code={zh ? closableCode.zh : closableCode.en}>
        {zh ? (
          <Alert type="success" title="操作成功" closable>数据已保存，点击 × 可关闭。</Alert>
        ) : (
          <Alert type="success" title="Success" closable>Data has been saved. Click × to dismiss.</Alert>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['type', zh ? '语义类型' : 'Semantic type', "'info' | 'success' | 'warning' | 'error'", "'info'"],
          ['title', zh ? '标题' : 'Title', 'ReactNode', zh ? '必填' : 'Required'],
          ['closable', zh ? '显示关闭按钮' : 'Show close button', 'boolean', 'false'],
          ['onClose', zh ? '关闭回调' : 'Close callback', '() => void', '—'],
        ]}
      />
    </>
  );
}
