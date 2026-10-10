import { useState } from 'react';
import { Button, Drawer } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `const [open, setOpen] = useState(false);
<>
  <Button onClick={() => setOpen(true)}>打开抽屉</Button>
  <Drawer open={open} onClose={() => setOpen(false)} title="详情">
    <p>抽屉内容</p>
  </Drawer>
</>`;

export function DrawerPage() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <h2>Drawer 抽屉</h2>
      <p>从屏幕边缘滑出的浮层面板，适合承载表单、详情等中等复杂度内容；点遮罩或按 Esc 关闭。</p>

      <Demo title="基础用法" code={basicCode}>
        <>
          <Button onClick={() => setOpen(true)}>打开抽屉</Button>
          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            title="详情"
            footer={<Button onClick={() => setOpen(false)}>关闭</Button>}
          >
            <p>抽屉内容</p>
          </Drawer>
        </>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['open', '是否打开', 'boolean', '必填'],
          ['onClose', '点遮罩 / Esc 关闭回调', '() => void', '—'],
          ['title', '标题', 'ReactNode', '—'],
          ['placement', '滑出位置', "'right' | 'left'", "'right'"],
          ['width', '面板宽度（px）', 'number', '378'],
          ['footer', '底部操作区', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
