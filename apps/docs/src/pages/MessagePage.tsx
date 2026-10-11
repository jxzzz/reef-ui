import { useEffect, useState } from 'react';
import { Button, Message, type MessageItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

function makeItems(zh: boolean): MessageItem[] {
  return [
    { key: '1', type: 'success', content: zh ? '保存成功' : 'Saved successfully' },
    { key: '2', type: 'warning', content: zh ? '部分字段未填写' : 'Some fields are missing' },
  ];
}

const fullCode: Record<Lang, string> = {
  zh: `const [items, setItems] = useState<MessageItem[]>([
  { key: '1', type: 'success', content: '保存成功' },
  { key: '2', type: 'warning', content: '部分字段未填写' },
]);
<Message
  items={items}
  onClose={(key) => setItems(items.filter((item) => item.key !== key))}
/>`,
  en: `const [items, setItems] = useState<MessageItem[]>([
  { key: '1', type: 'success', content: 'Saved successfully' },
  { key: '2', type: 'warning', content: 'Some fields are missing' },
]);
<Message
  items={items}
  onClose={(key) => setItems(items.filter((item) => item.key !== key))}
/>`,
};

export function MessagePage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [items, setItems] = useState<MessageItem[]>(() => makeItems(zh));
  useEffect(() => setItems(makeItems(zh)), [zh]);
  return (
    <>
      <ComponentHeader group="反馈" title={zh ? 'Message 全局提示' : 'Message'}>
        {zh
          ? '页面顶部居中的轻量反馈。父级持有 items，关闭时按 key 移除。'
          : 'Lightweight feedback centered at the top of the page. The parent holds items and removes them by key on close.'}
      </ComponentHeader>

      <Demo title={zh ? '受控列表' : 'Controlled list'} code={zh ? fullCode.zh : fullCode.en}>
        <div>
          <p style={{ marginBottom: 12 }}>
            {zh ? (
              <Button onClick={() => setItems(makeItems(true))}>显示提示</Button>
            ) : (
              <Button onClick={() => setItems(makeItems(false))}>Show messages</Button>
            )}
          </p>
          <Message items={items} onClose={(key) => setItems(items.filter((item) => item.key !== key))} />
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', zh ? '消息列表（父级受控）{ key, type?, content }' : 'Message list (parent-controlled) { key, type?, content }', 'MessageItem[]', zh ? '必填' : 'Required'],
          ['items[].type', zh ? '消息类型' : 'Message type', "'info' | 'success' | 'warning' | 'danger'", "'info'"],
          ['onClose', zh ? '单条关闭回调，携带 key' : 'Per-message close callback, receives the key', '(key: string) => void', '—'],
        ]}
      />

      <TypeBlock
        code={`interface MessageItem {
  key: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
  content: ReactNode;
}`}
      />
    </>
  );
}
