import { Badge, Button } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Badge count={5}>消息</Badge>
<Badge count={100} />
<Badge count={100} color="brand" />`;

const dotCode = `<Badge dot>
  <Button>通知</Button>
</Badge>`;

export function BadgePage() {
  return (
    <>
      <h2>Badge 徽标数</h2>
      <p>出现在图标或文字右上角的数字或圆点，超过 max 折叠为 max+。</p>

      <Demo title="基础用法" code={basicCode}>
        <Badge count={5}>消息</Badge>
        <Badge count={100} />
        <Badge count={100} color="brand" />
      </Demo>

      <Demo title="圆点" code={dotCode}>
        <Badge dot>
          <Button>通知</Button>
        </Badge>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['count', '数字；0 或负数不渲染', 'number', '—'],
          ['dot', '只显示圆点', 'boolean', 'false'],
          ['max', '折叠阈值', 'number', '99'],
          ['color', '预设色', "'brand' | 'success' | 'warning' | 'danger'", "'danger'"],
        ]}
      />
    </>
  );
}
