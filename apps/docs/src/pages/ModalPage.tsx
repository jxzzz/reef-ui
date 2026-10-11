import { useState } from 'react';
import { Button, Modal } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>打开对话框</Button>
  <Modal open={open} title="确认删除" onClose={() => setOpen(false)}>
    <p style={{ margin: 0 }}>删除后不可恢复，确定要删除这条记录吗？</p>
  </Modal>
</>`,
  en: `const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>Open dialog</Button>
  <Modal open={open} title="Confirm deletion" onClose={() => setOpen(false)}>
    <p style={{ margin: 0 }}>This cannot be undone. Delete this record?</p>
  </Modal>
</>`,
};

const footerCode: Record<Lang, string> = {
  zh: `const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>打开带底部按钮的对话框</Button>
  <Modal
    open={open}
    title="自定义底部"
    width={520}
    footer={
      <>
        <Button onClick={() => setOpen(false)}>取消</Button>
        <Button variant="primary" onClick={() => setOpen(false)}>确定</Button>
      </>
    }
    onClose={() => setOpen(false)}
  >
    <p style={{ margin: 0 }}>底部内容由使用方渲染。</p>
  </Modal>
</>`,
  en: `const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>Open dialog with footer buttons</Button>
  <Modal
    open={open}
    title="Custom footer"
    width={520}
    footer={
      <>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="primary" onClick={() => setOpen(false)}>OK</Button>
      </>
    }
    onClose={() => setOpen(false)}
  >
    <p style={{ margin: 0 }}>The footer is rendered by the caller.</p>
  </Modal>
</>`,
};

export function ModalPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [open, setOpen] = useState(false);
  const [openFooter, setOpenFooter] = useState(false);

  return (
    <>
      <ComponentHeader group="反馈" title={zh ? 'Modal 对话框' : 'Modal'}>
        {zh
          ? '模态对话框，通过 portal 渲染，支持 Esc、遮罩点击关闭与焦点圈定。'
          : 'Modal dialog rendered through a portal, with Esc, mask-click closing, and focus trapping.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <>
            <Button onClick={() => setOpen(true)}>打开对话框</Button>
            <Modal open={open} title="确认删除" onClose={() => setOpen(false)}>
              <p style={{ margin: 0 }}>删除后不可恢复，确定要删除这条记录吗？</p>
            </Modal>
          </>
        ) : (
          <>
            <Button onClick={() => setOpen(true)}>Open dialog</Button>
            <Modal open={open} title="Confirm deletion" onClose={() => setOpen(false)}>
              <p style={{ margin: 0 }}>This cannot be undone. Delete this record?</p>
            </Modal>
          </>
        )}
      </Demo>

      <Demo title={zh ? '自定义底部' : 'Custom footer'} code={zh ? footerCode.zh : footerCode.en}>
        {zh ? (
          <>
            <Button onClick={() => setOpenFooter(true)}>打开带底部按钮的对话框</Button>
            <Modal
              open={openFooter}
              title="自定义底部"
              width={520}
              footer={
                <>
                  <Button onClick={() => setOpenFooter(false)}>取消</Button>
                  <Button variant="primary" onClick={() => setOpenFooter(false)}>确定</Button>
                </>
              }
              onClose={() => setOpenFooter(false)}
            >
              <p style={{ margin: 0 }}>底部内容由使用方渲染。</p>
            </Modal>
          </>
        ) : (
          <>
            <Button onClick={() => setOpenFooter(true)}>Open dialog with footer buttons</Button>
            <Modal
              open={openFooter}
              title="Custom footer"
              width={520}
              footer={
                <>
                  <Button onClick={() => setOpenFooter(false)}>Cancel</Button>
                  <Button variant="primary" onClick={() => setOpenFooter(false)}>OK</Button>
                </>
              }
              onClose={() => setOpenFooter(false)}
            >
              <p style={{ margin: 0 }}>The footer is rendered by the caller.</p>
            </Modal>
          </>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['open', zh ? '是否可见（受控）' : 'Whether visible (controlled)', 'boolean', zh ? '必填' : 'Required'],
          ['title', zh ? '标题' : 'Title', 'ReactNode', '—'],
          ['width', zh ? '宽度（px）' : 'Width (px)', 'number', '480'],
          ['footer', zh ? '底部操作区' : 'Footer action area', 'ReactNode', '—'],
          ['onClose', zh ? '关闭回调（Esc / 遮罩 / 关闭按钮触发）' : 'Close callback (Esc / mask / close button)', '() => void', '—'],
        ]}
      />
    </>
  );
}
