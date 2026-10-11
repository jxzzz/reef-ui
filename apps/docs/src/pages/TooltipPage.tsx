import { Button, Tooltip } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Tooltip title="删除该条目">
  <Button>删除</Button>
</Tooltip>
<Tooltip title="我在下面" placement="bottom">
  <Button>下方</Button>
</Tooltip>`,
  en: `<Tooltip title="Delete this item">
  <Button>Delete</Button>
</Tooltip>
<Tooltip title="I'm at the bottom" placement="bottom">
  <Button>Below</Button>
</Tooltip>`,
};

export function TooltipPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Tooltip 文字提示' : 'Tooltip'}>
        {zh ? '鼠标悬停或键盘聚焦时显示的轻量气泡，纯 CSS 实现。' : 'A lightweight bubble shown on hover or keyboard focus, implemented in pure CSS.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <>
            <Tooltip title="删除该条目">
              <Button>删除</Button>
            </Tooltip>
            <Tooltip title="我在下面" placement="bottom">
              <Button>下方</Button>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="Delete this item">
              <Button>Delete</Button>
            </Tooltip>
            <Tooltip title="I'm at the bottom" placement="bottom">
              <Button>Below</Button>
            </Tooltip>
          </>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['title', zh ? '气泡文案' : 'Tooltip text', 'string', zh ? '必填' : 'Required'],
          ['placement', zh ? '显示位置' : 'Display position', "'top' | 'bottom'", "'top'"],
        ]}
      />
    </>
  );
}
