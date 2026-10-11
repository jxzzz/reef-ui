import { useState } from 'react';
import { Button, Drawer } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `const [open, setOpen] = useState(false);
<>
  <Button onClick={() => setOpen(true)}>打开抽屉</Button>
  <Drawer open={open} onClose={() => setOpen(false)} title="详情" footer={<Button onClick={() => setOpen(false)}>关闭</Button>}>
    <p>抽屉内容</p>
  </Drawer>
</>`,
  en: `const [open, setOpen] = useState(false);
<>
  <Button onClick={() => setOpen(true)}>Open drawer</Button>
  <Drawer open={open} onClose={() => setOpen(false)} title="Details" footer={<Button onClick={() => setOpen(false)}>Close</Button>}>
    <p>Drawer content</p>
  </Drawer>
</>`,
};

export function DrawerPage() {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="反馈" title={zh ? 'Drawer 抽屉' : 'Drawer'}>
        {zh
          ? '从屏幕边缘滑出的浮层面板，适合承载表单、详情等中等复杂度内容；点遮罩或按 Esc 关闭。'
          : 'A floating panel that slides in from the screen edge, suited to moderately complex content such as forms and details. Click the mask or press Esc to close.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <>
          <Button onClick={() => setOpen(true)}>{zh ? '打开抽屉' : 'Open drawer'}</Button>
          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            title={zh ? '详情' : 'Details'}
            footer={<Button onClick={() => setOpen(false)}>{zh ? '关闭' : 'Close'}</Button>}
          >
            <p>{zh ? '抽屉内容' : 'Drawer content'}</p>
          </Drawer>
        </>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['open', zh ? '是否打开' : 'Whether the drawer is open', 'boolean', zh ? '必填' : 'Required'],
          ['onClose', zh ? '点遮罩 / Esc 关闭回调' : 'Called when closed via mask click or Esc', '() => void', '—'],
          ['title', zh ? '标题' : 'Title', 'ReactNode', '—'],
          ['placement', zh ? '滑出位置' : 'Slide-in position', "'right' | 'left'", "'right'"],
          ['width', zh ? '面板宽度（px）' : 'Panel width (px)', 'number', '378'],
          ['footer', zh ? '底部操作区' : 'Footer action area', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
