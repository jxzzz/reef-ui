import { Progress } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang } from '../i18n';

const basicCode = `<Progress percent={60} />
<Progress percent={80} status="success" />
<Progress percent={30} status="error" />`;

const smallCode = `<Progress percent={60} size="small" showInfo={false} />`;

const circleCode = `<Progress type="circle" percent={60} />
<Progress type="circle" percent={80} status="success" />
<Progress type="circle" percent={30} size="small" status="error" />`;

export function ProgressPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="反馈" title={zh ? 'Progress 进度条' : 'Progress'}>
        {zh ? '展示任务或上传的处理进度，percent 自动钳制到 0-100。' : 'Shows the progress of a task or upload; percent is clamped to 0-100.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={basicCode}>
        <Progress percent={60} />
        <Progress percent={80} status="success" />
        <Progress percent={30} status="error" />
      </Demo>

      <Demo title={zh ? '小型无文本' : 'Small without text'} code={smallCode}>
        <Progress percent={60} size="small" showInfo={false} />
      </Demo>

      <Demo title={zh ? '圆环' : 'Circle'} code={circleCode}>
        <Progress type="circle" percent={60} />
        <Progress type="circle" percent={80} status="success" />
        <Progress type="circle" percent={30} size="small" status="error" />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['percent', zh ? '进度（0-100，越界钳制）' : 'Progress (0-100, clamped when out of range)', 'number', zh ? '必填' : 'Required'],
          ['type', zh ? '形态：条形 / 圆环' : 'Shape: line / circle', "'line' | 'circle'", "'line'"],
          ['size', zh ? '条形为粗细，圆环为直径（small 64 / medium 96）' : 'Line thickness, or circle diameter (small 64 / medium 96)', "'small' | 'medium'", "'medium'"],
          ['status', zh ? '状态色' : 'Status color', "'normal' | 'success' | 'error'", "'normal'"],
          ['showInfo', zh ? '显示百分比文本' : 'Show percentage text', 'boolean', 'true'],
        ]}
      />
    </>
  );
}
