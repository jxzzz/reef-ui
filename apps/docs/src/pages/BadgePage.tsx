import { Badge, Button } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Badge count={5}>消息</Badge>
<Badge count={100} />
<Badge count={100} color="brand" />`,
  en: `<Badge count={5}>Messages</Badge>
<Badge count={100} />
<Badge count={100} color="brand" />`,
};

const dotCode: Record<Lang, string> = {
  zh: `<Badge dot>
  <Button>通知</Button>
</Badge>`,
  en: `<Badge dot>
  <Button>Notifications</Button>
</Badge>`,
};

export function BadgePage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Badge 徽标数' : 'Badge'}>
        {zh ? '出现在图标或文字右上角的数字或圆点，超过 max 折叠为 max+。' : 'A number or dot shown at the top-right corner of an icon or text. Values above max collapse to max+.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <>
            <Badge count={5}>消息</Badge>
            <Badge count={100} />
            <Badge count={100} color="brand" />
          </>
        ) : (
          <>
            <Badge count={5}>Messages</Badge>
            <Badge count={100} />
            <Badge count={100} color="brand" />
          </>
        )}
      </Demo>

      <Demo title={zh ? '圆点' : 'Dot'} code={zh ? dotCode.zh : dotCode.en}>
        {zh ? (
          <Badge dot>
            <Button>通知</Button>
          </Badge>
        ) : (
          <Badge dot>
            <Button>Notifications</Button>
          </Badge>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['count', zh ? '数字；0 或负数不渲染' : 'Count; 0 or negative values render nothing', 'number', '—'],
          ['dot', zh ? '只显示圆点' : 'Show only a dot', 'boolean', 'false'],
          ['max', zh ? '折叠阈值' : 'Collapse threshold', 'number', '99'],
          ['color', zh ? '预设色' : 'Preset color', "'brand' | 'success' | 'warning' | 'danger'", "'danger'"],
        ]}
      />
    </>
  );
}
