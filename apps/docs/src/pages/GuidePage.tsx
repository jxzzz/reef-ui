import type { ReactNode } from 'react';
import { CodeBlock } from '../docs-ui';

const installCode = `npm install @reef-ui/components
# 或
pnpm add @reef-ui/components`;

const usageCode = `import { Button } from '@reef-ui/components';
// 组件样式 + Design Token 已合并在这一个文件里
import '@reef-ui/components/style.css';

export default function App() {
  return <Button variant="primary" onClick={handleSubmit}>提交</Button>;
}`;

const themeCode = `:root {
  /* 覆盖 Design Token 即可换成品牌主题，无需重新编译 */
  --reef-color-brand: #0e7a5f;
  --reef-color-brand-hover: #0a624d;
}`;

const darkCode = `// 在 <html> 上切换 data-theme，全部组件跟随变化，组件代码零改动
document.documentElement.dataset.theme = isDark ? 'dark' : '';`;

/** 色卡：值直接取自当前主题变量，暗色模式下自动跟随变化 */
const swatches: Array<[string, string]> = [
  ['--reef-color-brand', '品牌主色'],
  ['--reef-color-brand-hover', '主色悬停'],
  ['--reef-color-success', '成功'],
  ['--reef-color-warning', '警告'],
  ['--reef-color-danger', '危险'],
  ['--reef-color-surface', '容器底色'],
  ['--reef-color-text-primary', '主文本'],
  ['--reef-color-text-secondary', '次要文本'],
];

const steps: Array<{ title: string; desc: ReactNode; code: string }> = [
  {
    title: '安装',
    desc: (
      <>
        组件包 <code>@reef-ui/components</code> 内含全部组件与样式，无任何运行时依赖。
      </>
    ),
    code: installCode,
  },
  {
    title: '引入样式',
    desc: (
      <>
        只需导入一个样式文件：组件样式和 Design Token（包括暗色主题变量）都打包在{' '}
        <code>@reef-ui/components/style.css</code> 里。
      </>
    ),
    code: `import '@reef-ui/components/style.css';`,
  },
  {
    title: '使用组件',
    desc: <>按需导入即可，TypeScript 类型随包分发，无需额外安装类型。</>,
    code: usageCode,
  },
];

export function GuidePage() {
  return (
    <>
      <p className="docs__eyebrow">指南</p>
      <h2>使用指南</h2>
      <p>
        Reef UI 是为中后台场景打造的基础 React 组件库，所有颜色、间距、圆角都由 CSS Variables
        驱动，覆盖变量即可完成主题定制。
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

      <h3>主题定制</h3>
      <p>覆盖 Design Token 即可换成品牌主题，CSS 变量是运行时生效的，改完刷新即见，无需重新编译。</p>
      <CodeBlock code={themeCode} />
      <div className="guide-tokens">
        {swatches.map(([name, desc]) => (
          <div className="guide-token" key={name}>
            {/* 色值取自当前主题变量，切暗色模式可直观对比 */}
            <span className="guide-token__swatch" style={{ background: `var(${name})` }} />
            <span className="guide-token__name">{name}</span>
            <span className="guide-token__desc">{desc}</span>
          </div>
        ))}
      </div>

      <h3>暗色模式</h3>
      <p>
        在 <code>&lt;html&gt;</code> 上设置 <code>data-theme="dark"</code>
        即可全局切换，所有组件跟随变化——本站右上角的按钮就是这样实现的，可以试试。
      </p>
      <CodeBlock code={darkCode} />
    </>
  );
}
