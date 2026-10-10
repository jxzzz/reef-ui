import { Button, Divider } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `内容上方
<Divider>中间文字</Divider>
内容下方`;

const dashedCode = `<Divider dashed />`;

const verticalCode = `<Button>左侧</Button>
<Divider vertical />
<Button>右侧</Button>`;

export function DividerPage() {
  return (
    <>
      <h2>Divider 分割线</h2>
      <p>水平或垂直分割线，水平线可带文字。</p>

      <Demo title="基础用法" code={basicCode}>
        <div>内容上方</div>
        <Divider>中间文字</Divider>
        <div>内容下方</div>
      </Demo>

      <Demo title="虚线" code={dashedCode}>
        <Divider dashed />
      </Demo>

      <Demo title="垂直分割线" code={verticalCode}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button>左侧</Button>
          <Divider vertical />
          <Button>右侧</Button>
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['vertical', '是否垂直分割线', 'boolean', 'false'],
          ['dashed', '是否虚线', 'boolean', 'false'],
          ['children', '水平线的文字内容', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
