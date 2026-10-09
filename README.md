# Reef UI

面向中后台、管理端和通用业务场景的 React 组件库。设计文档见 `docs/`（或项目原始设计文档）。

## 当前进度

### v0.1 — 基础设施（当前里程碑）

- [x] pnpm Monorepo + Turborepo
- [x] TypeScript 严格模式配置（`tsconfig.base.json`）
- [x] ESLint / Prettier / Stylelint
- [x] Design Token（`@reef-ui/theme`：CSS Variables + 暗色主题）
- [x] Button 组件（5 种 variant / 3 种 size / loading / block / 图标）
- [x] Icon 组件（check / close / plus / search）
- [x] Typography 组件（Title h1–h4 / Text 5 种语义色）
- [x] 单元测试（Vitest + React Testing Library）
- [x] 自建 Vite 文档站（导航 + live demo + 代码复制 + 暗色切换）
- [x] GitHub Actions CI（lint → typecheck → test → build）
- [x] Changesets 发布配置

### v0.2 — 基础组件（下一步）

- [ ] Tag、Avatar、Divider、Space、Flex
- [ ] 自动构建和发布流程（changesets GitHub Action）
- [ ] 视觉回归测试

### v0.3 — 表单与反馈

- [ ] Input、Select、Checkbox、Radio、Switch
- [ ] Alert、Message、Modal、Drawer
- [ ] axe-core 无障碍自动化测试

### v0.4 — 导航与数据展示

- [ ] Tabs、Menu、Breadcrumb、Pagination
- [ ] Card、Badge、Tooltip、Progress、Empty

### v0.5 — 复杂数据组件

- [ ] Table、Tree、DatePicker、虚拟滚动
- [ ] 第一个公开 Beta

### v1.0 — 稳定版本

- [ ] API 冻结、文档完整、覆盖率 ≥ 85%、npm 正式版

## 目录结构

```text
component-library/
├─ apps/
│  └─ docs/                    # 文档站（Vite + React，live demo）
├─ packages/
│  ├─ core/                    # 通用 hooks（暂为占位）
│  ├─ components/              # 组件库主包 @reef-ui/components
│  ├─ icons/                   # 图标资产（暂为占位）
│  ├─ theme/                   # Design Token @reef-ui/theme
│  └─ utils/                   # 工具函数 @reef-ui/utils
├─ .changeset/                 # 版本发布
├─ .github/workflows/ci.yml
├─ turbo.json
└─ tsconfig.base.json
```

## 快速开始

```bash
pnpm install
pnpm build       # 构建所有包
pnpm test        # 运行单元测试
pnpm lint        # ESLint
pnpm stylelint   # 样式检查
pnpm typecheck   # TypeScript 类型检查
pnpm docs        # 启动文档站 http://localhost:5173
```

## 使用

```tsx
import { Button } from '@reef-ui/components';
import '@reef-ui/theme/css';        // Design Token（CSS Variables）
import '@reef-ui/components/style.css'; // 组件样式

<Button variant="primary" loading={isSubmitting} onClick={handleSubmit}>
  提交
</Button>
```

暗色模式：在任意根元素上加 `data-theme="dark"`。

## 规范

- 样式：BEM 命名，`reef-` 前缀；颜色/间距/圆角一律使用 `--reef-*` CSS Variables
- 提交：PR 合并前 CI 必须通过；API 变更需附 changeset（`pnpm changeset`）
- 新组件必须包含：类型定义、Story、单元测试
