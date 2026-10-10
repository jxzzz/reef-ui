# 组件批次 3（展示型组件）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Reef UI 新增 8 个中后台高频展示型组件：Badge、Avatar、Card、Breadcrumb、Steps、Progress、Empty、Spin。

**Architecture:** 与批次 2 完全同构——每组件一个目录（组件 tsx / types / css / index / 测试），BEM `reef-` 前缀，只用 `--reef-*` design tokens，受控/非受控统一走 `value !== undefined ? value : inner`，每组件 2-4 个 RTL 测试 + 一个 docs 页 + App.tsx 四处注册。

**Tech Stack:** React 18 + TypeScript、vitest + jsdom + @testing-library/react、@testing-library/user-event、stylelint-config-standard、pnpm + Turborepo。

**Spec:** 无独立 spec 文档——本计划即规格（组件接口参考 Ant Design 语义，实现从简）。

## Global Constraints

- 目录结构固定：`packages/components/src/<name>/{X.tsx, types.ts, x.css, index.ts, X.test.tsx}`；`index.ts` 导出组件与类型
- BEM 类名必须匹配 `^reef-[a-z][a-z0-9]*(__[a-z0-9-]+)?(--[a-z0-9-]+)?$`——**块名内不允许连字符**（`reef-breadcrumb` ✓，`reef-my-thing` ✗）
- **stylelint 现在全仓库零基线（5016f4e 之后）**：每个任务必须 `pnpm stylelint` 全绿，不是"只查新文件"。已知规则雷区：
  - 伪类规则按特异性升序排：基类 → `:focus-visible` → `:disabled` → `:hover:not(...)`；`no-descending-specificity` 会报低特异性在后
  - **禁止链式 `:not()`**——用列表 `:not(:disabled, :focus)`（`selector-not-notation: complex`）
  - 注释前必须有空行（块内首行注释除外）；禁止重复选择器（合并到一个块）；`flex-direction`+`flex-wrap` 必须合并为 `flex-flow`
  - **禁止硬编码颜色**——只用 `--reef-*` tokens + `color-mix`。品牌底色上的"白字"用 `color: var(--reef-color-surface)`（Tooltip/Tabs 同款手法），不用 `#fff`
  - `@keyframes` 名称匹配 `^reef-[a-z][a-z0-9-]*$`；动画一律带 `prefers-reduced-motion` 关闭
- 受控/非受控：`current = value !== undefined ? value : inner`；受控时不写内部 state，但 `onChange` 始终触发
- 每组件 2-4 个测试；测试验证真实行为（角色/文本/类名/样式），不 mock 实现细节
- 每组件一个独立 commit：`feat: add <Name> component` + 结尾 `Co-Authored-By: Claude Code <noreply@anthropic.com>`
- docs 页面遵循 RadioPage 模式：`<h2>` 标题、`<p>` 一句话说明、`<Demo title code>`、`<ApiTable rows>`；示例代码字符串与实际渲染的 JSX 保持一致
- App.tsx 注册五处（本计划称"注册"）：import、PageKey 联合类型、`currentPage()` 的 keys 数组、`groups` 的组件 keys、`pages` 数组条目——每任务给出精确插入行，按任务顺序串行执行（各任务的 App.tsx 行内容是累积的）
- 每任务收尾跑 `pnpm lint && pnpm stylelint`（两者必须零输出）+ `pnpm --filter @reef-ui/components test` 全绿
- `docs/` 目录不提交；不要 `pkill -f vite`（用户自己在 5173 跑着 dev server）

## Review Focus

- **Badge count ≤ 0**：0 或负数应完全不渲染徽标，而不是显示 "0" 或 "NaN+" —— Task 1 测试 3 钉住
- **Progress percent 越界**：负数和 >100 应钳制到 [0,100]，填充不溢出轨道、文本不显示 "150%" —— Task 6 测试 2 钉住
- **Avatar 图片加载失败**：应回退到 children 内容，不显示破图图标 —— Task 2 测试 2 钉住
- **Steps current 越界**：current 超过 items 长度不应崩溃，也不应错误高亮 —— Task 5 测试 4 钉住
- **Spin spinning=false 包裹内容**：应只渲染 children，无遮罩无 tip —— Task 8 测试 3 钉住

---

### Task 1: Badge 徽标数

**Files:**
- Create: `packages/components/src/badge/Badge.tsx`
- Create: `packages/components/src/badge/types.ts`
- Create: `packages/components/src/badge/badge.css`
- Create: `packages/components/src/badge/index.ts`
- Test: `packages/components/src/badge/Badge.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/BadgePage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册）

**Interfaces:**
- Consumes: `cn()`（`@reef-ui/utils`）
- Produces: `export const Badge`、`export type BadgeProps, BadgeColor`。`BadgeColor = 'brand' | 'success' | 'warning' | 'danger'`；`BadgeProps`：`count?: number`（0 或负数不渲染）、`dot?: boolean`（默认 false）、`max?: number`（默认 99）、`color?: BadgeColor`（默认 'danger'）、`children?: ReactNode`（缺省时为独立徽标）、`className?: string`

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/badge/Badge.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Badge } from './Badge';

afterEach(cleanup);

describe('Badge', () => {
  test('渲染数字，超过 max 显示 max+', () => {
    const { rerender } = render(<Badge count={5} />);
    expect(screen.getByText('5')).toBeTruthy();
    rerender(<Badge count={100} />);
    expect(screen.getByText('99+')).toBeTruthy();
  });

  test('dot 只渲染圆点不渲染文字', () => {
    render(<Badge dot count={5} />);
    expect(screen.queryByText('5')).toBeNull();
    expect(document.querySelector('.reef-badge--dot')).toBeTruthy();
  });

  test('count 为 0 或负数不渲染（Review Focus #1）', () => {
    const { rerender } = render(<Badge count={0} />);
    expect(document.querySelector('.reef-badge')).toBeNull();
    rerender(<Badge count={-3} />);
    expect(document.querySelector('.reef-badge')).toBeNull();
  });

  test('包裹子元素时绝对定位于其上', () => {
    render(
      <Badge count={5}>
        <button type="button">消息</button>
      </Badge>,
    );
    expect(screen.getByRole('button', { name: '消息' })).toBeTruthy();
    expect(document.querySelector('.reef-badge__wrapper')).toBeTruthy();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Badge'`）

- [ ] **Step 3: 实现**

```ts
// packages/components/src/badge/types.ts
import type * as React from 'react';

export type BadgeColor = 'brand' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  /** 数字；0 或负数不渲染 */
  count?: number;
  /** 只显示圆点 */
  dot?: boolean;
  /** 超过 max 显示 max+ */
  max?: number;
  color?: BadgeColor;
  /** 包裹的内容；缺省时为独立徽标 */
  children?: React.ReactNode;
  className?: string;
}
```

