import { Button, Result } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const successCode: Record<Lang, string> = {
  zh: `<Result
  status="success"
  title="提交成功"
  subTitle="审核将在 1 个工作日内完成"
  extra={<Button>返回列表</Button>}
/>`,
  en: `<Result
  status="success"
  title="Submitted successfully"
  subTitle="Review will complete within 1 business day"
  extra={<Button>Back to list</Button>}
/>`,
};

const errorCode: Record<Lang, string> = {
  zh: `<Result status="error" title="提交失败" subTitle="网络异常，请稍后重试" />`,
  en: `<Result status="error" title="Submission failed" subTitle="Network error, please try again later" />`,
};

export function ResultPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="反馈" title={zh ? 'Result 结果页' : 'Result'}>
        {zh
          ? '操作结果的反馈页面，成功、失败、警告、提示四种状态。'
          : 'Feedback page for operation results, with four statuses: success, error, warning, and info.'}
      </ComponentHeader>

      <Demo title={zh ? '成功' : 'Success'} code={zh ? successCode.zh : successCode.en}>
        {zh ? (
          <Result
            status="success"
            title="提交成功"
            subTitle="审核将在 1 个工作日内完成"
            extra={<Button>返回列表</Button>}
          />
        ) : (
          <Result
            status="success"
            title="Submitted successfully"
            subTitle="Review will complete within 1 business day"
            extra={<Button>Back to list</Button>}
          />
        )}
      </Demo>

      <Demo title={zh ? '失败' : 'Error'} code={zh ? errorCode.zh : errorCode.en}>
        {zh ? (
          <Result status="error" title="提交失败" subTitle="网络异常，请稍后重试" />
        ) : (
          <Result status="error" title="Submission failed" subTitle="Network error, please try again later" />
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['status', zh ? '结果状态' : 'Result status', "'success' | 'error' | 'warning' | 'info'", "'info'"],
          ['icon', zh ? '覆盖默认图标' : 'Override the default icon', 'ReactNode', '—'],
          ['title', zh ? '标题' : 'Title', 'ReactNode', '—'],
          ['subTitle', zh ? '副标题' : 'Subtitle', 'ReactNode', '—'],
          ['extra', zh ? '操作区' : 'Action area', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
