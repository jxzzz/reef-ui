import { Button, Popover } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Popover title="标题" content="卡片内容">
  <Button>悬停我</Button>
</Popover>`,
  en: `<Popover title="Title" content="Card content">
  <Button>Hover me</Button>
</Popover>`,
};

const triggerCode: Record<Lang, string> = {
  zh: `<Popover content="点击外部或再次点击触发器关闭" trigger="click">
  <Button>点击我</Button>
</Popover>
<Popover content="placement 为 bottom 时出现在下方" placement="bottom">
  <Button>下方</Button>
</Popover>`,
  en: `<Popover content="Close by clicking outside or the trigger again" trigger="click">
  <Button>Click me</Button>
</Popover>
<Popover content="Shown below when placement is bottom" placement="bottom">
  <Button>Below</Button>
</Popover>`,
};

export function PopoverPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';

  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Popover 弹出卡片' : 'Popover'}>
        {zh ? (
          <>锚定在触发元素旁的浮动卡片，比 Tooltip 承载更丰富的标题与内容。</>
        ) : (
          <>A floating card anchored to a trigger, richer than a Tooltip with title and content.</>
        )}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <Popover title="标题" content="卡片内容">
            <Button>悬停我</Button>
          </Popover>
        ) : (
          <Popover title="Title" content="Card content">
            <Button>Hover me</Button>
          </Popover>
        )}
      </Demo>

      <Demo
        title={zh ? '触发方式与方向' : 'Trigger and placement'}
        code={zh ? triggerCode.zh : triggerCode.en}
      >
        {zh ? (
          <>
            <Popover content="点击外部或再次点击触发器关闭" trigger="click">
              <Button>点击我</Button>
            </Popover>
            <Popover content="placement 为 bottom 时出现在下方" placement="bottom">
              <Button>下方</Button>
            </Popover>
          </>
        ) : (
          <>
            <Popover content="Close by clicking outside or the trigger again" trigger="click">
              <Button>Click me</Button>
            </Popover>
            <Popover content="Shown below when placement is bottom" placement="bottom">
              <Button>Below</Button>
            </Popover>
          </>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['content', zh ? '卡片内容' : 'Card content', 'ReactNode', zh ? '必填' : 'Required'],
          ['title', zh ? '卡片标题，展示在内容上方' : 'Card title, shown above the content', 'ReactNode', '-'],
          ['trigger', zh ? '触发方式' : 'Trigger mode', "'hover' | 'click'", "'hover'"],
          ['placement', zh ? '卡片方向' : 'Card placement', "'top' | 'bottom'", "'top'"],
          ['visible', zh ? '受控显隐；传入后由使用方在 onChange 中控制关闭' : 'Controlled visibility; close it yourself in onChange', 'boolean', '-'],
          ['defaultVisible', zh ? '非受控默认显隐' : 'Uncontrolled default visibility', 'boolean', 'false'],
          ['onChange', zh ? '显隐变化回调' : 'Called when visibility changes', '(visible: boolean) => void', '-'],
        ]}
      />
      <TypeBlock
        code={`interface PopoverProps {
  content: React.ReactNode;
  title?: React.ReactNode;
  trigger?: 'hover' | 'click';
  placement?: 'top' | 'bottom';
  visible?: boolean;
  defaultVisible?: boolean;
  onChange?: (visible: boolean) => void;
}`}
      />
    </>
  );
}
