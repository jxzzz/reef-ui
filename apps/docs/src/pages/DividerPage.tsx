import { Avatar, Button, Divider } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `内容上方
<Divider>中间文字</Divider>
内容下方`,
  en: `Content above
<Divider>Middle text</Divider>
Content below`,
};

const dashedCode: Record<Lang, string> = {
  zh: `<div style={{ width: 280 }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Avatar size={40}>浪</Avatar>
    <div>
      <div>阿浪</div>
      <div style={{ fontSize: 12, color: 'var(--reef-color-text-secondary)' }}>产品经理</div>
    </div>
  </div>
  <Divider dashed />
  <div style={{ display: 'grid', gap: 4, fontSize: 13 }}>
    <span>手机：138 0000 0000</span>
    <span>邮箱：alang@reef.dev</span>
    <span>地点：杭州</span>
  </div>
</div>`,
  en: `<div style={{ width: 280 }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Avatar size={40}>A</Avatar>
    <div>
      <div>Alex Reef</div>
      <div style={{ fontSize: 12, color: 'var(--reef-color-text-secondary)' }}>Product Manager</div>
    </div>
  </div>
  <Divider dashed />
  <div style={{ display: 'grid', gap: 4, fontSize: 13 }}>
    <span>Phone: 138 0000 0000</span>
    <span>Email: alex@reef.dev</span>
    <span>Location: Hangzhou</span>
  </div>
</div>`,
};

const verticalCode: Record<Lang, string> = {
  zh: `<Button>左侧</Button>
<Divider vertical />
<Button>右侧</Button>`,
  en: `<Button>Left</Button>
<Divider vertical />
<Button>Right</Button>`,
};

export function DividerPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="通用" title={zh ? 'Divider 分割线' : 'Divider'}>
        {zh ? '水平或垂直分割线，水平线可带文字。' : 'Horizontal or vertical divider; the horizontal one can carry text.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <>
            <div>内容上方</div>
            <Divider>中间文字</Divider>
            <div>内容下方</div>
          </>
        ) : (
          <>
            <div>Content above</div>
            <Divider>Middle text</Divider>
            <div>Content below</div>
          </>
        )}
      </Demo>

      <Demo title={zh ? '虚线' : 'Dashed'} code={zh ? dashedCode.zh : dashedCode.en}>
        {zh ? (
          <div style={{ width: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar size={40}>浪</Avatar>
              <div>
                <div>阿浪</div>
                <div style={{ fontSize: 12, color: 'var(--reef-color-text-secondary)' }}>产品经理</div>
              </div>
            </div>
            <Divider dashed />
            <div style={{ display: 'grid', gap: 4, fontSize: 13 }}>
              <span>手机：138 0000 0000</span>
              <span>邮箱：alang@reef.dev</span>
              <span>地点：杭州</span>
            </div>
          </div>
        ) : (
          <div style={{ width: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar size={40}>A</Avatar>
              <div>
                <div>Alex Reef</div>
                <div style={{ fontSize: 12, color: 'var(--reef-color-text-secondary)' }}>Product Manager</div>
              </div>
            </div>
            <Divider dashed />
            <div style={{ display: 'grid', gap: 4, fontSize: 13 }}>
              <span>Phone: 138 0000 0000</span>
              <span>Email: alex@reef.dev</span>
              <span>Location: Hangzhou</span>
            </div>
          </div>
        )}
      </Demo>

      <Demo title={zh ? '垂直分割线' : 'Vertical divider'} code={zh ? verticalCode.zh : verticalCode.en}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {zh ? (
            <>
              <Button>左侧</Button>
              <Divider vertical />
              <Button>右侧</Button>
            </>
          ) : (
            <>
              <Button>Left</Button>
              <Divider vertical />
              <Button>Right</Button>
            </>
          )}
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['vertical', zh ? '是否垂直分割线' : 'Whether the divider is vertical', 'boolean', 'false'],
          ['dashed', zh ? '是否虚线' : 'Whether the line is dashed', 'boolean', 'false'],
          ['children', zh ? '水平线的文字内容' : 'Text content of the horizontal line', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
