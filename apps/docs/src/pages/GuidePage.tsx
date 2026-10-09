import { CodeBlock } from '../docs-ui';

const installCode = `npm install @reef-ui/components @reef-ui/theme
# 或
pnpm add @reef-ui/components @reef-ui/theme`;

const usageCode = `import { Button } from '@reef-ui/components';
import '@reef-ui/theme/css';
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
        组件包 <code>@reef-ui/components</code> 提供组件，主题包{' '}
        <code>@reef-ui/theme</code> 提供 Design Token，两者一起安装。
      </p>
      <CodeBlock code={installCode} />

      <h2>在应用中使用</h2>
      <p>
        组件样式与主题样式需要分别引入：<code>@reef-ui/theme/css</code> 提供 Design
        Token，<code>@reef-ui/components/style.css</code> 提供组件样式。
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
