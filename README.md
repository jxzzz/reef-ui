<div align="center">

# Reef UI

**React component library for admin & dashboard scenarios**

[![npm version](https://img.shields.io/npm/v/@reef-ui/components?color=cb3837&logo=npm)](https://www.npmjs.com/org/reef-ui)
[![npm downloads](https://img.shields.io/npm/dm/@reef-ui/components?logo=npm)](https://www.npmjs.com/package/@reef-ui/components)
[![CI](https://github.com/jxzzz/reef-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/jxzzz/reef-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

**[📖 Documentation](https://reef-ui.imxuex.workers.dev)** · [npm org](https://www.npmjs.com/org/reef-ui)

English · [简体中文](./README.zh-CN.md)

</div>

Reef UI is an open-source React component library focused on admin / dashboard scenarios: enterprise-grade components out of the box, a Design Token theme system built on CSS Variables, one-line dark mode, and zero runtime style dependencies.

## Features

- 🧩 **40 components** — forms, feedback, navigation and data display, keep growing
- 🎨 **Design Token theming** — colors / spacing / radii all driven by `--reef-*` CSS Variables; change one variable, everything follows
- 🌓 **Dark mode** — set `data-theme="dark"` on the root element, components and docs adapt automatically
- 🌍 **Localization** — built-in `zhCN` / `enUS` locales via `LocaleProvider`, covering placeholders, empty states and aria-labels
- 📦 **Dual format** — ESM + CJS, complete TypeScript types, tree-shaking friendly
- ✅ **Test coverage** — Vitest + React Testing Library, 120+ cases, enforced in CI
- 🪶 **Zero UI dependencies** — components depend on no third-party UI library, only `clsx` as a utility

## Install

```bash
npm install @reef-ui/components
# or pnpm / yarn (@reef-ui/theme, @reef-ui/utils etc. are installed automatically)
```

Requires React >= 18.

## Quick start

```tsx
import { Button, Message } from '@reef-ui/components';
import '@reef-ui/components/style.css';  // component styles (incl. Design Tokens)

<Button variant="primary" onClick={() => Message.success('Published')}>
  Publish
</Button>
```

Dark mode: set `data-theme="dark"` on `<html>` or any root element.

Localization: wrap your app with `<LocaleProvider locale={enUS}>` to switch built-in texts (defaults to Chinese).

## Components

| Category | Components |
|---|---|
| **General** | Button, Divider, Scroll, Typography (Title / Text) |
| **Data Entry** | Checkbox, DatePicker / DateRangePicker, Form / FormItem, Input, InputNumber, Radio, Rate, Segmented, Select, Slider, Switch, TimePicker |
| **Data Display** | Avatar, Badge, Card, Descriptions, Empty, Icon, Table, Tag, Timeline, Tooltip |
| **Feedback** | Alert, Drawer, Message, Modal, Popconfirm, Progress, Result, Skeleton, Spin |
| **Navigation** | Breadcrumb, Menu, Pagination, Steps, Tabs |

Live demos and full API docs at the [documentation site](https://reef-ui.imxuex.workers.dev) (or run `pnpm docs` locally).

## Packages

| Package | Description |
|---|---|
| [`@reef-ui/components`](https://www.npmjs.com/package/@reef-ui/components) | The component library |
| [`@reef-ui/theme`](https://www.npmjs.com/package/@reef-ui/theme) | Design Tokens (CSS Variables + dark theme) |
| [`@reef-ui/utils`](https://www.npmjs.com/package/@reef-ui/utils) | Utilities (`cn` etc.) |

## Development

```bash
pnpm install
pnpm build       # build all packages
pnpm test        # unit tests (Vitest + React Testing Library)
pnpm lint        # ESLint
pnpm stylelint   # style lint
pnpm typecheck   # TypeScript check
pnpm docs        # docs site at http://localhost:5173
```

Monorepo with pnpm + Turborepo; `apps/docs` is the documentation site, `packages/*` are published packages.

## Release

1. Run `pnpm changeset` and commit the changeset when APIs or versions change
2. After merging to main, run the **Release** workflow (GitHub Actions, npm Trusted Publishing / OIDC, no token)
3. Changesets bumps versions and publishes to npm

## Roadmap

- [ ] Tree and other complex data components
- [ ] Virtual scrolling
- [ ] axe-core automated accessibility tests
- [ ] Visual regression tests
- [ ] Automated release on merge to main

## Contributing

Issues and PRs are welcome. Component contributions should include: type definitions, unit tests, and a docs page demo. CI (lint → typecheck → test → build) must pass before merge.

## License

[MIT](./LICENSE) © 2026 jxzzz