```tsx
// packages/components/src/badge/Badge.tsx
import { cn } from '@reef-ui/utils';
import type { BadgeProps } from './types';
import './badge.css';

export function Badge({ count, dot = false, max = 99, color = 'danger', children, className }: BadgeProps) {
  const show = dot || (count !== undefined && count > 0);
  const text = count !== undefined && count > max ? `${max}+` : count;

  const badge = (standalone: boolean) => (
    <sup
      className={cn(
        'reef-badge',
        `reef-badge--${color}`,
        dot && 'reef-badge--dot',
        standalone && 'reef-badge--standalone',
        standalone && className,
      )}
    >
      {!dot && text}
    </sup>
  );

  if (children == null) return show ? badge(true) : null;
  return (
    <span className={cn('reef-badge__wrapper', className)}>
      {children}
      {show && badge(false)}
    </span>
  );
}
```

```css
/* packages/components/src/badge/badge.css */
.reef-badge__wrapper {
  position: relative;
  display: inline-flex;
}

.reef-badge {
  box-sizing: border-box;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--reef-radius-full);
  font-size: var(--reef-font-size-sm);
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  color: var(--reef-color-surface);
  background: var(--reef-color-danger);
}

.reef-badge--brand {
  background: var(--reef-color-brand);
}

.reef-badge--success {
  background: var(--reef-color-success);
}

.reef-badge--warning {
  background: var(--reef-color-warning);
}

.reef-badge--dot {
  min-width: 8px;
  width: 8px;
  height: 8px;
  padding: 0;
}

.reef-badge--standalone {
  position: static;
  display: inline-block;
}

/* 包裹模式：钉在子元素右上角。放在最后，特异性高于上面的 static */
.reef-badge__wrapper .reef-badge {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}
```

```ts
// packages/components/src/badge/index.ts
export { Badge } from './Badge';
export type { BadgeProps, BadgeColor } from './types';
```

`packages/components/src/index.ts` 在 `'./button'` 前加一行 `export * from './badge';`；`packages/components/src/style.css` 在 `./button/button.css` 前加 `@import url('./badge/badge.css');`

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS（23 + 4 = 27）

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/BadgePage.tsx
import { Badge, Button } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Badge count={5}>消息</Badge>
<Badge count={100} />
<Badge count={100} color="brand" />`;

const dotCode = `<Badge dot>
  <Button>通知</Button>
</Badge>`;

export function BadgePage() {
  return (
    <>
      <h2>Badge 徽标数</h2>
      <p>出现在图标或文字右上角的数字或圆点，超过 max 折叠为 max+。</p>

      <Demo title="基础用法" code={basicCode}>
        <Badge count={5}>消息</Badge>
        <Badge count={100} />
        <Badge count={100} color="brand" />
      </Demo>

      <Demo title="圆点" code={dotCode}>
        <Badge dot>
          <Button>通知</Button>
        </Badge>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['count', '数字；0 或负数不渲染', 'number', '—'],
          ['dot', '只显示圆点', 'boolean', 'false'],
          ['max', '折叠阈值', 'number', '99'],
          ['color', '预设色', "'brand' | 'success' | 'warning' | 'danger'", "'danger'"],
        ]}
      />
    </>
  );
}
```

App.tsx 注册（在既有行上精确插入）：
- import 区：`import { BadgePage } from './pages/BadgePage';`（AlertPage 之后）
- PageKey 联合类型：`'alert'` 行后加 `| 'badge'`
- currentPage keys 数组：`'alert',` 后加 `'badge',`
- groups 组件 keys 整行替换为：
  `{ label: '组件', keys: ['alert', 'badge', 'button', 'input', 'modal', 'pagination', 'select', 'switch', 'tabs', 'checkbox', 'form', 'radio', 'tag', 'tooltip'] },`
- pages 数组：`{ key: 'alert', ... }` 条目后加 `{ key: 'badge', title: 'Badge 徽标数', node: <BadgePage /> },`

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`
Expected: 零输出

```bash
git add packages/components/src/badge packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/BadgePage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Badge component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2: Avatar 头像

**Files:**
- Create: `packages/components/src/avatar/{Avatar.tsx, types.ts, avatar.css, index.ts}`
- Test: `packages/components/src/avatar/Avatar.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/AvatarPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册）

**Interfaces:**
- Consumes: `cn()`
- Produces: `export const Avatar`、`export type AvatarProps`。`AvatarProps`：`src?: string`、`alt?: string`、`size?: number`（默认 32，边长 px）、`shape?: 'circle' | 'square'`（默认 'circle'）、`children?: ReactNode`（无图/加载失败时的回退内容）、`className?: string`

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/avatar/Avatar.test.tsx
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Avatar } from './Avatar';

afterEach(cleanup);

describe('Avatar', () => {
  test('渲染图片', () => {
    render(<Avatar src="/a.png" alt="头像" />);
    const img = screen.getByRole('img', { name: '头像' });
    expect(img.getAttribute('src')).toBe('/a.png');
  });

  test('图片加载失败回退到 children（Review Focus #3）', () => {
    render(
      <Avatar src="/broken.png">
        <span>张</span>
      </Avatar>,
    );
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByText('张')).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
  });

  test('size 应用到容器，square 用方角', () => {
    const { container } = render(<Avatar size={48} shape="square">Z</Avatar>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe('48px');
    expect(el.className).toContain('reef-avatar--square');
  });

  test('无 src 直接渲染回退内容', () => {
    render(<Avatar>访客</Avatar>);
    expect(screen.getByText('访客')).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Avatar'`）

- [ ] **Step 3: 实现**

```ts
// packages/components/src/avatar/types.ts
import type * as React from 'react';

export interface AvatarProps {
  /** 图片地址；加载失败回退到 children */
  src?: string;
  alt?: string;
  /** 边长（px） */
  size?: number;
  shape?: 'circle' | 'square';
  /** 无图或加载失败时的回退内容（文本/图标） */
  children?: React.ReactNode;
  className?: string;
}
```

```tsx
// packages/components/src/avatar/Avatar.tsx
import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { AvatarProps } from './types';
import './avatar.css';

export function Avatar({ src, alt, size = 32, shape = 'circle', children, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={cn('reef-avatar', `reef-avatar--${shape}`, className)}
      style={{ width: size, height: size }}
    >
      {src && !failed ? (
        <img className="reef-avatar__img" src={src} alt={alt ?? ''} onError={() => setFailed(true)} />
      ) : (
        <span className="reef-avatar__fallback">{children}</span>
      )}
    </span>
  );
}
```

