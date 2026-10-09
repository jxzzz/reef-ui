import { Button, Tooltip } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Tooltip title="删除该条目">
  <Button>删除</Button>
</Tooltip>
<Tooltip title="顶部提示" placement="top">
  <Button>上方</Button>
</Tooltip>`;

export function TooltipPage() {
  return (
    <>
      <h2>Tooltip 文字提示</h2>
      <p>鼠标悬停或键盘聚焦时显示的轻量气泡，纯 CSS 实现。</p>

      <Demo title="基础用法" code={basicCode}>
        <Tooltip title="删除该条目">
          <Button>删除</Button>
        </Tooltip>
        <Tooltip title="我在下面" placement="bottom">
          <Button>下方</Button>
        </Tooltip>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['title', '气泡文案', 'string', '必填'],
          ['placement', '显示位置', "'top' | 'bottom'", "'top'"],
        ]}
      />
    </>
  );
}
