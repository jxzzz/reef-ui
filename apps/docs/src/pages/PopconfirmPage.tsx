import { useState } from 'react';
import { Button, Popconfirm } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `const [count, setCount] = useState(0);

<Popconfirm title="确定删除这条记录吗？" onConfirm={() => setCount(count + 1)}>
  <Button variant="danger">删除</Button>
</Popconfirm>
<span>已删除 {count} 条</span>`,
  en: `const [count, setCount] = useState(0);

<Popconfirm title="Delete this record?" onConfirm={() => setCount(count + 1)}>
  <Button variant="danger">Delete</Button>
</Popconfirm>
<span>{count} deleted</span>`,
};

const placementCode: Record<Lang, string> = {
  zh: `<Popconfirm title="默认出现在上方" description="补充说明展示在标题下方。">
  <Button>上方</Button>
</Popconfirm>
<Popconfirm title="placement 为 bottom 时出现在下方" placement="bottom">
  <Button>下方</Button>
</Popconfirm>`,
  en: `<Popconfirm title="Shown above by default" description="Description goes below the title.">
  <Button>Above</Button>
</Popconfirm>
<Popconfirm title="Shown below when placement is bottom" placement="bottom">
  <Button>Below</Button>
</Popconfirm>`,
};

export function PopconfirmPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [count, setCount] = useState(0);

  return (
    <>
      <ComponentHeader group="反馈" title={zh ? 'Popconfirm 气泡确认框' : 'Popconfirm'}>
        {zh ? (
          <>点击元素弹出气泡式的确认框，适合删除等需要二次确认的高风险操作。</>
        ) : (
          <>
            A small confirmation bubble shown on click, for risky actions like deletion that need a
            second confirmation.
          </>
        )}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <>
            <Popconfirm title="确定删除这条记录吗？" onConfirm={() => setCount(count + 1)}>
              <Button variant="danger">删除</Button>
            </Popconfirm>
            <span>已删除 {count} 条</span>
          </>
        ) : (
          <>
            <Popconfirm title="Delete this record?" onConfirm={() => setCount(count + 1)}>
              <Button variant="danger">Delete</Button>
            </Popconfirm>
            <span>{count} deleted</span>
          </>
        )}
      </Demo>

      <Demo title={zh ? '气泡方向与补充说明' : 'Placement and description'} code={zh ? placementCode.zh : placementCode.en}>
        {zh ? (
          <>
            <Popconfirm title="默认出现在上方" description="补充说明展示在标题下方。">
              <Button>上方</Button>
            </Popconfirm>
            <Popconfirm title="placement 为 bottom 时出现在下方" placement="bottom">
              <Button>下方</Button>
            </Popconfirm>
          </>
        ) : (
          <>
            <Popconfirm title="Shown above by default" description="Description goes below the title.">
              <Button>Above</Button>
            </Popconfirm>
            <Popconfirm title="Shown below when placement is bottom" placement="bottom">
              <Button>Below</Button>
            </Popconfirm>
          </>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['title', zh ? '确认文案' : 'Confirmation text', 'ReactNode', zh ? '必填' : 'Required'],
          ['description', zh ? '补充说明，展示在标题下方' : 'Description shown below the title', 'ReactNode', '-'],
          ['open', zh ? '受控显隐；传入后需在 onConfirm/onCancel 中控制关闭' : 'Controlled visibility; close it yourself in onConfirm/onCancel', 'boolean', '-'],
          ['defaultOpen', zh ? '非受控默认显隐' : 'Uncontrolled default visibility', 'boolean', 'false'],
          ['onConfirm', zh ? '点击确定回调' : 'Called when confirmed', '() => void', '-'],
          ['onCancel', zh ? '点击取消回调' : 'Called when cancelled', '() => void', '-'],
          ['placement', zh ? '气泡方向' : 'Bubble placement', "'top' | 'bottom'", "'top'"],
          ['disabled', zh ? '禁用弹出' : 'Disable the bubble', 'boolean', 'false'],
        ]}
      />
      <p>
        {zh
          ? '非受控时点击确定/取消/气泡外部或按 Escape 都会自动关闭；受控（传入 open）时不自动关闭，由使用方控制。'
          : 'Uncontrolled: confirm, cancel, outside click or Escape closes the bubble. Controlled (passing open): it never auto-closes; the caller decides.'}
      </p>
    </>
  );
}
