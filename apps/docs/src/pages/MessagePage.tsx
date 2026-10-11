import { useState } from 'react';
import { Button, Message, type MessageItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';

const fullCode = `const [items, setItems] = useState<MessageItem[]>([
  { key: '1', type: 'success', content: '保存成功' },
  { key: '2', type: 'warning', content: '部分字段未填写' },
]);
<Message
  items={items}
  onClose={(key) => setItems(items.filter((item) => item.key !== key))}
/>`;

export function MessagePage() {
  const [items, setItems] = useState<MessageItem[]>([
    { key: '1', type: 'success' as const, content: '保存成功' },
    { key: '2', type: 'warning' as const, content: '部分字段未填写' },
  ]);
  return (
    <>
      <ComponentHeader group="反馈" title="Message 全局提示">
        页面顶部居中的轻量反馈。父级持有 items，关闭时按 key 移除。
      </ComponentHeader>

      <Demo title="受控列表" code={fullCode}>
        <div>
          <p style={{ marginBottom: 12 }}>
            <Button
              onClick={() =>
                setItems([
                  { key: '1', type: 'success', content: '保存成功' },
                  { key: '2', type: 'warning', content: '部分字段未填写' },
                ])
              }
            >
              显示提示
            </Button>
          </p>
          <Message items={items} onClose={(key) => setItems(items.filter((item) => item.key !== key))} />
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '消息列表（父级受控）{ key, type?, content }', 'MessageItem[]', '必填'],
          ['items[].type', '消息类型', "'info' | 'success' | 'warning' | 'danger'", "'info'"],
          ['onClose', '单条关闭回调，携带 key', '(key: string) => void', '—'],
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