```css
/* packages/components/src/avatar/avatar.css */
.reef-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: var(--reef-radius-full);
  background: color-mix(in srgb, var(--reef-color-brand) 12%, transparent);
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-brand);
  user-select: none;
}

.reef-avatar--square {
  border-radius: var(--reef-radius-md);
}

.reef-avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reef-avatar__fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

```ts
// packages/components/src/avatar/index.ts
export { Avatar } from './Avatar';
export type { AvatarProps } from './types';
```

`index.ts` 加 `export * from './avatar';`（`'./badge'` 之后字母序）；`style.css` 加 `@import url('./avatar/avatar.css');`

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS（27 + 4 = 31）

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/AvatarPage.tsx
import { Avatar } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Avatar>张</Avatar>
<Avatar src="/avatar.png" alt="头像" />
<Avatar shape="square" size={48}>访客</Avatar>`;

export function AvatarPage() {
  return (
    <>
      <h2>Avatar 头像</h2>
      <p>图片或字符头像，图片加载失败自动回退到字符内容。</p>

      <Demo title="基础用法" code={basicCode}>
        <Avatar>张</Avatar>
        <Avatar src="https://i.pravatar.cc/64?img=5" alt="头像" />
        <Avatar shape="square" size={48}>访客</Avatar>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['src', '图片地址，失败回退到 children', 'string', '—'],
          ['alt', '图片替代文本', 'string', "''"],
          ['size', '边长（px）', 'number', '32'],
          ['shape', '形状', "'circle' | 'square'", "'circle'"],
        ]}
      />
    </>
  );
}
```

App.tsx 注册：
- import：`import { AvatarPage } from './pages/AvatarPage';`（AlertPage 后、BadgePage 前）
- PageKey：`| 'alert'` 后加 `| 'avatar'`（badge 前）
- keys 数组：`'alert',` 后加 `'avatar',`
- groups 组件 keys 整行替换为：
  `{ label: '组件', keys: ['alert', 'avatar', 'badge', 'button', 'input', 'modal', 'pagination', 'select', 'switch', 'tabs', 'checkbox', 'form', 'radio', 'tag', 'tooltip'] },`
- pages：badge 条目后加 `{ key: 'avatar', title: 'Avatar 头像', node: <AvatarPage /> },`

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`（零输出）

```bash
git add packages/components/src/avatar packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/AvatarPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Avatar component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3: Card 卡片

**Files:**
- Create: `packages/components/src/card/{Card.tsx, types.ts, card.css, index.ts}`
- Test: `packages/components/src/card/Card.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/CardPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册）

**Interfaces:**
- Consumes: `cn()`
- Produces: `export const Card`、`export type CardProps`。`CardProps`：`title?: ReactNode`、`extra?: ReactNode`（标题右侧）、`footer?: ReactNode`、`bordered?: boolean`（默认 true）、`hoverable?: boolean`（默认 false）、`children?: ReactNode`、`className?: string`

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/card/Card.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Card } from './Card';

afterEach(cleanup);

