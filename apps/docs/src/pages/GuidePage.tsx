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
  /* 覆盖 Design Token 即可换成品牌主题 */
  --reef-color-brand: #0e7a5f;
  --reef-color-brand-hover: #0a624d;
}`;

export function GuidePage() {
  return (
    <>
      <h1>使用指南</h1>
      <p>Reef UI 是为中后台场景打造的基础 React 组件库，基于 CSS Variables 实现主题定制。</p>

      <h2>安装</h2>
      <p>
        组件包 <code>@reef-ui/components</code> 内含组件与全部样式（含主题令牌）。
      </p>
      <CodeBlock code={installCode} />

      <h2>在应用中使用</h2>
      <p>
        只需导入一个样式文件：组件样式和 Design Token（包括暗色主题变量）都打包在{' '}
        <code>@reef-ui/components/style.css</code> 里。
      </p>
      <CodeBlock code={usageCode} />

      <h2>主题定制</h2>
      <p>
        所有颜色、间距、圆角都是 CSS 变量，覆盖变量即可换成品牌主题，无需重新编译。
      </p>
      <CodeBlock code={themeCode} />
    </>
  );
}
