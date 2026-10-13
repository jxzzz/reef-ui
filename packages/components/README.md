<div align="center">

# @reef-ui/components

**The main package of Reef UI — React component library for admin & dashboard scenarios**

[![npm version](https://img.shields.io/npm/v/@reef-ui/components?color=cb3837&logo=npm)](https://www.npmjs.com/package/@reef-ui/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/jxzzz/reef-ui/blob/main/LICENSE)
[📖 Full documentation](https://reef-ui.imxuex.workers.dev) · [中文说明](https://github.com/jxzzz/reef-ui/blob/main/README.zh-CN.md)

</div>

46 components covering forms, feedback, navigation and data display. Design Token theme system built on CSS Variables, one-line dark mode, complete TypeScript types.

## Install

```bash
npm install @reef-ui/components
# @reef-ui/theme and @reef-ui/utils are installed automatically as dependencies
```

Requires React >= 18.

## Usage

```tsx
import { Button, Message } from '@reef-ui/components';
import '@reef-ui/components/style.css';  // component styles (incl. Design Tokens)

<Button variant="primary" onClick={() => Message.success('Published')}>
  Publish
</Button>
```

Dark mode: set `data-theme="dark"` on `<html>` or any root element.

Localization: wrap your app with `<LocaleProvider locale={enUS}>` to switch built-in texts such as placeholders, empty states and aria-labels (defaults to Chinese).

## Components

| Category | Components |
|---|---|
| **General** | Button, Divider, Scroll, Space, Typography (Title / Text) |
| **Data Entry** | Cascader, Checkbox, DatePicker / DateRangePicker, Form / FormItem, Input, InputNumber, Radio, Rate, Segmented, Select, Slider, Switch, TimePicker, Upload |
| **Data Display** | Avatar, Badge, Card, Collapse, Descriptions, Empty, Icon, Table, Tag, Timeline, Tooltip, Tree |
| **Feedback** | Alert, Drawer, Message, Modal, Popconfirm, Progress, Result, Skeleton, Spin |
| **Navigation** | Breadcrumb, Dropdown, Menu, Pagination, Steps, Tabs |

Live demos and the full API reference are on the [documentation site](https://reef-ui.imxuex.workers.dev).

## Related packages

- [`@reef-ui/theme`](https://www.npmjs.com/package/@reef-ui/theme) — Design Tokens (CSS Variables + dark theme)
- [`@reef-ui/utils`](https://www.npmjs.com/package/@reef-ui/utils) — utilities (`cn` etc.)

## License

[MIT](https://github.com/jxzzz/reef-ui/blob/main/LICENSE) © 2026 jxzzz