describe('Card', () => {
  test('渲染标题、extra 与正文', () => {
    render(
      <Card title="订单概览" extra={<button type="button">更多</button>}>
        内容区
      </Card>,
    );
    expect(screen.getByText('订单概览')).toBeTruthy();
    expect(screen.getByRole('button', { name: '更多' })).toBeTruthy();
    expect(screen.getByText('内容区')).toBeTruthy();
  });

  test('bordered=false 不带边框修饰类', () => {
    const { container } = render(<Card bordered={false}>内容</Card>);
    expect(container.firstElementChild!.className).not.toContain('reef-card--bordered');
  });

  test('hoverable 带 hover 修饰类', () => {
    const { container } = render(<Card hoverable>内容</Card>);
    expect(container.firstElementChild!.className).toContain('reef-card--hoverable');
  });

  test('footer 渲染在正文之后', () => {
    render(<Card footer={<span>底部</span>}>内容</Card>);
    const footer = screen.getByText('底部');
    expect(footer.parentElement!.previousElementSibling!.textContent).toContain('内容');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Card'`）

- [ ] **Step 3: 实现**

```ts
// packages/components/src/card/types.ts
import type * as React from 'react';

export interface CardProps {
  title?: React.ReactNode;
  /** 标题右侧操作区 */
  extra?: React.ReactNode;
  /** 底部区域 */
  footer?: React.ReactNode;
  bordered?: boolean;
  /** 悬停时浮起 */
  hoverable?: boolean;
  children?: React.ReactNode;
  className?: string;
}
```

```tsx
// packages/components/src/card/Card.tsx
import { cn } from '@reef-ui/utils';
import type { CardProps } from './types';
import './card.css';

export function Card({ title, extra, footer, bordered = true, hoverable = false, children, className }: CardProps) {
  return (
    <div
      className={cn(
        'reef-card',
        bordered && 'reef-card--bordered',
        hoverable && 'reef-card--hoverable',
        className,
      )}
    >
      {(title != null || extra != null) && (
        <div className="reef-card__head">
          <div className="reef-card__title">{title}</div>
          {extra != null && <div className="reef-card__extra">{extra}</div>}
        </div>
      )}
      <div className="reef-card__body">{children}</div>
      {footer != null && <div className="reef-card__footer">{footer}</div>}
    </div>
  );
}
```

```css
/* packages/components/src/card/card.css */
.reef-card {
  box-sizing: border-box;
  border-radius: var(--reef-radius-lg);
  background: var(--reef-color-surface);
}

.reef-card--bordered {
  border: 1px solid color-mix(in srgb, var(--reef-color-text-primary) 12%, transparent);
}

.reef-card--hoverable {
  transition: box-shadow 0.2s ease;
}

.reef-card--hoverable:hover {
  box-shadow: 0 4px 16px rgb(0 0 0 / 10%);
}

.reef-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--reef-space-sm);
  padding: var(--reef-space-md) var(--reef-space-xl);
  border-bottom: 1px solid color-mix(in srgb, var(--reef-color-text-primary) 8%, transparent);
}

.reef-card__title {
  font-size: var(--reef-font-size-lg);
  font-weight: 600;
  color: var(--reef-color-text-primary);
}

.reef-card__extra {
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-secondary);
}

.reef-card__body {
  padding: var(--reef-space-xl);
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-primary);
}

.reef-card__footer {
  padding: var(--reef-space-md) var(--reef-space-xl);
  border-top: 1px solid color-mix(in srgb, var(--reef-color-text-primary) 8%, transparent);
}
```

```ts
// packages/components/src/card/index.ts
export { Card } from './Card';
export type { CardProps } from './types';
```

`index.ts` 加 `export * from './card';`（`'./button'` 后）；`style.css` 加 `@import url('./card/card.css');`

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS（31 + 4 = 35）

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/CardPage.tsx
import { Card } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Card
  title="订单概览"
  extra={<a href="#card">更多</a>}
  footer="共 128 条记录"
>
  卡片内容区。
</Card>`;

export function CardPage() {
  return (
    <>
      <h2>Card 卡片</h2>
      <p>承载标题、内容与操作的容器，常用于仪表盘信息分组。</p>

      <Demo title="基础用法" code={basicCode}>
        <Card title="订单概览" extra={<a href="#card">更多</a>} footer="共 128 条记录">
          卡片内容区。
        </Card>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['title', '标题', 'ReactNode', '—'],
          ['extra', '标题右侧操作区', 'ReactNode', '—'],
          ['footer', '底部区域', 'ReactNode', '—'],
          ['bordered', '是否带边框', 'boolean', 'true'],
          ['hoverable', '悬停浮起', 'boolean', 'false'],
        ]}
      />
    </>
  );
}
```

App.tsx 注册：
- import：`import { CardPage } from './pages/CardPage';`（ButtonPage 后）
- PageKey：`| 'button'` 后加 `| 'card'`
- keys 数组：`'button',` 后加 `'card',`
- groups 组件 keys 整行替换为：
  `{ label: '组件', keys: ['alert', 'avatar', 'badge', 'button', 'card', 'input', 'modal', 'pagination', 'select', 'switch', 'tabs', 'checkbox', 'form', 'radio', 'tag', 'tooltip'] },`
- pages：button 条目后加 `{ key: 'card', title: 'Card 卡片', node: <CardPage /> },`

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`（零输出）

```bash
git add packages/components/src/card packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/CardPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Card component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4: Breadcrumb 面包屑

**Files:**
- Create: `packages/components/src/breadcrumb/{Breadcrumb.tsx, types.ts, breadcrumb.css, index.ts}`
- Test: `packages/components/src/breadcrumb/Breadcrumb.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/BreadcrumbPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册）

**Interfaces:**
- Consumes: `cn()`
- Produces: `export const Breadcrumb`、`export type BreadcrumbProps, BreadcrumbItem`。`BreadcrumbItem = { key?: string; title: ReactNode; href?: string }`；`BreadcrumbProps`：`items: BreadcrumbItem[]`（必填）、`className?: string`。最后一项始终是当前页（`aria-current="page"`，有 href 也不渲染链接）；分隔符由 CSS `li + li::before` 提供

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/breadcrumb/Breadcrumb.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

const items = [
  { key: 'home', title: '首页', href: '#/' },
  { key: 'list', title: '订单管理', href: '#/orders' },
  { key: 'detail', title: '订单详情' },
];

afterEach(cleanup);

describe('Breadcrumb', () => {
  test('非最后项渲染为链接，最后一项是当前页文本', () => {
    render(<Breadcrumb items={items} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('#/');
    expect(links[1].getAttribute('href')).toBe('#/orders');

    const current = screen.getByText('订单详情');
    expect(current.getAttribute('aria-current')).toBeNull();
    expect(current.closest('li')!.getAttribute('aria-current')).toBe('page');
  });

  test('非最后项即使有 href 也带 aria-current 的只有最后一项', () => {
    render(<Breadcrumb items={items} />);
    const currents = document.querySelectorAll('[aria-current="page"]');
    expect(currents).toHaveLength(1);
  });

  test('无 href 的项渲染为纯文本', () => {
    render(<Breadcrumb items={[{ title: '仅文本' }]} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('仅文本')).toBeTruthy();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Breadcrumb'`）

- [ ] **Step 3: 实现**

```ts
// packages/components/src/breadcrumb/types.ts
import type * as React from 'react';

export interface BreadcrumbItem {
  key?: string;
  title: React.ReactNode;
  /** 有 href 渲染为链接（最后一项除外） */
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}
```

```tsx
// packages/components/src/breadcrumb/Breadcrumb.tsx
import { cn } from '@reef-ui/utils';
import type { BreadcrumbProps } from './types';
import './breadcrumb.css';

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="面包屑" className={cn('reef-breadcrumb', className)}>
      <ol className="reef-breadcrumb__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li
              key={item.key ?? i}
              className="reef-breadcrumb__item"
              aria-current={isLast ? 'page' : undefined}
            >
              {item.href && !isLast ? (
                <a className="reef-breadcrumb__link" href={item.href}>
                  {item.title}
                </a>
              ) : (
                <span>{item.title}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

```css
/* packages/components/src/breadcrumb/breadcrumb.css */
.reef-breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.reef-breadcrumb__item {
  display: inline-flex;
  align-items: center;
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-primary);
}

/* 分隔符由相邻项的伪元素提供 */
.reef-breadcrumb__item + .reef-breadcrumb__item::before {
  margin: 0 var(--reef-space-sm);
  color: var(--reef-color-text-disabled);
  content: '/';
}

.reef-breadcrumb__link {
  color: var(--reef-color-text-secondary);
  text-decoration: none;
}

.reef-breadcrumb__link:hover {
  color: var(--reef-color-brand);
  text-decoration: underline;
}
```

```ts
// packages/components/src/breadcrumb/index.ts
export { Breadcrumb } from './Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './types';
```

`index.ts` 加 `export * from './breadcrumb';`（`'./button'` 前字母序）；`style.css` 同理

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS（35 + 3 = 38）

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/BreadcrumbPage.tsx
import { Breadcrumb } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Breadcrumb
  items={[
    { key: 'home', title: '首页', href: '#/' },
    { key: 'list', title: '订单管理', href: '#/orders' },
    { key: 'detail', title: '订单详情' },
  ]}
/>`;

export function BreadcrumbPage() {
  return (
    <>
      <h2>Breadcrumb 面包屑</h2>
      <p>显示当前页面在层级结构中的位置，最后一项为当前页，分隔符由样式提供。</p>

      <Demo title="基础用法" code={basicCode}>
        <Breadcrumb
          items={[
            { key: 'home', title: '首页', href: '#/' },
            { key: 'list', title: '订单管理', href: '#/orders' },
            { key: 'detail', title: '订单详情' },
          ]}
        />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '层级数据，最后一项为当前页', "{ key?: string; title: ReactNode; href?: string }[]", '必填'],
        ]}
      />
    </>
  );
}
```

App.tsx 注册：
- import：`import { BreadcrumbPage } from './pages/BreadcrumbPage';`（BadgePage 前）
- PageKey：`| 'badge'` 后加 `| 'breadcrumb'`
- keys 数组：`'badge',` 后加 `'breadcrumb',`
- groups 组件 keys 整行替换为：
  `{ label: '组件', keys: ['alert', 'avatar', 'badge', 'breadcrumb', 'button', 'card', 'input', 'modal', 'pagination', 'select', 'switch', 'tabs', 'checkbox', 'form', 'radio', 'tag', 'tooltip'] },`
- pages：badge 条目后加 `{ key: 'breadcrumb', title: 'Breadcrumb 面包屑', node: <BreadcrumbPage /> },`

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`（零输出）

```bash
git add packages/components/src/breadcrumb packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/BreadcrumbPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Breadcrumb component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 5: Steps 步骤条

**Files:**
- Create: `packages/components/src/steps/{Steps.tsx, types.ts, steps.css, index.ts}`
- Test: `packages/components/src/steps/Steps.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/StepsPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册）

