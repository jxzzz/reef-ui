import { Collapse, type CollapseItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const faqCode: Record<Lang, string> = {
  zh: `const faqItems: CollapseItem[] = [
  { key: 'q1', label: '什么是 reef-ui？', children: <p>一套基于 React 18 与 TypeScript 的珊瑚色系组件库。</p> },
  { key: 'q2', label: '支持暗色模式吗？', children: <p>支持，全部组件基于 CSS 主题 token，自动适配暗色模式。</p> },
  { key: 'q3', label: '可以按需引入吗？', children: <p>可以，每个组件独立目录，样式随组件按需引入。</p> },
];
<Collapse items={faqItems} />`,
  en: `const faqItems: CollapseItem[] = [
  { key: 'q1', label: 'What is reef-ui?', children: <p>A coral-themed component library built on React 18 and TypeScript.</p> },
  { key: 'q2', label: 'Does it support dark mode?', children: <p>Yes, all components are built on CSS theme tokens and adapt automatically.</p> },
  { key: 'q3', label: 'Can I import on demand?', children: <p>Yes, each component lives in its own directory with co-located styles.</p> },
];
<Collapse items={faqItems} />`,
};

const accordionCode: Record<Lang, string> = {
  zh: `const guideItems: CollapseItem[] = [
  { key: 'install', label: '安装', children: <p>在 monorepo 中执行 pnpm install。</p> },
  { key: 'import', label: '引入组件', children: <p>从 @reef-ui/components 导入所需组件即可。</p> },
  { key: 'theme', label: '定制主题', children: <p>覆盖 :root 上的 --reef-* 设计 token。</p> },
];
<Collapse accordion items={guideItems} />`,
  en: `const guideItems: CollapseItem[] = [
  { key: 'install', label: 'Install', children: <p>Run pnpm install in the monorepo.</p> },
  { key: 'import', label: 'Import components', children: <p>Import what you need from @reef-ui/components.</p> },
  { key: 'theme', label: 'Customize theme', children: <p>Override the --reef-* design tokens on :root.</p> },
];
<Collapse accordion items={guideItems} />`,
};

export function CollapsePage() {
  const { lang } = useLang();
  const zh = lang === 'zh';

  const faqItems: CollapseItem[] = zh
    ? [
        { key: 'q1', label: '什么是 reef-ui？', children: <p>一套基于 React 18 与 TypeScript 的珊瑚色系组件库。</p> },
        { key: 'q2', label: '支持暗色模式吗？', children: <p>支持，全部组件基于 CSS 主题 token，自动适配暗色模式。</p> },
        { key: 'q3', label: '可以按需引入吗？', children: <p>可以，每个组件独立目录，样式随组件按需引入。</p> },
      ]
    : [
        { key: 'q1', label: 'What is reef-ui?', children: <p>A coral-themed component library built on React 18 and TypeScript.</p> },
        { key: 'q2', label: 'Does it support dark mode?', children: <p>Yes, all components are built on CSS theme tokens and adapt automatically.</p> },
        { key: 'q3', label: 'Can I import on demand?', children: <p>Yes, each component lives in its own directory with co-located styles.</p> },
      ];

  const guideItems: CollapseItem[] = zh
    ? [
        { key: 'install', label: '安装', children: <p>在 monorepo 中执行 pnpm install。</p> },
        { key: 'import', label: '引入组件', children: <p>从 @reef-ui/components 导入所需组件即可。</p> },
        { key: 'theme', label: '定制主题', children: <p>覆盖 :root 上的 --reef-* 设计 token。</p> },
      ]
    : [
        { key: 'install', label: 'Install', children: <p>Run pnpm install in the monorepo.</p> },
        { key: 'import', label: 'Import components', children: <p>Import what you need from @reef-ui/components.</p> },
        { key: 'theme', label: 'Customize theme', children: <p>Override the --reef-* design tokens on :root.</p> },
      ];

  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Collapse 折叠面板' : 'Collapse'}>
        {zh
          ? '可折叠的内容区域，支持手风琴模式与展开图标位置配置。'
          : 'Collapsible content areas with accordion mode and expand icon position.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? faqCode.zh : faqCode.en}>
        <Collapse items={faqItems} />
      </Demo>

      <Demo
        title={zh ? '手风琴' : 'Accordion'}
        code={zh ? accordionCode.zh : accordionCode.en}
      >
        <Collapse accordion items={guideItems} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', zh ? '面板配置 { key, label, children, disabled }' : 'Panel configuration { key, label, children, disabled }', 'CollapseItem[]', zh ? '必填' : 'Required'],
          ['defaultActiveKey', zh ? '初始展开项的 key' : 'Initially expanded keys', 'string[]', '[]'],
          ['activeKey', zh ? '受控展开项的 key' : 'Controlled expanded keys', 'string[]', '—'],
          ['onChange', zh ? '展开状态变化回调' : 'Callback when expansion changes', '(keys: string[]) => void', '—'],
          ['accordion', zh ? '手风琴模式，最多展开一项' : 'Accordion mode, at most one open', 'boolean', 'false'],
          ['expandIconPosition', zh ? '展开图标位置' : 'Expand icon position', "'start' | 'end'", "'start'"],
        ]}
      />

      <TypeBlock
        code={`interface CollapseItem {
  key: string;
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}

interface CollapseProps {
  items: CollapseItem[];
  defaultActiveKey?: string[];
  activeKey?: string[];
  onChange?: (keys: string[]) => void;
  accordion?: boolean;
  expandIconPosition?: 'start' | 'end';
}`}
      />
    </>
  );
}
