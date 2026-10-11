import type { ReactNode } from 'react';
import { CodeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const installCode: Record<Lang, string> = {
  zh: `npm install @reef-ui/components
# 或
pnpm add @reef-ui/components`,
  en: `npm install @reef-ui/components
# or
pnpm add @reef-ui/components`,
};

const usageCode: Record<Lang, string> = {
  zh: `import { Button } from '@reef-ui/components';
// 组件样式 + Design Token 已合并在这一个文件里
import '@reef-ui/components/style.css';

export default function App() {
  return <Button variant="primary" onClick={handleSubmit}>提交</Button>;
}`,
  en: `import { Button } from '@reef-ui/components';
// component styles + Design Tokens are bundled in this single file
import '@reef-ui/components/style.css';

export default function App() {
  return <Button variant="primary" onClick={handleSubmit}>Submit</Button>;
}`,
};

const themeCode: Record<Lang, string> = {
  zh: `:root {
  /* 覆盖 Design Token 即可换成品牌主题，无需重新编译 */
  --reef-color-brand: #0e7a5f;
  --reef-color-brand-hover: #0a624d;
}`,
  en: `:root {
  /* override Design Tokens to rebrand, no recompilation needed */
  --reef-color-brand: #0e7a5f;
  --reef-color-brand-hover: #0a624d;
}`,
};

const darkCode: Record<Lang, string> = {
  zh: `// 在 <html> 上切换 data-theme，全部组件跟随变化，组件代码零改动
document.documentElement.dataset.theme = isDark ? 'dark' : '';`,
  en: `// toggle data-theme on <html>, every component follows, zero component-code changes
document.documentElement.dataset.theme = isDark ? 'dark' : '';`,
};

/** 色卡：值直接取自当前主题变量，暗色模式下自动跟随变化 */
const swatches: Array<[string, { zh: string; en: string }]> = [
  ['--reef-color-brand', { zh: '品牌主色', en: 'Brand' }],
  ['--reef-color-brand-hover', { zh: '主色悬停', en: 'Brand hover' }],
  ['--reef-color-success', { zh: '成功', en: 'Success' }],
  ['--reef-color-warning', { zh: '警告', en: 'Warning' }],
  ['--reef-color-danger', { zh: '危险', en: 'Danger' }],
  ['--reef-color-surface', { zh: '容器底色', en: 'Surface' }],
  ['--reef-color-text-primary', { zh: '主文本', en: 'Text primary' }],
  ['--reef-color-text-secondary', { zh: '次要文本', en: 'Text secondary' }],
];

export function GuidePage() {
  const { lang } = useLang();
  const zh = lang === 'zh';

  const steps: Array<{ title: string; desc: ReactNode; code: string }> = [
    {
      title: zh ? '安装' : 'Install',
      desc: (
        <>
          {zh ? (
            <>
              组件包 <code>@reef-ui/components</code> 内含全部组件与样式，无任何运行时依赖。
            </>
          ) : (
            <>
              The package <code>@reef-ui/components</code> ships all components and styles with zero runtime dependencies.
            </>
          )}
        </>
      ),
      code: installCode[lang],
    },
    {
      title: zh ? '引入样式' : 'Import styles',
      desc: zh ? (
        <>
          只需导入一个样式文件：组件样式和 Design Token（包括暗色主题变量）都打包在{' '}
          <code>@reef-ui/components/style.css</code> 里。
        </>
      ) : (
        <>
          Import one stylesheet: component styles and Design Tokens (including dark-theme variables) are bundled in{' '}
          <code>@reef-ui/components/style.css</code>.
        </>
      ),
      code: `import '@reef-ui/components/style.css';`,
    },
    {
      title: zh ? '使用组件' : 'Use components',
      desc: zh ? <>按需导入即可，TypeScript 类型随包分发，无需额外安装类型。</> : <>Import what you need — TypeScript types ship with the package, no extra install.</>,
      code: usageCode[lang],
    },
  ];

  return (
    <>
      <p className="docs__eyebrow">{zh ? '指南' : 'Guide'}</p>
      <h2>{zh ? '使用指南' : 'Getting Started'}</h2>
      <p>
        {zh
          ? 'Reef UI 是为中后台场景打造的基础 React 组件库，所有颜色、间距、圆角都由 CSS Variables 驱动，覆盖变量即可完成主题定制。'
          : 'Reef UI is a foundational React component library for admin and dashboard apps. Every color, spacing and radius is driven by CSS Variables — override the tokens and the theme is yours.'}
      </p>

      {steps.map((step, i) => (
        <section className="guide-step" key={step.title}>
          <span className="guide-step__num">{i + 1}</span>
          <div className="guide-step__body">
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
            <CodeBlock code={step.code} />
          </div>
        </section>
      ))}

      <h3>{zh ? '主题定制' : 'Theming'}</h3>
      <p>
        {zh
          ? '覆盖 Design Token 即可换成品牌主题，CSS 变量是运行时生效的，改完刷新即见，无需重新编译。'
          : 'Override Design Tokens to rebrand. CSS variables apply at runtime — refresh and it is live, no recompilation.'}
      </p>
      <CodeBlock code={themeCode[lang]} />
      <div className="guide-tokens">
        {swatches.map(([name, desc]) => (
          <div className="guide-token" key={name}>
            {/* 色值取自当前主题变量，切暗色模式可直观对比 */}
            <span className="guide-token__swatch" style={{ background: `var(${name})` }} />
            <span className="guide-token__name">{name}</span>
            <span className="guide-token__desc">{desc[lang]}</span>
          </div>
        ))}
      </div>

      <h3>{zh ? '暗色模式' : 'Dark Mode'}</h3>
      <p>
        {zh ? (
          <>
            在 <code>&lt;html&gt;</code> 上设置 <code>data-theme="dark"</code>
            即可全局切换，所有组件跟随变化——本站右上角的按钮就是这样实现的，可以试试。
          </>
        ) : (
          <>
            Set <code>data-theme="dark"</code> on <code>&lt;html&gt;</code> and every component switches — the button in
            the top-right corner of this site does exactly that, give it a try.
          </>
        )}
      </p>
      <CodeBlock code={darkCode[lang]} />
    </>
  );
}
