<div align="center">

# @reef-ui/components

**Reef UI 组件库主包 —— 面向中后台与管理端场景的 React 组件库**

[![npm version](https://img.shields.io/npm/v/@reef-ui/components?color=cb3837&logo=npm)](https://www.npmjs.com/package/@reef-ui/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/jxzzz/reef-ui/blob/main/LICENSE)
[📖 完整文档](https://reef-ui.imxuex.workers.dev)

</div>

30+ 企业级组件:表单、反馈、导航、数据展示全覆盖。基于 CSS Variables 的 Design Token 主题系统,暗色模式一键切换,TypeScript 类型完备。

## 安装

```bash
npm install @reef-ui/components @reef-ui/theme
```

要求 React >= 18。

## 使用

```tsx
import { Button, Message } from '@reef-ui/components';
import '@reef-ui/theme/css';             // Design Token(必需)
import '@reef-ui/components/style.css';  // 组件样式(必需)

<Button variant="primary" onClick={() => Message.success('发布成功')}>
  发布
</Button>
```

暗色模式:在 `<html>` 或任意根元素上设置 `data-theme="dark"`。

## 组件

| 分类 | 组件 |
|---|---|
| **通用** | Button、Divider、Scroll、Typography(Title / Text) |
| **数据录入** | Checkbox、Form / FormItem、Input、Radio、Segmented、Select、Switch |
| **数据展示** | Avatar、Badge、Card、Descriptions、Empty、Icon、Tag、Timeline、Tooltip |
| **反馈** | Alert、Drawer、Message、Modal、Progress、Result、Skeleton、Spin |
| **导航** | Breadcrumb、Pagination、Steps、Tabs |

每个组件的 live demo 与完整 API 见[在线文档](https://reef-ui.imxuex.workers.dev)。

## 相关包

- [`@reef-ui/theme`](https://www.npmjs.com/package/@reef-ui/theme) — Design Token(CSS Variables + 暗色主题)
- [`@reef-ui/utils`](https://www.npmjs.com/package/@reef-ui/utils) — 工具函数
- [`@reef-ui/core`](https://www.npmjs.com/package/@reef-ui/core) — 通用 hooks
- [`@reef-ui/icons`](https://www.npmjs.com/package/@reef-ui/icons) — 图标资产

## 许可证

[MIT](https://github.com/jxzzz/reef-ui/blob/main/LICENSE) © 2026 jxzzz