**Interfaces:**
- Consumes: `cn()`、`Icon`（`name="check"`，从 `'../icon'` 导入）
- Produces: `export const Steps`、`export type StepsProps, StepsItem`。`StepsItem = { key: string; title: ReactNode; description?: ReactNode }`；`StepsProps`：`items: StepsItem[]`（必填）、`current?: number`、`defaultCurrent?: number`（默认 0）、`onChange?: (index: number) => void`（提供后步骤可点击，整项含标题均可点）、`className?: string`。状态派生：`i < active` → finish（对勾）、`i === active` → process（aria-current="step"）、`i > current` → wait

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/steps/Steps.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Steps } from './Steps';

const items = [
  { key: 'a', title: '填写信息', description: '基本信息' },
  { key: 'b', title: '确认订单' },
  { key: 'c', title: '支付' },
];

afterEach(cleanup);

describe('Steps', () => {
  test('current=1 时第二步 process，之前步骤 finish 显示对勾', () => {
    render(<Steps items={items} defaultCurrent={1} />);

    expect(document.querySelector('.reef-steps__item--process')!.textContent).toContain('确认订单');
    expect(document.querySelector('.reef-steps__item--finish')!.textContent).toContain('填写信息');
    expect(screen.getByText('确认订单').closest('li')!.getAttribute('aria-current')).toBe('step');
  });

  test('点击步骤项触发 onChange(index)', async () => {
    const handleChange = vi.fn();
    render(<Steps items={items} defaultCurrent={0} onChange={handleChange} />);

    await userEvent.click(screen.getByText('支付'));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  test('受控模式：current 不变则点击不切换', async () => {
    const handleChange = vi.fn();
    render(<Steps items={items} current={0} onChange={handleChange} />);

    await userEvent.click(screen.getByText('支付'));
    expect(document.querySelector('.reef-steps__item--process')!.textContent).toContain('填写信息');
  });

  test('current 越界不崩溃也无 process 高亮（Review Focus #4）', () => {
    render(<Steps items={items} current={9} />);
    expect(document.querySelector('.reef-steps__item--process')).toBeNull();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Steps'`）

- [ ] **Step 3: 实现**

```ts
// packages/components/src/steps/types.ts
import type * as React from 'react';

export interface StepsItem {
  key: string;
  title: React.ReactNode;
  description?: React.ReactNode;
}

export interface StepsProps {
  items: StepsItem[];
  current?: number;
  defaultCurrent?: number;
  /** 提供后步骤可点击 */
  onChange?: (index: number) => void;
  className?: string;
}
```

```tsx
// packages/components/src/steps/Steps.tsx
import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import type { StepsProps } from './types';
import './steps.css';

export function Steps({ items, current, defaultCurrent = 0, onChange, className }: StepsProps) {
  const [inner, setInner] = useState(defaultCurrent);
  const active = current ?? inner;

  const select = (index: number) => {
    if (current === undefined) setInner(index);
    onChange?.(index);
  };

  return (
    <ol className={cn('reef-steps', className)}>
      {items.map((item, i) => {
        const status = i < active ? 'finish' : i === active ? 'process' : 'wait';
        const clickable = onChange != null && i !== active;
        return (
          <li
            key={item.key}
            className={cn('reef-steps__item', `reef-steps__item--${status}`)}
            aria-current={status === 'process' ? 'step' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onClick={clickable ? () => select(i) : undefined}
            onKeyDown={
              clickable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      select(i);
                    }
                  }
                : undefined
            }
          >
            <span className="reef-steps__head">
              {status === 'finish' ? <Icon name="check" size={14} /> : <span>{i + 1}</span>}
            </span>
            <span className="reef-steps__text">
              <span className="reef-steps__title">{item.title}</span>
              {item.description != null && (
                <span className="reef-steps__description">{item.description}</span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
```

```css
/* packages/components/src/steps/steps.css */
.reef-steps {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}

.reef-steps__item {
  display: flex;
  flex: 1;
  align-items: center;
}

.reef-steps__item:last-child {
  flex: none;
}

/* 连接线：完成后变品牌色 */
.reef-steps__item:not(:last-child)::after {
  flex: 1;
  height: 1px;
  margin: 0 var(--reef-space-sm);
  background: color-mix(in srgb, var(--reef-color-text-primary) 15%, transparent);
  content: '';
}

.reef-steps__item--finish:not(:last-child)::after {
  background: var(--reef-color-brand);
}

.reef-steps__head {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border: 1px solid color-mix(in srgb, var(--reef-color-text-primary) 25%, transparent);
  border-radius: var(--reef-radius-full);
  background: var(--reef-color-surface);
  font-size: var(--reef-font-size-sm);
  color: var(--reef-color-text-secondary);
}

.reef-steps__item--process .reef-steps__head {
  border-color: var(--reef-color-brand);
  background: var(--reef-color-brand);
  color: var(--reef-color-surface);
}

.reef-steps__item--finish .reef-steps__head {
  border-color: var(--reef-color-brand);
  color: var(--reef-color-brand);
}

.reef-steps__text {
  display: flex;
  flex-direction: column;
  margin-left: var(--reef-space-sm);
}

.reef-steps__title {
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-primary);
}

.reef-steps__item--process .reef-steps__title {
  color: var(--reef-color-brand);
  font-weight: 600;
}

.reef-steps__description {
  font-size: var(--reef-font-size-sm);
  color: var(--reef-color-text-secondary);
}

/* 可点击项：指针 + 悬停反馈 */
.reef-steps__item[tabindex='0'] {
  cursor: pointer;
}

.reef-steps__item[tabindex='0'] .reef-steps__head:hover {
  border-color: var(--reef-color-brand-hover);
  color: var(--reef-color-brand-hover);
}

.reef-steps__item[tabindex='0']:focus-visible {
  outline: 2px solid var(--reef-color-brand);
  outline-offset: 2px;
  border-radius: var(--reef-radius-sm);
}
```

注意：`.reef-steps__head:hover` 与 `.reef-steps__item[tabindex='0'] .reef-steps__head:hover` 是不同 last-compound 路径，`no-descending-specificity` 不会比对；stylelint 若对 `[tabindex='0']` 属性选择器有异议，按其提示微调顺序即可，但不得改变语义。

```ts
// packages/components/src/steps/index.ts
export { Steps } from './Steps';
export type { StepsProps, StepsItem } from './types';
```

`index.ts` 加 `export * from './steps';`（`'./select'` 后 `'./switch'` 前）；`style.css` 同理

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS（38 + 4 = 42）

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/StepsPage.tsx
import { Steps } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Steps
  defaultCurrent={1}
  items={[
    { key: 'info', title: '填写信息', description: '基本信息' },
    { key: 'confirm', title: '确认订单' },
    { key: 'pay', title: '支付' },
  ]}
/>`;

const clickableCode = `<Steps
  defaultCurrent={0}
  onChange={(index) => console.log(index)}
  items={[/* 同上 */]}
/>`;

export function StepsPage() {
  return (
    <>
      <h2>Steps 步骤条</h2>
      <p>引导用户按流程完成任务的导航，提供 onChange 时可点击跳转。</p>

      <Demo title="基础用法" code={basicCode}>
        <Steps
          defaultCurrent={1}
          items={[
            { key: 'info', title: '填写信息', description: '基本信息' },
            { key: 'confirm', title: '确认订单' },
            { key: 'pay', title: '支付' },
          ]}
        />
      </Demo>

      <Demo title="可点击" code={clickableCode}>
        <Steps
          defaultCurrent={0}
          onChange={() => {}}
          items={[
            { key: 'info', title: '填写信息', description: '基本信息' },
            { key: 'confirm', title: '确认订单' },
            { key: 'pay', title: '支付' },
          ]}
        />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '步骤配置', 'StepsItem[]', '必填'],
          ['current / defaultCurrent', '当前步骤索引（从 0 开始）', 'number', '0'],
          ['onChange', '点击步骤回调（提供后可点击）', '(index: number) => void', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 注册：
- import：`import { StepsPage } from './pages/StepsPage';`（SwitchPage 前）
- PageKey：`| 'select'` 后加 `| 'steps'`
- keys 数组：`'select',` 后加 `'steps',`
- groups 组件 keys 整行替换为：
  `{ label: '组件', keys: ['alert', 'avatar', 'badge', 'breadcrumb', 'button', 'card', 'input', 'modal', 'pagination', 'select', 'steps', 'switch', 'tabs', 'checkbox', 'form', 'radio', 'tag', 'tooltip'] },`
- pages：select 条目后加 `{ key: 'steps', title: 'Steps 步骤条', node: <StepsPage /> },`

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`（零输出）

```bash
git add packages/components/src/steps packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/StepsPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Steps component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 6: Progress 进度条

**Files:**
- Create: `packages/components/src/progress/{Progress.tsx, types.ts, progress.css, index.ts}`
- Test: `packages/components/src/progress/Progress.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/ProgressPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册）

**Interfaces:**
- Consumes: `cn()`
- Produces: `export const Progress`、`export type ProgressProps`。`ProgressProps`：`percent: number`（必填，钳制到 [0,100]）、`size?: 'small' | 'medium'`（默认 'medium'）、`status?: 'normal' | 'success' | 'error'`（默认 'normal'）、`showInfo?: boolean`（默认 true）、`className?: string`。进度条本体带 `role="progressbar"` 与 `aria-valuenow`

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/progress/Progress.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Progress } from './Progress';

afterEach(cleanup);

describe('Progress', () => {
  test('渲染填充宽度与百分比文本', () => {
    render(<Progress percent={50} />);

    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('50');
    expect(document.querySelector<HTMLElement>('.reef-progress__fill')!.style.width).toBe('50%');
    expect(screen.getByText('50%')).toBeTruthy();
  });

  test('percent 越界钳制到 [0,100]（Review Focus #2）', () => {
    const { rerender } = render(<Progress percent={150} />);
    expect(document.querySelector<HTMLElement>('.reef-progress__fill')!.style.width).toBe('100%');
    expect(screen.getByText('100%')).toBeTruthy();

    rerender(<Progress percent={-5} />);
    expect(document.querySelector<HTMLElement>('.reef-progress__fill')!.style.width).toBe('0%');
    expect(screen.getByText('0%')).toBeTruthy();
  });

  test('status=error 填充变 danger 色', () => {
    render(<Progress percent={40} status="error" />);
    expect(document.querySelector('.reef-progress__fill--error')).toBeTruthy();
  });

  test('showInfo=false 不渲染百分比文本', () => {
    render(<Progress percent={50} showInfo={false} />);
    expect(screen.queryByText('50%')).toBeNull();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Progress'`）

- [ ] **Step 3: 实现**

```ts
// packages/components/src/progress/types.ts
export interface ProgressProps {
  /** 0-100，越界钳制 */
  percent: number;
  size?: 'small' | 'medium';
  status?: 'normal' | 'success' | 'error';
  /** 是否显示右侧百分比文本 */
  showInfo?: boolean;
  className?: string;
}
```

```tsx
// packages/components/src/progress/Progress.tsx
import { cn } from '@reef-ui/utils';
import type { ProgressProps } from './types';
import './progress.css';

export function Progress({ percent, size = 'medium', status = 'normal', showInfo = true, className }: ProgressProps) {
  // 越界钳制到 [0, 100]，负数与超 100 均不产生溢出样式
  const value = Math.min(Math.max(percent, 0), 100);

  return (
    <div className={cn('reef-progress', size === 'small' && 'reef-progress--small', className)}>
      <div
        className="reef-progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div
          className={cn('reef-progress__fill', status !== 'normal' && `reef-progress__fill--${status}`)}
          style={{ width: `${value}%` }}
        />
      </div>
      {showInfo && <span className="reef-progress__info">{value}%</span>}
    </div>
  );
}
```

```css
/* packages/components/src/progress/progress.css */
.reef-progress {
  display: flex;
  align-items: center;
  gap: var(--reef-space-sm);
}

.reef-progress__track {
  flex: 1;
  height: 8px;
  overflow: hidden;
  border-radius: var(--reef-radius-full);
  background: color-mix(in srgb, var(--reef-color-text-primary) 10%, transparent);
}

.reef-progress--small .reef-progress__track {
  height: 4px;
}

.reef-progress__fill {
  height: 100%;
  border-radius: var(--reef-radius-full);
  background: var(--reef-color-brand);
  transition: width 0.3s ease;
}

.reef-progress__fill--success {
  background: var(--reef-color-success);
}

.reef-progress__fill--error {
  background: var(--reef-color-danger);
}

.reef-progress__info {
  min-width: 36px;
  font-size: var(--reef-font-size-sm);
  color: var(--reef-color-text-secondary);
  text-align: right;
}
```

```ts
// packages/components/src/progress/index.ts
export { Progress } from './Progress';
export type { ProgressProps } from './types';
```

`index.ts` 加 `export * from './progress';`（`'./pagination'` 后 `'./radio'` 前）；`style.css` 同理

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS（42 + 4 = 46）

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/ProgressPage.tsx
import { Progress } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Progress percent={60} />
<Progress percent={80} status="success" />
<Progress percent={30} status="error" />`;

const smallCode = `<Progress percent={60} size="small" showInfo={false} />`;

export function ProgressPage() {
  return (
    <>
      <h2>Progress 进度条</h2>
      <p>展示任务或上传的处理进度，percent 自动钳制到 0-100。</p>

      <Demo title="基础用法" code={basicCode}>
        <Progress percent={60} />
        <Progress percent={80} status="success" />
        <Progress percent={30} status="error" />
      </Demo>

      <Demo title="小型无文本" code={smallCode}>
        <Progress percent={60} size="small" showInfo={false} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['percent', '进度（0-100，越界钳制）', 'number', '必填'],
          ['size', '粗细', "'small' | 'medium'", "'medium'"],
          ['status', '状态色', "'normal' | 'success' | 'error'", "'normal'"],
          ['showInfo', '显示百分比文本', 'boolean', 'true'],
        ]}
      />
    </>
  );
}
```

App.tsx 注册：
- import：`import { ProgressPage } from './pages/ProgressPage.tsx';` 写作 `import { ProgressPage } from './pages/ProgressPage';`（PaginationPage 后）
- PageKey：`| 'pagination'` 后加 `| 'progress'`
- keys 数组：`'pagination',` 后加 `'progress',`
- groups 组件 keys 整行替换为：
  `{ label: '组件', keys: ['alert', 'avatar', 'badge', 'breadcrumb', 'button', 'card', 'input', 'modal', 'pagination', 'progress', 'select', 'steps', 'switch', 'tabs', 'checkbox', 'form', 'radio', 'tag', 'tooltip'] },`
- pages：pagination 条目后加 `{ key: 'progress', title: 'Progress 进度条', node: <ProgressPage /> },`

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`（零输出）

```bash
git add packages/components/src/progress packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/ProgressPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Progress component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 7: Empty 空状态

**Files:**
- Create: `packages/components/src/empty/{Empty.tsx, types.ts, empty.css, index.ts}`
- Test: `packages/components/src/empty/Empty.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/EmptyPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册）

**Interfaces:**
- Consumes: `cn()`
- Produces: `export const Empty`、`export type EmptyProps`。`EmptyProps`：`description?: ReactNode`（默认 '暂无数据'）、`children?: ReactNode`（底部操作区，如"新建"按钮）、`className?: string`

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/empty/Empty.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Empty } from './Empty';

afterEach(cleanup);

describe('Empty', () => {
  test('默认文案"暂无数据"', () => {
    render(<Empty />);
    expect(screen.getByText('暂无数据')).toBeTruthy();
  });

  test('自定义描述', () => {
    render(<Empty description="没有匹配的订单" />);
    expect(screen.getByText('没有匹配的订单')).toBeTruthy();
    expect(screen.queryByText('暂无数据')).toBeNull();
  });

  test('children 作为底部操作区渲染', () => {
    render(
      <Empty>
        <button type="button">新建订单</button>
      </Empty>,
    );
    expect(screen.getByRole('button', { name: '新建订单' })).toBeTruthy();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Empty'`）

- [ ] **Step 3: 实现**

```ts
// packages/components/src/empty/types.ts
import type * as React from 'react';

export interface EmptyProps {
  description?: React.ReactNode;
  /** 底部操作区（如"新建"按钮） */
  children?: React.ReactNode;
  className?: string;
}
```

```tsx
// packages/components/src/empty/Empty.tsx
import { cn } from '@reef-ui/utils';
import type { EmptyProps } from './types';
import './empty.css';

export function Empty({ description = '暂无数据', children, className }: EmptyProps) {
  return (
    <div className={cn('reef-empty', className)}>
      <svg className="reef-empty__art" viewBox="0 0 64 41" aria-hidden="true">
        <ellipse cx="32" cy="33" rx="14" ry="3" />
        <path d="M55 12 44 9 32 15 20 9 9 12l6 13c0 3 8 6 17 6s17-3 17-6l6-13Z" />
        <path d="M32 15v17" />
      </svg>
      <p className="reef-empty__description">{description}</p>
      {children != null && <div className="reef-empty__action">{children}</div>}
    </div>
  );
}
```

```css
/* packages/components/src/empty/empty.css */
.reef-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--reef-space-sm);
  padding: var(--reef-space-xl) 0;
}

.reef-empty__art {
  width: 64px;
  height: 41px;
  fill: none;
  stroke: color-mix(in srgb, var(--reef-color-text-disabled) 60%, transparent);
  stroke-width: 1.5;
  stroke-linejoin: round;
}

.reef-empty__description {
  margin: 0;
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-secondary);
}

.reef-empty__action {
  margin-top: var(--reef-space-xs);
}
```

```ts
// packages/components/src/empty/index.ts
export { Empty } from './Empty';
export type { EmptyProps } from './types';
```

`index.ts` 加 `export * from './empty';`（`'./button'` 后 `'./form'` 前字母序）；`style.css` 同理

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS（46 + 3 = 49）

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/EmptyPage.tsx
import { Button, Empty } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Empty />`;

const actionCode = `<Empty description="没有匹配的订单">
  <Button variant="primary">新建订单</Button>
</Empty>`;

export function EmptyPage() {
  return (
    <>
      <h2>Empty 空状态</h2>
      <p>列表或搜索结果为空时的占位提示，可附带操作入口。</p>

      <Demo title="基础用法" code={basicCode}>
        <Empty />
      </Demo>

      <Demo title="带操作" code={actionCode}>
        <Empty description="没有匹配的订单">
          <Button variant="primary">新建订单</Button>
        </Empty>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['description', '描述文案', 'ReactNode', "'暂无数据'"],
          ['children', '底部操作区', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 注册：
- import：`import { EmptyPage } from './pages/EmptyPage';`（CardPage 后）
- PageKey：`| 'card'` 后加 `| 'empty'`
- keys 数组：`'card',` 后加 `'empty',`
- groups 组件 keys 整行替换为：
  `{ label: '组件', keys: ['alert', 'avatar', 'badge', 'breadcrumb', 'button', 'card', 'empty', 'input', 'modal', 'pagination', 'progress', 'select', 'steps', 'switch', 'tabs', 'checkbox', 'form', 'radio', 'tag', 'tooltip'] },`
- pages：card 条目后加 `{ key: 'empty', title: 'Empty 空状态', node: <EmptyPage /> },`

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`（零输出）

```bash
git add packages/components/src/empty packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/EmptyPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Empty component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 8: Spin 加载中

**Files:**
- Create: `packages/components/src/spin/{Spin.tsx, types.ts, spin.css, index.ts}`
- Test: `packages/components/src/spin/Spin.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/SpinPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册）

**Interfaces:**
- Consumes: `cn()`
- Produces: `export const Spin`、`export type SpinProps`。`SpinProps`：`spinning?: boolean`（默认 true）、`size?: 'small' | 'medium' | 'large'`（默认 'medium'）、`tip?: string`（仅在包裹内容时显示）、`children?: ReactNode`（缺省时为独立加载图标；独立模式下 `spinning=false` 返回 null）、`className?: string`。加载容器带 `role="status"` 与 `aria-label`

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/spin/Spin.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Spin } from './Spin';

afterEach(cleanup);

describe('Spin', () => {
  test('独立模式渲染 status 加载图标', () => {
    render(<Spin />);
    expect(screen.getByRole('status', { name: '加载中' })).toBeTruthy();
  });

  test('独立模式 spinning=false 不渲染', () => {
    render(<Spin spinning={false} />);
    expect(screen.queryByRole('status')).toBeNull();
  });

  test('包裹内容：spinning 有遮罩和 tip，关闭后只剩内容（Review Focus #5）', () => {
    const { rerender } = render(
      <Spin spinning tip="加载中…">
        <p>表格内容</p>
      </Spin>,
    );
    expect(screen.getByText('表格内容')).toBeTruthy();
    expect(screen.getByText('加载中…')).toBeTruthy();
    expect(document.querySelector('.reef-spin__overlay')).toBeTruthy();

    rerender(
      <Spin spinning={false} tip="加载中…">
        <p>表格内容</p>
      </Spin>,
    );
    expect(screen.getByText('表格内容')).toBeTruthy();
    expect(document.querySelector('.reef-spin__overlay')).toBeNull();
    expect(screen.queryByText('加载中…')).toBeNull();
  });

  test('size 透出修饰类', () => {
    const { container } = render(<Spin size="large" />);
    expect(container.firstElementChild!.className).toContain('reef-spin--large');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Spin'`）

- [ ] **Step 3: 实现**

```ts
// packages/components/src/spin/types.ts
import type * as React from 'react';

export interface SpinProps {
  spinning?: boolean;
  size?: 'small' | 'medium' | 'large';
  /** 加载文案；仅在包裹内容时显示 */
  tip?: string;
  /** 包裹的内容；缺省时为独立加载图标 */
  children?: React.ReactNode;
  className?: string;
}
```

```tsx
// packages/components/src/spin/Spin.tsx
import { cn } from '@reef-ui/utils';
import type { SpinProps } from './types';
import './spin.css';

export function Spin({ spinning = true, size = 'medium', tip, children, className }: SpinProps) {
  if (children == null) {
    if (!spinning) return null;
    return (
      <span
        className={cn('reef-spin', `reef-spin--${size}`, 'reef-spin--standalone', className)}
        role="status"
        aria-label={tip ?? '加载中'}
      >
        <i className="reef-spin__circle" />
      </span>
    );
  }

  return (
    <div className={cn('reef-spin', `reef-spin--${size}`, className)}>
      {children}
      {spinning && (
        <div className="reef-spin__overlay" role="status" aria-label={tip ?? '加载中'}>
          <i className="reef-spin__circle" />
          {tip != null && <span className="reef-spin__tip">{tip}</span>}
        </div>
      )}
    </div>
  );
}
```

```css
/* packages/components/src/spin/spin.css */
.reef-spin {
  position: relative;
  display: inline-block;
}

.reef-spin--standalone {
  display: inline-flex;
}

.reef-spin__circle {
  display: block;
  box-sizing: border-box;
  border: 2px solid color-mix(in srgb, var(--reef-color-brand) 20%, transparent);
  border-top-color: var(--reef-color-brand);
  border-radius: var(--reef-radius-full);
  animation: reef-spin-rotate 0.8s linear infinite;
}

.reef-spin--small .reef-spin__circle {
  width: 14px;
  height: 14px;
}

.reef-spin--medium .reef-spin__circle {
  width: 20px;
  height: 20px;
}

.reef-spin--large .reef-spin__circle {
  width: 28px;
  height: 28px;
  border-width: 3px;
}

.reef-spin__overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--reef-space-sm);
  background: color-mix(in srgb, var(--reef-color-surface) 65%, transparent);
}

.reef-spin__tip {
  font-size: var(--reef-font-size-sm);
  color: var(--reef-color-text-secondary);
}

@keyframes reef-spin-rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reef-spin__circle {
    animation: none;
  }
}
```

```ts
// packages/components/src/spin/index.ts
export { Spin } from './Spin';
export type { SpinProps } from './types';
```

`index.ts` 加 `export * from './spin';`（`'./select'` 后 `'./steps'` 前字母序）；`style.css` 同理

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS（49 + 4 = 53）

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/SpinPage.tsx
import { Spin } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Spin size="small" />
<Spin />
<Spin size="large" />`;

const wrapCode = `<Spin spinning={loading} tip="加载中…">
  <div className="panel">表格内容</div>
</Spin>`;

export function SpinPage() {
  return (
    <>
      <h2>Spin 加载中</h2>
      <p>可独立使用，也可包裹内容显示加载遮罩；遵循 prefers-reduced-motion。</p>

      <Demo title="三种尺寸" code={basicCode}>
        <Spin size="small" />
        <Spin />
        <Spin size="large" />
      </Demo>

      <Demo title="包裹内容" code={wrapCode}>
        <Spin spinning tip="加载中…">
          <div style={{ padding: '24px 48px', border: '1px dashed #d1d5db' }}>表格内容</div>
        </Spin>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['spinning', '是否加载中', 'boolean', 'true'],
          ['size', '尺寸', "'small' | 'medium' | 'large'", "'medium'"],
          ['tip', '加载文案（仅包裹内容时显示）', 'string', '—'],
          ['children', '被包裹的内容', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 注册：
- import：`import { SpinPage } from './pages/SpinPage';`（StepsPage 前）
- PageKey：`| 'select'` 后加 `| 'spin'`（steps 前）
- keys 数组：`'select',` 后加 `'spin',`
- groups 组件 keys 整行替换为（最终形态）：
  `{ label: '组件', keys: ['alert', 'avatar', 'badge', 'breadcrumb', 'button', 'card', 'empty', 'input', 'modal', 'pagination', 'progress', 'select', 'spin', 'steps', 'switch', 'tabs', 'checkbox', 'form', 'radio', 'tag', 'tooltip'] },`
- pages：select 条目后加 `{ key: 'spin', title: 'Spin 加载中', node: <SpinPage /> },`

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`（零输出）

```bash
git add packages/components/src/spin packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/SpinPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Spin component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 9: 回归 + 最终审查

- [ ] **Step 1: 全量回归**

Run: `pnpm test && pnpm lint && pnpm stylelint && pnpm build`
Expected: 53/53 测试通过，lint/stylelint 零输出，turborepo 全部构建成功（含 docs）

- [ ] **Step 2: 全分支最终审查**

派发一个独立审查 subagent（最可用模型，read-only），审查范围 merge-base（执行前记录 `git rev-parse HEAD`）到 HEAD 的全部 commit。审查重点：8 个组件的受控/非受控一致性、ARIA 语义（breadcrumb nav/steps aria-current/progressbar/spin status）、stylelint 规则遵循、docs 示例与实现一致。产出报告到工作区，发现问题走一轮修复 + 范围化复审。

- [ ] **Step 3: 收尾**

汇总所有 `Ruling:` 行与 park 项，向用户报告。
