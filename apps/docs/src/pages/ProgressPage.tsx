import { Progress } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Progress percent={60} />
<Progress percent={80} status="success" />
<Progress percent={30} status="error" />`;

const smallCode = `<Progress percent={60} size="small" showInfo={false} />`;

const circleCode = `<Progress type="circle" percent={60} />
<Progress type="circle" percent={80} status="success" />
<Progress type="circle" percent={30} size="small" status="error" />`;

export function ProgressPage() {
  return (
    <>
      <h2>Progress 进度条</h2>
      <p>展示任务或上传的处理进度，percent 自动钳制到 0-100。</p>

      <Demo title="基础用法" code={basicCode}>
        <Progress percent={60} />
        <Progress percent={80} status="success" />
        <Progress percent={30} status="error" />
      </Demo>

      <Demo title="小型无文本" code={smallCode}>
        <Progress percent={60} size="small" showInfo={false} />
      </Demo>

      <Demo title="圆环" code={circleCode}>
        <Progress type="circle" percent={60} />
        <Progress type="circle" percent={80} status="success" />
        <Progress type="circle" percent={30} size="small" status="error" />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['percent', '进度（0-100，越界钳制）', 'number', '必填'],
          ['type', '形态：条形 / 圆环', "'line' | 'circle'", "'line'"],
          ['size', '条形为粗细，圆环为直径（small 64 / medium 96）', "'small' | 'medium'", "'medium'"],
          ['status', '状态色', "'normal' | 'success' | 'error'", "'normal'"],
          ['showInfo', '显示百分比文本', 'boolean', 'true'],
        ]}
      />
    </>
  );
}
