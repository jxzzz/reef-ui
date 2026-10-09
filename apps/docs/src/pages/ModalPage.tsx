import { useState } from 'react';
import { Button, Modal } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `const [open, setOpen] = useState(false);

<Modal open={open} title="确认删除" onClose={() => setOpen(false)}>
  <p>删除后不可恢复，确定要删除这条记录吗？</p>
</Modal>`;

const footerCode = `<Modal
  open={open}
  title="自定义底部"
  footer={
    <>
      <Button onClick={() => setOpen(false)}>取消</Button>
      <Button variant="primary" onClick={() => setOpen(false)}>确定</Button>
    </>
  }
  onClose={() => setOpen(false)}
>
  内容
</Modal>`;

export function ModalPage() {
  const [open, setOpen] = useState(false);
  const [openFooter, setOpenFooter] = useState(false);

  return (
    <>
      <h2>Modal 对话框</h2>
      <p>模态对话框，通过 portal 渲染，支持 Esc、遮罩点击关闭与焦点圈定。</p>

      <Demo title="基础用法" code={basicCode}>
        <Button onClick={() => setOpen(true)}>打开对话框</Button>
        <Modal open={open} title="确认删除" onClose={() => setOpen(false)}>
          <p style={{ margin: 0 }}>删除后不可恢复，确定要删除这条记录吗？</p>
        </Modal>
      </Demo>

      <Demo title="自定义底部" code={footerCode}>
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
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['open', '是否可见（受控）', 'boolean', '必填'],
          ['title', '标题', 'ReactNode', '—'],
          ['width', '宽度（px）', 'number', '480'],
          ['footer', '底部操作区', 'ReactNode', '—'],
          ['onClose', '关闭回调（Esc / 遮罩 / 关闭按钮触发）', '() => void', '—'],
        ]}
      />
    </>
  );
}
