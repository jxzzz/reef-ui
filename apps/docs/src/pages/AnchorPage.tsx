import { Anchor, type AnchorItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const sections: Record<Lang, { key: string; title: string; body: string }[]> = {
  zh: [
    { key: 'intro', title: '简介', body: 'Anchor 锚点用于跳转到页面内指定位置，并根据滚动位置高亮当前所在区块。' },
    { key: 'usage', title: '用法', body: '传入 items 数组，每项包含 key、title 与目标选择器 href。' },
    { key: 'api', title: 'API', body: '支持受控 / 非受控两种激活态，点击链接平滑滚动到目标元素。' },
  ],
  en: [
    { key: 'intro', title: 'Introduction', body: 'Anchor navigates to in-page targets and highlights the current section while scrolling.' },
    { key: 'usage', title: 'Usage', body: 'Pass an items array; each item has key, title and a target selector href.' },
    { key: 'api', title: 'API', body: 'Supports controlled and uncontrolled active state; clicking a link smooth-scrolls to the target.' },
  ],
};

const basicCode: Record<Lang, string> = {
  zh: `const items: AnchorItem[] = [
  { key: 'intro', title: '简介', href: '#intro' },
  { key: 'usage', title: '用法', href: '#usage' },
];
<Anchor items={items} />`,
  en: `const items: AnchorItem[] = [
  { key: 'intro', title: 'Introduction', href: '#intro' },
  { key: 'usage', title: 'Usage', href: '#usage' },
];
<Anchor items={items} />`,
};

export function AnchorPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const secs = sections[lang];
  const items: AnchorItem[] = secs.map((s) => ({ key: s.key, title: s.title, href: `#anchor-${s.key}` }));

  return (
    <>
      <ComponentHeader group="导航" title={zh ? 'Anchor 锚点' : 'Anchor'}>
        {zh
          ? '页面内导航，点击平滑滚动到目标区块，滚动时自动高亮当前所在位置。'
          : 'In-page navigation. Clicking smooth-scrolls to the target section; the current section is highlighted while scrolling.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {/* ponytail: window-only，scroll-spy 只监听 window 滚动，演示区用 overflow 容器承载，
            容器内滚动不会触发联动高亮（点击跳转仍生效），需要容器作用域时再改造 */}
        <div style={{ display: 'flex', gap: 16 }}>
          <Anchor items={items} defaultActiveKey="intro" />
          <div style={{ flex: 1, height: 200, overflow: 'auto' }}>
            {secs.map((s) => (
              <section key={s.key} id={`anchor-${s.key}`} style={{ height: 200, padding: '8px 12px' }}>
                <h4 style={{ margin: 0 }}>{s.title}</h4>
                <p>{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', zh ? '锚点数据 { key, title, href }，href 为目标元素选择器' : 'Anchor data { key, title, href }; href is a selector for the target element', 'AnchorItem[]', zh ? '必填' : 'Required'],
          ['activeKey', zh ? '受控激活项的 key' : 'Key of the controlled active item', 'string', '-'],
          ['defaultActiveKey', zh ? '初始激活项的 key' : 'Initially active item key', 'string', '-'],
          ['onChange', zh ? '激活项变化时触发（点击或滚动联动）' : 'Fires when the active item changes (click or scroll-spy)', '(key: string) => void', '-'],
          ['onClick', zh ? '点击链接时触发，事件已 preventDefault' : 'Fires on link click; the event is already prevented', '(e, item) => void', '-'],
        ]}
      />

      <TypeBlock
        code={`interface AnchorItem {
  key: string;
  title: ReactNode;
  href: string;
}`}
      />
    </>
  );
}
