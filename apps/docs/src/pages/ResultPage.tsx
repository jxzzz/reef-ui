import { Button, Result } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const successCode = `<Result
  status="success"
  title="提交成功"
  subTitle="审核将在 1 个工作日内完成"
  extra={<Button>返回列表</Button>}
/>`;

const errorCode = `<Result status="error" title="提交失败" subTitle="网络异常，请稍后重试" />`;

export function ResultPage() {
  return (
    <>
      <h2>Result 结果页</h2>
      <p>操作结果的反馈页面，成功、失败、警告、提示四种状态。</p>

      <Demo title="成功" code={successCode}>
        <Result
          status="success"
          title="提交成功"
          subTitle="审核将在 1 个工作日内完成"
          extra={<Button>返回列表</Button>}
        />
      </Demo>

      <Demo title="失败" code={errorCode}>
        <Result status="error" title="提交失败" subTitle="网络异常，请稍后重试" />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['status', '结果状态', "'success' | 'error' | 'warning' | 'info'", "'info'"],
          ['icon', '覆盖默认图标', 'ReactNode', '—'],
          ['title', '标题', 'ReactNode', '—'],
          ['subTitle', '副标题', 'ReactNode', '—'],
          ['extra', '操作区', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
