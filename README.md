<div align="center">

# Reef UI

**面向中后台与管理端场景的 React 组件库**

[![npm version](https://img.shields.io/npm/v/@reef-ui/components?color=cb3837&logo=npm)](https://www.npmjs.com/org/reef-ui)
[![npm downloads](https://img.shields.io/npm/dm/@reef-ui/components?logo=npm)](https://www.npmjs.com/package/@reef-ui/components)
[![CI](https://github.com/jxzzz/reef-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/jxzzz/reef-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

**[📖 在线文档](https://reef-ui.imxuex.workers.dev)** · [npm 组织](https://www.npmjs.com/org/reef-ui)

</div>

Reef UI 是一套开源的 React 组件库,专注于中后台(admin / dashboard)场景:开箱即用的企业级组件、基于 CSS Variables 的 Design Token 主题系统、暗色模式一键切换,零运行时样式依赖。

## 特性

- 🧩 **30+ 企业级组件** — 表单、反馈、导航、数据展示全覆盖,持续扩充
- 🎨 **Design Token 主题系统** — 颜色/间距/圆角统一由 `--reef-*` CSS Variables 驱动,改一个变量全局生效
- 🌓 **暗色模式** — 根元素加 `data-theme="dark"` 即可,所有组件和文档示例自动适配
- 📦 **双格式产物** — ESM + CJS,TypeScript 类型完备,Tree-shaking 友好
- ✅ **测试保障** — Vitest + React Testing Library,112+ 用例,CI 强制通过
- 🪶 **零依赖组件** — 组件本身无第三方 UI 依赖,仅 `clsx` 一个工具函数依赖

## 安装

```bash
npm install @reef-ui/components @reef-ui/theme
# 或 pnpm / yarn
```

要求 React >= 18。

## 快速开始

```tsx
import { Button, Message } from '@reef-ui/components';
import '@reef-ui/theme/css';             // Design Token(必需)
import '@reef-ui/components/style.css';  // 组件样式(必需)

export default function App() {
  return (
    <Button
      variant="primary"
      onClick={() => Message.success('发布成功')}
    >
      发布
    </Button>
  );
}
```

暗色模式:在 `<html>` 或任意根元素上设置 `data-theme="dark"`。

## 组件总览

| 分类 | 组件 |
|---|---|
| **通用** | Button、Divider、Scroll、Typography(Title / Text) |
| **数据录入** | Checkbox、Form / FormItem、Input、Radio / RadioGroup、Segmented、Select、Switch |
| **数据展示** | Avatar、Badge、Card、Descriptions、Empty、Icon、Tag、Timeline、Tooltip |
| **反馈** | Alert、Drawer、Message、Modal、Progress、Result、Skeleton、Spin |
| **导航** | Breadcrumb、Pagination、Steps、Tabs |

每个组件的 live demo 与 API 文档见[在线文档](https://reef-ui.imxuex.workers.dev)(或本地运行 `pnpm docs` 启动)。

## 包结构

| 包名 | 说明 |
|---|---|
| [`@reef-ui/components`](https://www.npmjs.com/package/@reef-ui/components) | 组件库主包 |
| [`@reef-ui/theme`](https://www.npmjs.com/package/@reef-ui/theme) | Design Token(CSS Variables + 暗色主题) |
| [`@reef-ui/utils`](https://www.npmjs.com/package/@reef-ui/utils) | 工具函数(`cn` 等) |
| [`@reef-ui/core`](https://www.npmjs.com/package/@reef-ui/core) | 通用 hooks |
| [`@reef-ui/icons`](https://www.npmjs.com/package/@reef-ui/icons) | 图标资产 |

## 本地开发

```bash
pnpm install
pnpm build       # 构建所有包
pnpm test        # 单元测试(Vitest + React Testing Library)
pnpm lint        # ESLint
pnpm stylelint   # 样式检查
pnpm typecheck   # TypeScript 类型检查
pnpm docs        # 启动文档站 http://localhost:5173
```

Monorepo 使用 pnpm + Turborepo,`apps/docs` 为文档站,`packages/*` 为发布包。

## 发布流程

1. API 或版本变更时运行 `pnpm changeset` 并提交 changeset
2. 合入 main 后执行 **Release** workflow(GitHub Actions,基于 npm Trusted Publishing / OIDC,免 token)
3. changesets 自动升级版本号并发布到 npm

## 路线图

- [ ] Table、Tree、DatePicker 等复杂数据组件
- [ ] 虚拟滚动
- [ ] axe-core 无障碍自动化测试
- [ ] 视觉回归测试
- [ ] 自动化 Release 触发(合入 main 即发版)

## 贡献

欢迎 Issue 与 PR。提交组件请附带:类型定义、单元测试、文档页 demo。PR 合并前 CI(lint → typecheck → test → build)必须通过。

## 许可证

[MIT](./LICENSE) © 2026 jxzzz
