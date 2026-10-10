# 组件批次 4（遗留清理 + 8 个中小组件）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复批次 3 最终审查遗留的 6 项 Minor（M-1..M-6），并新增 8 个中小组件：Divider、Skeleton、Timeline、Result、Descriptions、Segmented、Drawer、Message，组件总数达 31。

**Architecture:** Task 0 是批次 3 的收尾清理（两项含 TDD 修复）；Task 1-8 与批次 2/3 完全同构——每组件一个目录（`X.tsx` + `types.ts` + `x.css` + `index.ts` + `X.test.tsx`）、BEM `reef-` 前缀、只用 `--reef-*` tokens、受控/非受控走 `value !== undefined ? value : inner`、每组件 2-4 个 RTL 测试 + docs 页 + App.tsx 五处注册、独立 commit。Drawer 复用 Modal 的 portal/Esc/焦点模式；Message 用受控列表（不做命令式 API）。任务串行执行，App.tsx 各处按每任务给出的锚点插入。

**Tech Stack:** React 18 + TypeScript、vitest + jsdom + @testing-library/react、stylelint-config-standard、pnpm + Turborepo。

**Spec:** 无独立 spec——本计划即规格（接口语义参考 Ant Design，实现从简）。

## Global Constraints

- 工作目录 `/home/imx/component-library`，直接在 main 上做（批次 2/3 既定做法）；**docs/ 目录永不提交**；**不要 `pkill -f vite`**（用户 dev server 在 5173）
- 目录结构固定：`packages/components/src/<name>/{X.tsx, types.ts, x.css, index.ts, X.test.tsx}`；组件目录内 `index.ts` re-export 组件与类型
- BEM 类名必须匹配 `^reef-[a-z][a-z0-9]*(__[a-z0-9-]+)?(--[a-z0-9-]+)?$`——**块名内不允许连字符，且 `__elem` 与 `--mod` 不能同时出现**（元素上的状态用 `[aria-checked='true']`、`[data-type='…']`、`:last-child` 等选择器表达）
- **stylelint 全仓库零基线**：每任务 `pnpm stylelint` 全绿。雷区：禁止链式 `:not()`（用 `:not(a, b)` 列表）、注释前空行、`flex-direction`+`flex-wrap` 合并 `flex-flow`、keyframes 名 `reef-[a-z][a-z0-9-]*`
- **新文件禁止硬编码颜色**——只用 `--reef-*` tokens + `color-mix`；唯一例外见 Task 7（Drawer 遮罩沿用 Modal 的 `rgb(0 0 0 / 45%)`，主题无关压暗层，与 modal.css 保持一致）
- keyframe 动画必须配 `@media (prefers-reduced-motion: reduce) { … animation: none }`
- 受控/非受控：`current = value !== undefined ? value : inner`；受控时不写内部 state，`onChange` 始终触发
- 每组件 2-4 个测试；测试验证真实行为（角色/文本/类名/样式），不 mock 实现细节
- 每任务一个独立 commit：Task 0 用 `fix:` 前缀，组件任务用 `feat: add <Name> component`；结尾 `Co-Authored-By: Claude Code <noreply@anthropic.com>`
- docs 页面遵循 RadioPage/SpinPage 模式（`<h2>` / `<p>` / `<Demo title code>` / `<ApiTable rows>`，从 `../docs-ui` 导入）；**示例 code 字符串必须与实际渲染的 JSX 一致，code 中不得出现未定义变量**（批次 3 M-2/M-3/M-4 的教训）
- App.tsx 注册五处：import、PageKey 联合类型、`currentPage()` keys 数组、`groups` 组件 keys、`pages` 条目——每任务给出精确锚点
- 每任务收尾 `pnpm lint && pnpm stylelint` 零输出 + `pnpm --filter @reef-ui/components test` 全绿
- 可用图标名（Icon 组件 paths 里已有的）：check, close, github, heart, layers, moon, package, plus, search, sliders, sun

## Review Focus

1. **Drawer 关闭后零残留**——`open=false` 时不得在 document.body 留下任何 DOM（遮罩/面板/事件），否则不可见层挡住页面交互。→ Task 7 步骤 1 测试断言 body 内无 `.reef-drawer`
2. **Segmented 受控不越权**——传了 `value` 时点击不得改变选中态，但 `onChange` 仍触发。→ Task 6 步骤 1 测试
3. **Message 的 onClose 携带正确的 key**——多条消息时点第 2 条关闭按钮，父级收到的必须是第 2 条的 key。→ Task 8 步骤 1 测试
4. **Descriptions 空 items 不崩溃**——`items={[]}` 渲染出标题与空 body，无异常。→ Task 5 步骤 1 测试
5. **Progress 非数值 percent 归 0**——`percent={NaN}` 不得让进度条宽度/aria-valuenow/文案出现 NaN。→ Task 0 步骤 1 测试

---

### Task 0: 批次 3 审查遗留项清理（M-1..M-6）

**Files:**
- Modify: `packages/components/src/progress/Progress.tsx:7`
- Modify: `packages/components/src/progress/Progress.test.tsx`
- Modify: `packages/components/src/steps/Steps.tsx:26`（li 属性区）
- Modify: `packages/components/src/steps/Steps.test.tsx`
- Modify: `packages/components/src/card/card.css:16`
- Modify: `apps/docs/src/pages/AvatarPage.tsx`
- Modify: `apps/docs/src/pages/StepsPage.tsx`
- Modify: `apps/docs/src/pages/SpinPage.tsx`

**Interfaces:**
- Produces: Progress 对 NaN 容错（`aria-valuenow=0`）；Steps 可点击项 `role="button"`。不改变任何已有导出签名。

- [ ] **Step 1: 写两个失败测试（M-5、M-6）**

在 `Progress.test.tsx` 追加：

```tsx
test('非数值 percent 按 0 处理，不出现 NaN（M-5）', () => {
  const { container } = render(<Progress percent={NaN} />);
  const bar = container.querySelector('.reef-progress__track')!;
  expect(bar.getAttribute('aria-valuenow')).toBe('0');
  expect(container.textContent).not.toContain('NaN');
});
```

在 `Steps.test.tsx` 追加（`STEPS`/现成 items 常量若已有则复用；否则用下面内联数组）：

```tsx
test('可点击项带 button 角色，当前项没有（M-6）', () => {
  render(
    <Steps
      current={0}
      onChange={() => {}}
      items={[
        { key: 'a', title: '填写信息' },
        { key: 'b', title: '确认订单' },
      ]}
    />,
  );
  expect(screen.getByRole('button', { name: '确认订单' })).toBeTruthy();
  expect(screen.queryByRole('button', { name: '填写信息' })).toBeNull();
});
```

注意：`getByRole('button', { name: '确认订单' })` 依赖 li 的可访问名称来自内容文本；若 Steps.test.tsx 现有常量形状不同，以 `packages/components/src/steps/types.ts` 为准调整字面量，断言语句不变。

- [ ] **Step 2: 跑测试确认 RED**

Run: `pnpm --filter @reef-ui/components test -- progress steps`
Expected: 恰好 2 个新用例 FAIL——Progress 报 `aria-valuenow` 为 `"NaN"`；Steps 报 `getByRole('button')` 找不到。

- [ ] **Step 3: 修复实现（M-5、M-6）**

`Progress.tsx` 第 6-7 行改为：

```tsx
  // 越界钳制到 [0, 100]；非数值（NaN 等）按 0 处理
  const value = Math.min(Math.max(Number.isFinite(percent) ? percent : 0, 0), 100);
```

`Steps.tsx` 的 li 上（`tabIndex` 行之前）加一行：

```tsx
            role={clickable ? 'button' : undefined}
```

- [ ] **Step 4: 跑测试确认 GREEN**

Run: `pnpm --filter @reef-ui/components test`
Expected: 全绿（此时 56/56，16 文件）。

- [ ] **Step 5: 修 4 处外观/文档遗留（M-1、M-2、M-3、M-4，无行为变更不写测试）**

- M-1 `card.css:16`：`box-shadow: 0 4px 16px rgb(0 0 0 / 10%);` → `box-shadow: 0 4px 16px color-mix(in srgb, var(--reef-color-text-primary) 10%, transparent);`
- M-2 `AvatarPage.tsx`：code 字符串第 5 行 `src="/avatar.png"` → `src="https://i.pravatar.cc/64?img=5"`，与 JSX 一致
- M-3 `StepsPage.tsx`：`clickableCode` 改为与 JSX 完全一致的完整代码：

```tsx
const clickableCode = `<Steps
  defaultCurrent={0}
  onChange={(index) => console.log(index)}
  items={[
    { key: 'info', title: '填写信息', description: '基本信息' },
    { key: 'confirm', title: '确认订单' },
    { key: 'pay', title: '支付' },
  ]}
/>`;
```

同时 JSX 的 `onChange={() => {}}` → `onChange={(index) => console.log(index)}`，两边一致。
- M-4 `SpinPage.tsx`：顶部改 `import { useState } from 'react';`、`import { Button, Spin } from '@reef-ui/components';`，组件函数内加 `const [loading, setLoading] = useState(true);`，「包裹内容」Demo 改为：

```tsx
      <Demo title="包裹内容" code={wrapCode}>
        <p style={{ marginBottom: 12 }}>
          <Button onClick={() => setLoading(!loading)}>{loading ? '停止加载' : '开始加载'}</Button>
        </p>
        <Spin spinning={loading} tip="加载中…">
          <div style={{ padding: '24px 48px', border: '1px dashed color-mix(in srgb, var(--reef-color-text-primary) 15%, transparent)' }}>
            表格内容
          </div>
        </Spin>
      </Demo>
```

（`wrapCode` 字符串本身不变；原先的硬编码 `#d1d5db` 一并消除。）

- [ ] **Step 6: 门禁 + 提交**

Run: `pnpm lint && pnpm stylelint && pnpm --filter @reef-ui/components test`
Expected: 零输出 / 全绿 56/56。

```bash
git add packages/components apps/docs/src/pages
git commit -m "fix: 批次 3 审查遗留项（Progress NaN、Steps role、示例一致性、shadow token）

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

（不要把 `docs/` 下任何文件加进来。）

---

### Task 1: Divider 分割线

**Files:**
- Create: `packages/components/src/divider/{Divider.tsx,types.ts,divider.css,index.ts,Divider.test.tsx}`
- Modify: `packages/components/src/index.ts`（按字母序加 divider 导出，与相邻条目同格式）、`packages/components/src/style.css`（`@import './card/card.css';` 之后插 `@import './divider/divider.css';`）、`apps/docs/src/App.tsx` 五处、新建 `apps/docs/src/pages/DividerPage.tsx`

**Interfaces:**
- Produces: `export function Divider(props: DividerProps)`；`DividerProps { vertical?: boolean; dashed?: boolean; children?: ReactNode; className?: string }`

- [ ] **Step 1: 写失败测试**

```tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Divider } from './Divider';

afterEach(cleanup);

describe('Divider', () => {
  test('渲染文字标签', () => {
    render(<Divider>中间文字</Divider>);
    expect(screen.getByText('中间文字')).toBeTruthy();
  });

  test('vertical 渲染竖线类名，无文字', () => {
    const { container } = render(<Divider vertical />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('reef-divider--vertical');
    expect(el.className).not.toContain('reef-divider--dashed');
  });

  test('dashed 加虚线类名', () => {
    const { container } = render(<Divider dashed />);
    expect((container.firstElementChild as HTMLElement).className).toContain('reef-divider--dashed');
  });
});
```

- [ ] **Step 2: 确认 RED**

Run: `pnpm --filter @reef-ui/components test -- divider`
Expected: FAIL，`Cannot find module './Divider'`。

- [ ] **Step 3: 实现**

`types.ts`:

```ts
import type { ReactNode } from 'react';

export interface DividerProps {
  /** 垂直分割线 */
  vertical?: boolean;
  /** 虚线样式 */
  dashed?: boolean;
  /** 分割线文字 */
  children?: ReactNode;
  className?: string;
}
```

`Divider.tsx`:

```tsx
import { cn } from '@reef-ui/utils';
import type { DividerProps } from './types';
import './divider.css';

export function Divider({ vertical, dashed, children, className }: DividerProps) {
  if (vertical) {
    return <span className={cn('reef-divider', 'reef-divider--vertical', className)} />;
  }
  return (
    <div className={cn('reef-divider', dashed && 'reef-divider--dashed', className)}>
      {children && <span className="reef-divider__inner">{children}</span>}
    </div>
  );
}
```

`divider.css`:

```css
.reef-divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
  font-size: var(--reef-font-size-sm);
  color: var(--reef-color-text-secondary);
}

.reef-divider::before,
.reef-divider::after {
  flex: 1;
  height: 1px;
  content: '';
  background: color-mix(in srgb, var(--reef-color-text-primary) 12%, transparent);
}

.reef-divider--dashed::before,
.reef-divider--dashed::after {
  height: 0;
  border-top: 1px dashed color-mix(in srgb, var(--reef-color-text-primary) 20%, transparent);
  background: none;
}

.reef-divider--vertical {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin: 0 8px;
  vertical-align: middle;
  background: color-mix(in srgb, var(--reef-color-text-primary) 12%, transparent);
}

.reef-divider--vertical::before,
.reef-divider--vertical::after {
  content: none;
}

.reef-divider__inner {
  padding: 0 12px;
}
```

`index.ts`:

```ts
export { Divider } from './Divider';
export type { DividerProps } from './types';
```

- [ ] **Step 4: 确认 GREEN**

Run: `pnpm --filter @reef-ui/components test -- divider`
Expected: PASS 3/3。

- [ ] **Step 5: 导出 + docs 页 + App.tsx 注册**

`src/index.ts` 按字母序加 divider 导出；`src/style.css` 加 `@import './divider/divider.css';`（card 之后）。

新建 `apps/docs/src/pages/DividerPage.tsx`:

```tsx
import { Button, Divider } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `内容上方
<Divider>中间文字</Divider>
内容下方`;

const dashedCode = `<Divider dashed />`;

const verticalCode = `<Button>左侧</Button>
<Divider vertical />
<Button>右侧</Button>`;

export function DividerPage() {
  return (
    <>
      <h2>Divider 分割线</h2>
      <p>水平或垂直分割线，水平线可带文字。</p>

      <Demo title="基础用法" code={basicCode}>
        <div>内容上方</div>
        <Divider>中间文字</Divider>
        <div>内容下方</div>
      </Demo>

      <Demo title="虚线" code={dashedCode}>
        <Divider dashed />
      </Demo>

      <Demo title="垂直分割线" code={verticalCode}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button>左侧</Button>
          <Divider vertical />
          <Button>右侧</Button>
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['vertical', '是否垂直分割线', 'boolean', 'false'],
          ['dashed', '是否虚线', 'boolean', 'false'],
          ['children', '水平线的文字内容', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 五处（锚点均为当前文件内容）：
1. import：`import { CardPage } from './pages/CardPage';` 行后加 `import { DividerPage } from './pages/DividerPage';`
2. PageKey：`  | 'card'` 行后加 `  | 'divider'`
3. currentPage keys：`    'card',` 行后加 `    'divider',`
4. groups 组件 keys：单行内 `'card'` 后插入 `'divider'`（逗号分隔）
5. pages：`{ key: 'card', ... }` 行后加 `{ key: 'divider', title: 'Divider 分割线', node: <DividerPage /> },`

- [ ] **Step 6: 门禁 + 提交**

Run: `pnpm lint && pnpm stylelint && pnpm --filter @reef-ui/components test`
Expected: 零输出 / 全绿 59/59。

```bash
git add packages/components apps/docs/src
git commit -m "feat: add Divider component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2: Skeleton 骨架屏

**Files:**
- Create: `packages/components/src/skeleton/{Skeleton.tsx,types.ts,skeleton.css,index.ts,Skeleton.test.tsx}`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`（divider 之后插 `@import './skeleton/skeleton.css';`）、`apps/docs/src/App.tsx`、新建 `apps/docs/src/pages/SkeletonPage.tsx`

**Interfaces:**
- Produces: `export function Skeleton(props: SkeletonProps)`；`SkeletonProps { loading?: boolean; avatar?: boolean; rows?: number; children?: ReactNode; className?: string }`（loading 默认 true，rows 默认 3）

- [ ] **Step 1: 写失败测试**

```tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Skeleton } from './Skeleton';

afterEach(cleanup);

describe('Skeleton', () => {
  test('loading 时按 rows 渲染骨架行，不渲染 children', () => {
    const { container } = render(<Skeleton rows={2}>真实内容</Skeleton>);
    expect(container.querySelectorAll('.reef-skeleton__row')).toHaveLength(2);
    expect(screen.queryByText('真实内容')).toBeNull();
  });

  test('loading=false 只渲染 children', () => {
    const { container } = render(
      <Skeleton loading={false}>
        <p>已加载</p>
      </Skeleton>,
    );
    expect(screen.getByText('已加载')).toBeTruthy();
    expect(container.querySelector('.reef-skeleton')).toBeNull();
  });

  test('avatar 开关渲染头像块', () => {
    const { container } = render(<Skeleton avatar rows={1} />);
    expect(container.querySelector('.reef-skeleton__avatar')).toBeTruthy();
  });
});
```

- [ ] **Step 2: 确认 RED**

Run: `pnpm --filter @reef-ui/components test -- skeleton`
Expected: FAIL，`Cannot find module './Skeleton'`。

- [ ] **Step 3: 实现**

`types.ts`:

```ts
import type { ReactNode } from 'react';

export interface SkeletonProps {
  /** 是否加载中；false 时渲染 children */
  loading?: boolean;
  /** 是否显示头像占位 */
  avatar?: boolean;
  /** 占位行数 */
  rows?: number;
  /** 加载完成的真实内容 */
  children?: ReactNode;
  className?: string;
}
```

`Skeleton.tsx`:

```tsx
import { cn } from '@reef-ui/utils';
import type { SkeletonProps } from './types';
import './skeleton.css';

export function Skeleton({ loading = true, avatar, rows = 3, children, className }: SkeletonProps) {
  if (!loading) return <>{children}</>;

  return (
    <div className={cn('reef-skeleton', className)}>
      {avatar && <span className="reef-skeleton__avatar" />}
      <div className="reef-skeleton__rows">
        {Array.from({ length: rows }, (_, i) => (
          <span key={i} className="reef-skeleton__row" />
        ))}
      </div>
    </div>
  );
}
```

`skeleton.css`（末行 60% 宽用 `:last-child`，不引入 elem--mod 类）:

```css
.reef-skeleton {
  display: flex;
  gap: 12px;
}

.reef-skeleton__avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--reef-radius-full);
  background: color-mix(in srgb, var(--reef-color-text-primary) 8%, transparent);
  animation: reef-skeleton-shimmer 1.4s ease infinite;
}

.reef-skeleton__rows {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
}

.reef-skeleton__row {
  height: 16px;
  border-radius: var(--reef-radius-sm);
  background: color-mix(in srgb, var(--reef-color-text-primary) 8%, transparent);
  animation: reef-skeleton-shimmer 1.4s ease infinite;
}

.reef-skeleton__row:last-child {
  width: 60%;
}

@keyframes reef-skeleton-shimmer {
  50% {
    opacity: 0.5;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reef-skeleton__avatar,
  .reef-skeleton__row {
    animation: none;
  }
}
```

`index.ts`:

```ts
export { Skeleton } from './Skeleton';
export type { SkeletonProps } from './types';
```

- [ ] **Step 4: 确认 GREEN**

Run: `pnpm --filter @reef-ui/components test -- skeleton`
Expected: PASS 3/3。

- [ ] **Step 5: 导出 + docs + App.tsx**

`src/index.ts` / `style.css` 按字母序加 skeleton（style.css 里在 divider 与 spin 之间）。

新建 `apps/docs/src/pages/SkeletonPage.tsx`:

```tsx
import { Button, Skeleton } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';
import { useState } from 'react';

const basicCode = `<Skeleton rows={3} />`;

const avatarCode = `<Skeleton avatar rows={2} />`;

const loadCode = `<Skeleton loading={loading} rows={2}>
  <p>加载完成的内容</p>
</Skeleton>`;

export function SkeletonPage() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <h2>Skeleton 骨架屏</h2>
      <p>内容加载前的占位示意，loading 为 false 时渲染真实内容。</p>

      <Demo title="基础用法" code={basicCode}>
        <Skeleton rows={3} />
      </Demo>

      <Demo title="带头像" code={avatarCode}>
        <Skeleton avatar rows={2} />
      </Demo>

      <Demo title="切换加载状态" code={loadCode}>
        <div>
          <p style={{ marginBottom: 12 }}>
            <Button onClick={() => setLoading(!loading)}>{loading ? '停止加载' : '开始加载'}</Button>
          </p>
          <Skeleton loading={loading} rows={2}>
            <p>加载完成的内容</p>
          </Skeleton>
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['loading', '是否加载中，false 时渲染 children', 'boolean', 'true'],
          ['avatar', '是否显示头像占位', 'boolean', 'false'],
          ['rows', '占位行数', 'number', '3'],
          ['children', '加载完成的真实内容', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 五处：import 在 `import { SelectPage } from './pages/SelectPage';` 行后加 `import { SkeletonPage } from './pages/SkeletonPage';`；PageKey 在 `  | 'select'` 行后加 `  | 'skeleton'`；currentPage keys 在 `    'select',` 行后加 `    'skeleton',`；groups keys 里 `'select'` 后插 `'skeleton'`；pages 在 select 条目行后加 `{ key: 'skeleton', title: 'Skeleton 骨架屏', node: <SkeletonPage /> },`。

- [ ] **Step 6: 门禁 + 提交**

Run: `pnpm lint && pnpm stylelint && pnpm --filter @reef-ui/components test`
Expected: 零输出 / 全绿 62/62。

```bash
git add packages/components apps/docs/src
git commit -m "feat: add Skeleton component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3: Timeline 时间轴

**Files:**
- Create: `packages/components/src/timeline/{Timeline.tsx,types.ts,timeline.css,index.ts,Timeline.test.tsx}`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`、`apps/docs/src/App.tsx`、新建 `apps/docs/src/pages/TimelinePage.tsx`

**Interfaces:**
- Produces: `export function Timeline(props: TimelineProps)`；`TimelineItem { key?: string; content: ReactNode; dot?: ReactNode }`；`TimelineProps { items: TimelineItem[]; className?: string }`

- [ ] **Step 1: 写失败测试**

```tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Timeline } from './Timeline';

afterEach(cleanup);

describe('Timeline', () => {
  test('按序渲染全部内容', () => {
    render(
      <Timeline
        items={[
          { key: 'a', content: '创建订单' },
          { key: 'b', content: '支付成功' },
          { key: 'c', content: '已发货' },
        ]}
      />,
    );
    const items = document.querySelectorAll('.reef-timeline__item');
    expect(items).toHaveLength(3);
    expect(screen.getByText('创建订单')).toBeTruthy();
    expect(screen.getByText('已发货')).toBeTruthy();
  });

  test('自定义 dot 替换默认圆点', () => {
    render(
      <Timeline items={[{ key: 'a', content: '标签', dot: <b className="my-dot">!</b> }]} />,
    );
    expect(document.querySelector('.my-dot')).toBeTruthy();
    expect(document.querySelector('.reef-timeline__dot')).toBeNull();
  });

  test('默认渲染圆点元素', () => {
    render(<Timeline items={[{ key: 'a', content: '节点' }]} />);
    expect(document.querySelector('.reef-timeline__dot')).toBeTruthy();
  });
});
```

- [ ] **Step 2: 确认 RED**

Run: `pnpm --filter @reef-ui/components test -- timeline`
Expected: FAIL，`Cannot find module './Timeline'`。

- [ ] **Step 3: 实现**

`types.ts`:

```ts
import type { ReactNode } from 'react';

export interface TimelineItem {
  key?: string;
  /** 节点内容 */
  content: ReactNode;
  /** 自定义节点圆点 */
  dot?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}
```

`Timeline.tsx`:

```tsx
import { cn } from '@reef-ui/utils';
import type { TimelineProps } from './types';
import './timeline.css';

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ul className={cn('reef-timeline', className)}>
      {items.map((item, i) => (
        <li key={item.key ?? i} className="reef-timeline__item">
          <span className="reef-timeline__head">{item.dot ?? <span className="reef-timeline__dot" />}</span>
          <div className="reef-timeline__content">{item.content}</div>
        </li>
      ))}
    </ul>
  );
}
```

`timeline.css`:

```css
.reef-timeline {
  margin: 0;
  padding: 0;
  list-style: none;
}

.reef-timeline__item {
  position: relative;
  padding: 0 0 20px 20px;
}

.reef-timeline__item:last-child {
  padding-bottom: 0;
}

.reef-timeline__item::before {
  position: absolute;
  top: 6px;
  bottom: 0;
  left: 5px;
  width: 1px;
  content: '';
  background: color-mix(in srgb, var(--reef-color-text-primary) 12%, transparent);
}

.reef-timeline__item:last-child::before {
  content: none;
}

.reef-timeline__head {
  position: absolute;
  top: 4px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reef-timeline__dot {
  display: block;
  width: 11px;
  height: 11px;
  border-radius: var(--reef-radius-full);
  background: var(--reef-color-brand);
}
```

`index.ts`:

```ts
export { Timeline } from './Timeline';
export type { TimelineProps, TimelineItem } from './types';
```

- [ ] **Step 4: 确认 GREEN**

Run: `pnpm --filter @reef-ui/components test -- timeline`
Expected: PASS 3/3。

- [ ] **Step 5: 导出 + docs + App.tsx**

新建 `apps/docs/src/pages/TimelinePage.tsx`:

```tsx
import { Timeline } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Timeline
  items={[
    { key: 'a', content: '创建订单' },
    { key: 'b', content: '支付成功' },
    { key: 'c', content: '已发货' },
  ]}
/>`;

const dotCode = `<Timeline
  items={[
    { key: 'a', content: '关键节点', dot: <b>!</b> },
    { key: 'b', content: '普通节点' },
  ]}
/>`;

export function TimelinePage() {
  return (
    <>
      <h2>Timeline 时间轴</h2>
      <p>垂直时间轴，按序展示一系列节点。</p>

      <Demo title="基础用法" code={basicCode}>
        <Timeline
          items={[
            { key: 'a', content: '创建订单' },
            { key: 'b', content: '支付成功' },
            { key: 'c', content: '已发货' },
          ]}
        />
      </Demo>

      <Demo title="自定义节点" code={dotCode}>
        <Timeline
          items={[
            { key: 'a', content: '关键节点', dot: <b>!</b> },
            { key: 'b', content: '普通节点' },
          ]}
        />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '节点配置（content 必填）', 'TimelineItem[]', '必填'],
          ['items[].dot', '自定义节点圆点', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 五处：import 在 `import { SwitchPage } from './pages/SwitchPage';` 行后加 `import { TimelinePage } from './pages/TimelinePage';`；PageKey 在 `  | 'switch'` 行后加 `  | 'timeline'`；currentPage keys 在 `    'switch',` 行后加 `    'timeline',`；groups keys 里 `'switch'` 后插 `'timeline'`；pages 在 switch 条目行后加 `{ key: 'timeline', title: 'Timeline 时间轴', node: <TimelinePage /> },`。

- [ ] **Step 6: 门禁 + 提交**

Run: `pnpm lint && pnpm stylelint && pnpm --filter @reef-ui/components test`
Expected: 零输出 / 全绿 65/65。

```bash
git add packages/components apps/docs/src
git commit -m "feat: add Timeline component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4: Result 结果页

**Files:**
- Create: `packages/components/src/result/{Result.tsx,types.ts,result.css,index.ts,Result.test.tsx}`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`、`apps/docs/src/App.tsx`、新建 `apps/docs/src/pages/ResultPage.tsx`

**Interfaces:**
- Produces: `export function Result(props: ResultProps)`；`ResultProps { status?: 'success' | 'error' | 'warning' | 'info'; icon?: ReactNode; title?: ReactNode; subTitle?: ReactNode; extra?: ReactNode; className?: string }`（status 默认 'info'；success→check 图标、error→close 图标、其余显示 `!`，可用 icon 覆盖）

- [ ] **Step 1: 写失败测试**

```tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Result } from './Result';

afterEach(cleanup);

describe('Result', () => {
  test('渲染标题与副标题', () => {
    render(<Result status="success" title="提交成功" subTitle="审核将在 1 个工作日内完成" />);
    expect(screen.getByText('提交成功')).toBeTruthy();
    expect(screen.getByText('审核将在 1 个工作日内完成')).toBeTruthy();
  });

  test('status 类名生效，icon 可覆盖默认图标', () => {
    const { container } = render(<Result status="error" icon={<b className="my-icon">x</b>} title="失败" />);
    expect((container.firstElementChild as HTMLElement).className).toContain('reef-result--error');
    expect(container.querySelector('.my-icon')).toBeTruthy();
    expect(container.querySelector('.reef-result__icon svg')).toBeNull();
  });

  test('extra 渲染操作区', () => {
    render(<Result title="完成" extra={<button type="button">返回首页</button>} />);
    expect(screen.getByText('返回首页')).toBeTruthy();
  });
});
```

- [ ] **Step 2: 确认 RED**

Run: `pnpm --filter @reef-ui/components test -- result`
Expected: FAIL，`Cannot find module './Result'`。

- [ ] **Step 3: 实现**

`types.ts`:

```ts
import type { ReactNode } from 'react';

export interface ResultProps {
  /** 结果状态，决定图标与配色 */
  status?: 'success' | 'error' | 'warning' | 'info';
  /** 覆盖默认图标 */
  icon?: ReactNode;
  title?: ReactNode;
  subTitle?: ReactNode;
  /** 操作区 */
  extra?: ReactNode;
  className?: string;
}
```

`Result.tsx`:

```tsx
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import type { ResultProps } from './types';
import './result.css';

export function Result({ status = 'info', icon, title, subTitle, extra, className }: ResultProps) {
  const defaultIcon =
    status === 'success' ? <Icon name="check" size={22} /> : status === 'error' ? <Icon name="close" size={22} /> : '!';
  return (
    <div className={cn('reef-result', `reef-result--${status}`, className)}>
      <div className="reef-result__icon" aria-hidden>
        {icon ?? defaultIcon}
      </div>
      {title != null && <div className="reef-result__title">{title}</div>}
      {subTitle != null && <div className="reef-result__sub">{subTitle}</div>}
      {extra != null && <div className="reef-result__extra">{extra}</div>}
    </div>
  );
}
```

`result.css`:

```css
.reef-result {
  padding: var(--reef-space-xl) var(--reef-space-lg);
  text-align: center;
}

.reef-result__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin: 0 auto var(--reef-space-md);
  border-radius: var(--reef-radius-full);
  font-size: var(--reef-font-size-lg);
  font-weight: 600;
}

.reef-result--success .reef-result__icon {
  color: var(--reef-color-success);
  background: color-mix(in srgb, var(--reef-color-success) 12%, transparent);
}

.reef-result--error .reef-result__icon {
  color: var(--reef-color-danger);
  background: color-mix(in srgb, var(--reef-color-danger) 12%, transparent);
}

.reef-result--warning .reef-result__icon {
  color: var(--reef-color-warning);
  background: color-mix(in srgb, var(--reef-color-warning) 12%, transparent);
}

.reef-result--info .reef-result__icon {
  color: var(--reef-color-brand);
  background: color-mix(in srgb, var(--reef-color-brand) 12%, transparent);
}

.reef-result__title {
  font-size: var(--reef-font-size-lg);
  font-weight: 600;
  color: var(--reef-color-text-primary);
}

.reef-result__sub {
  margin-top: var(--reef-space-xs);
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-secondary);
}

.reef-result__extra {
  margin-top: var(--reef-space-lg);
}
```

`index.ts`:

```ts
export { Result } from './Result';
export type { ResultProps } from './types';
```

- [ ] **Step 4: 确认 GREEN**

Run: `pnpm --filter @reef-ui/components test -- result`
Expected: PASS 3/3。

- [ ] **Step 5: 导出 + docs + App.tsx**

新建 `apps/docs/src/pages/ResultPage.tsx`:

```tsx
import { Button, Result } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const successCode = `<Result
  status="success"
  title="提交成功"
  subTitle="审核将在 1 个工作日内完成"
  extra={<Button>返回列表</Button>}
/>`;

const errorCode = `<Result status="error" title="提交失败" subTitle="网络异常，请稍后重试" />`;

export function ResultPage() {
  return (
    <>
      <h2>Result 结果页</h2>
      <p>操作结果的反馈页面，成功、失败、警告、提示四种状态。</p>

      <Demo title="成功" code={successCode}>
        <Result
          status="success"
          title="提交成功"
          subTitle="审核将在 1 个工作日内完成"
          extra={<Button>返回列表</Button>}
        />
      </Demo>

      <Demo title="失败" code={errorCode}>
        <Result status="error" title="提交失败" subTitle="网络异常，请稍后重试" />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['status', '结果状态', "'success' | 'error' | 'warning' | 'info'", "'info'"],
          ['icon', '覆盖默认图标', 'ReactNode', '—'],
          ['title', '标题', 'ReactNode', '—'],
          ['subTitle', '副标题', 'ReactNode', '—'],
          ['extra', '操作区', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 五处：import 在 `import { ProgressPage } from './pages/ProgressPage';` 行后加 `import { ResultPage } from './pages/ResultPage';`；PageKey 在 `  | 'progress'` 行后加 `  | 'result'`；currentPage keys 在 `    'progress',` 行后加 `    'result',`；groups keys 里 `'progress'` 后插 `'result'`；pages 在 progress 条目行后加 `{ key: 'result', title: 'Result 结果页', node: <ResultPage /> },`。

- [ ] **Step 6: 门禁 + 提交**

Run: `pnpm lint && pnpm stylelint && pnpm --filter @reef-ui/components test`
Expected: 零输出 / 全绿 68/68。

```bash
git add packages/components apps/docs/src
git commit -m "feat: add Result component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 5: Descriptions 描述列表

**Files:**
- Create: `packages/components/src/descriptions/{Descriptions.tsx,types.ts,descriptions.css,index.ts,Descriptions.test.tsx}`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`、`apps/docs/src/App.tsx`、新建 `apps/docs/src/pages/DescriptionsPage.tsx`

**Interfaces:**
- Produces: `export function Descriptions(props: DescriptionsProps)`；`DescriptionsItem { key: string; label: ReactNode; children: ReactNode }`；`DescriptionsProps { items: DescriptionsItem[]; column?: number; bordered?: boolean; title?: ReactNode; className?: string }`（column 默认 3）

- [ ] **Step 1: 写失败测试（含 Review Focus #4）**

```tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Descriptions } from './Descriptions';

afterEach(cleanup);

const ITEMS = [
  { key: 'name', label: '用户名', children: '张三' },
  { key: 'role', label: '角色', children: '管理员' },
];

describe('Descriptions', () => {
  test('渲染全部 label 与值', () => {
    render(<Descriptions items={ITEMS} />);
    expect(screen.getByText('用户名')).toBeTruthy();
    expect(screen.getByText('张三')).toBeTruthy();
    expect(screen.getByText('管理员')).toBeTruthy();
  });

  test('column 生效到 grid 列数，bordered 加类名', () => {
    const { container } = render(<Descriptions items={ITEMS} column={2} bordered />);
    const body = container.querySelector('.reef-descriptions__body') as HTMLElement;
    expect(body.style.gridTemplateColumns).toContain('2');
    expect((container.firstElementChild as HTMLElement).className).toContain('reef-descriptions--bordered');
  });

  test('空 items 只渲染标题与空 body，不崩溃（Review Focus #4）', () => {
    const { container } = render(<Descriptions items={[]} title="详情" />);
    expect(screen.getByText('详情')).toBeTruthy();
    expect(container.querySelector('.reef-descriptions__item')).toBeNull();
  });
});
```

- [ ] **Step 2: 确认 RED**

Run: `pnpm --filter @reef-ui/components test -- descriptions`
Expected: FAIL，`Cannot find module './Descriptions'`。

- [ ] **Step 3: 实现**

`types.ts`:

```ts
import type { ReactNode } from 'react';

export interface DescriptionsItem {
  key: string;
  label: ReactNode;
  children: ReactNode;
}

export interface DescriptionsProps {
  items: DescriptionsItem[];
  /** 列数 */
  column?: number;
  /** 是否带边框 */
  bordered?: boolean;
  title?: ReactNode;
  className?: string;
}
```

`Descriptions.tsx`:

```tsx
import { cn } from '@reef-ui/utils';
import type { DescriptionsProps } from './types';
import './descriptions.css';

export function Descriptions({ items, column = 3, bordered, title, className }: DescriptionsProps) {
  return (
    <div className={cn('reef-descriptions', bordered && 'reef-descriptions--bordered', className)}>
      {title != null && <div className="reef-descriptions__title">{title}</div>}
      <dl
        className="reef-descriptions__body"
        style={{ gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))` }}
      >
        {items.map((item) => (
          <div key={item.key} className="reef-descriptions__item">
            <dt className="reef-descriptions__label">{item.label}</dt>
            <dd className="reef-descriptions__value">{item.children}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
```

`descriptions.css`:

```css
.reef-descriptions__title {
  margin-bottom: var(--reef-space-md);
  font-size: var(--reef-font-size-lg);
  font-weight: 600;
  color: var(--reef-color-text-primary);
}

.reef-descriptions__body {
  display: grid;
  gap: var(--reef-space-sm) var(--reef-space-lg);
  margin: 0;
}

.reef-descriptions__item {
  display: flex;
  gap: var(--reef-space-sm);
}

.reef-descriptions__label {
  flex-shrink: 0;
  color: var(--reef-color-text-secondary);
}

.reef-descriptions__value {
  margin: 0;
  color: var(--reef-color-text-primary);
}

.reef-descriptions--bordered .reef-descriptions__item {
  padding: var(--reef-space-sm) var(--reef-space-md);
  border: 1px solid color-mix(in srgb, var(--reef-color-text-primary) 12%, transparent);
  border-radius: var(--reef-radius-sm);
}
```

`index.ts`:

```ts
export { Descriptions } from './Descriptions';
export type { DescriptionsProps, DescriptionsItem } from './types';
```

- [ ] **Step 4: 确认 GREEN**

Run: `pnpm --filter @reef-ui/components test -- descriptions`
Expected: PASS 3/3。

- [ ] **Step 5: 导出 + docs + App.tsx**

新建 `apps/docs/src/pages/DescriptionsPage.tsx`:

```tsx
import { Descriptions } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const items = [
  { key: 'name', label: '用户名', children: '张三' },
  { key: 'role', label: '角色', children: '管理员' },
  { key: 'email', label: '邮箱', children: 'zhang@example.com' },
  { key: 'city', label: '城市', children: '杭州' },
];

const basicCode = `<Descriptions
  title="用户详情"
  items={[
    { key: 'name', label: '用户名', children: '张三' },
    { key: 'role', label: '角色', children: '管理员' },
    { key: 'email', label: '邮箱', children: 'zhang@example.com' },
    { key: 'city', label: '城市', children: '杭州' },
  ]}
/>`;

const borderedCode = `<Descriptions bordered column={2} items={items} />`;

export function DescriptionsPage() {
  return (
    <>
      <h2>Descriptions 描述列表</h2>
      <p>成组展示只读字段，常用于详情页。</p>

      <Demo title="基础用法" code={basicCode}>
        <Descriptions title="用户详情" items={items} />
      </Demo>

      <Demo title="带边框两列" code={borderedCode}>
        <Descriptions bordered column={2} items={items} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '字段配置（key 必填）', 'DescriptionsItem[]', '必填'],
          ['column', '列数', 'number', '3'],
          ['bordered', '是否带边框', 'boolean', 'false'],
          ['title', '标题', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 五处：import 在 `import { CardPage } from './pages/CardPage';` 行后加 `import { DescriptionsPage } from './pages/DescriptionsPage';`；PageKey 在 `  | 'card'` 行后加 `  | 'descriptions'`；currentPage keys 在 `    'card',` 行后加 `    'descriptions',`；groups keys 里 `'card'` 后插 `'descriptions'`；pages 在 card 条目行后加 `{ key: 'descriptions', title: 'Descriptions 描述列表', node: <DescriptionsPage /> },`。

- [ ] **Step 6: 门禁 + 提交**

Run: `pnpm lint && pnpm stylelint && pnpm --filter @reef-ui/components test`
Expected: 零输出 / 全绿 71/71。

```bash
git add packages/components apps/docs/src
git commit -m "feat: add Descriptions component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 6: Segmented 分段控制器

**Files:**
- Create: `packages/components/src/segmented/{Segmented.tsx,types.ts,segmented.css,index.ts,Segmented.test.tsx}`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`、`apps/docs/src/App.tsx`、新建 `apps/docs/src/pages/SegmentedPage.tsx`

**Interfaces:**
- Produces: `export function Segmented(props: SegmentedProps)`；`SegmentedOption { label: ReactNode; value: string }`；`SegmentedProps { options: SegmentedOption[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; className?: string }`（非受控默认选中 `defaultValue ?? options[0].value`）

- [ ] **Step 1: 写失败测试（含 Review Focus #2）**

```tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Segmented } from './Segmented';

afterEach(cleanup);

const OPTIONS = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
];

describe('Segmented', () => {
  test('渲染全部选项，默认选中第一项', () => {
    render(<Segmented options={OPTIONS} />);
    expect(screen.getByRole('radio', { name: '日' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: '月' }).getAttribute('aria-checked')).toBe('false');
  });

  test('点击切换选中并触发 onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Segmented options={OPTIONS} onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: '周' }));
    expect(onChange).toHaveBeenCalledWith('week');
    expect(screen.getByRole('radio', { name: '周' }).getAttribute('aria-checked')).toBe('true');
  });

  test('受控时点击不改变选中，但 onChange 仍触发（Review Focus #2）', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Segmented options={OPTIONS} value="day" onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: '月' }));
    expect(onChange).toHaveBeenCalledWith('month');
    expect(screen.getByRole('radio', { name: '月' }).getAttribute('aria-checked')).toBe('false');
    expect(screen.getByRole('radio', { name: '日' }).getAttribute('aria-checked')).toBe('true');
  });

  test('defaultValue 指定初始选中', () => {
    render(<Segmented options={OPTIONS} defaultValue="month" />);
    expect(screen.getByRole('radio', { name: '月' }).getAttribute('aria-checked')).toBe('true');
  });
});
```

- [ ] **Step 2: 确认 RED**

Run: `pnpm --filter @reef-ui/components test -- segmented`
Expected: FAIL，`Cannot find module './Segmented'`。

- [ ] **Step 3: 实现**

`types.ts`:

```ts
import type { ReactNode } from 'react';

export interface SegmentedOption {
  label: ReactNode;
  value: string;
}

export interface SegmentedProps {
  options: SegmentedOption[];
  /** 受控选中值 */
  value?: string;
  /** 非受控初始值 */
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}
```

`Segmented.tsx`:

```tsx
import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { SegmentedProps } from './types';
import './segmented.css';

export function Segmented({ options, value, defaultValue, onChange, className }: SegmentedProps) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value !== undefined ? value : inner;

  return (
    <div role="radiogroup" className={cn('reef-segmented', className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === current}
          className="reef-segmented__option"
          onClick={() => {
            if (value === undefined) setInner(opt.value);
            onChange?.(opt.value);
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
```

`segmented.css`（选中态用 `[aria-checked='true']`，不引入 elem--mod 类）:

```css
.reef-segmented {
  display: inline-flex;
  padding: 2px;
  border-radius: var(--reef-radius-md);
  background: color-mix(in srgb, var(--reef-color-text-primary) 8%, transparent);
}

.reef-segmented__option {
  padding: 4px 16px;
  border: none;
  border-radius: calc(var(--reef-radius-md) - 2px);
  background: none;
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-secondary);
  cursor: pointer;
}

.reef-segmented__option:focus-visible {
  outline: 2px solid var(--reef-color-brand);
  outline-offset: 1px;
}

.reef-segmented__option[aria-checked='true'] {
  background: var(--reef-color-surface);
  font-weight: 500;
  color: var(--reef-color-text-primary);
  box-shadow: 0 1px 4px color-mix(in srgb, var(--reef-color-text-primary) 12%, transparent);
}
```

`index.ts`:

```ts
export { Segmented } from './Segmented';
export type { SegmentedProps, SegmentedOption } from './types';
```

- [ ] **Step 4: 确认 GREEN**

Run: `pnpm --filter @reef-ui/components test -- segmented`
Expected: PASS 4/4。

- [ ] **Step 5: 导出 + docs + App.tsx**

新建 `apps/docs/src/pages/SegmentedPage.tsx`:

```tsx
import { Segmented } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';
import { useState } from 'react';

const options = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
];

const basicCode = `<Segmented options={options} />`;

const controlledCode = `const [range, setRange] = useState('week');
<Segmented options={options} value={range} onChange={setRange} />`;

export function SegmentedPage() {
  const [range, setRange] = useState('week');
  return (
    <>
      <h2>Segmented 分段控制器</h2>
      <p>在一组互斥选项中切换单个值。</p>

      <Demo title="基础用法" code={basicCode}>
        <Segmented options={options} />
      </Demo>

      <Demo title="受控用法" code={controlledCode}>
        <Segmented options={options} value={range} onChange={setRange} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['options', '选项配置', 'SegmentedOption[]', '必填'],
          ['value', '受控选中值', 'string', '—'],
          ['defaultValue', '非受控初始值（默认第一项）', 'string', '—'],
          ['onChange', '选中变化回调', '(value: string) => void', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 五处：import 在 `import { PaginationPage } from './pages/PaginationPage';` 行后加 `import { SegmentedPage } from './pages/SegmentedPage';`；PageKey 在 `  | 'pagination'` 行后加 `  | 'segmented'`；currentPage keys 在 `    'pagination',` 行后加 `    'segmented',`；groups keys 里 `'pagination'` 后插 `'segmented'`（注意保持数组内仍位于 `'select'` 之前的字母序位置）；pages 在 pagination 条目行后加 `{ key: 'segmented', title: 'Segmented 分段控制器', node: <SegmentedPage /> },`。

- [ ] **Step 6: 门禁 + 提交**

Run: `pnpm lint && pnpm stylelint && pnpm --filter @reef-ui/components test`
Expected: 零输出 / 全绿 75/75。

```bash
git add packages/components apps/docs/src
git commit -m "feat: add Segmented component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 7: Drawer 抽屉

**Files:**
- Create: `packages/components/src/drawer/{Drawer.tsx,types.ts,drawer.css,index.ts,Drawer.test.tsx}`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`、`apps/docs/src/App.tsx`、新建 `apps/docs/src/pages/DrawerPage.tsx`

**Interfaces:**
- Consumes: Modal 的结构先例（`packages/components/src/modal/Modal.tsx`）——portal + `if (!open) return null` + Esc 关闭 + body 滚动锁
- Produces: `export function Drawer(props: DrawerProps)`；`DrawerProps { open: boolean; onClose?: () => void; title?: ReactNode; placement?: 'right' | 'left'; width?: number; footer?: ReactNode; children: ReactNode; className?: string }`（placement 默认 'right'，width 默认 378）

- [ ] **Step 1: 写失败测试（含 Review Focus #1）**

```tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Drawer } from './Drawer';

afterEach(cleanup);

describe('Drawer', () => {
  test('open 时在 body 渲染面板与标题', () => {
    render(
      <Drawer open title="详情">
        <p>内容</p>
      </Drawer>,
    );
    expect(screen.getByText('详情')).toBeTruthy();
    expect(document.querySelector('.reef-drawer__panel')).toBeTruthy();
  });

  test('open=false 时 body 零残留（Review Focus #1）', () => {
    const { container } = render(
      <Drawer open={false} title="详情">
        内容
      </Drawer>,
    );
    expect(container.innerHTML).toBe('');
    expect(document.querySelector('.reef-drawer')).toBeNull();
  });

  test('点遮罩与 Esc 都触发 onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(
      <Drawer open onClose={onClose}>
        内容
      </Drawer>,
    );
    await user.click(document.querySelector('.reef-drawer__overlay')!);
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(
      <Drawer open onClose={onClose}>
        内容
      </Drawer>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('placement=left 加左定位样式，面板宽度生效', () => {
    render(
      <Drawer open placement="left" width={420} title="左抽屉">
        内容
      </Drawer>,
    );
    const panel = document.querySelector('.reef-drawer__panel') as HTMLElement;
    expect(panel.style.width).toBe('420px');
    expect(panel.style.left).toBe('0px');
  });
});
```

- [ ] **Step 2: 确认 RED**

Run: `pnpm --filter @reef-ui/components test -- drawer`
Expected: FAIL，`Cannot find module './Drawer'`。

- [ ] **Step 3: 实现**

`types.ts`:

```ts
import type { ReactNode } from 'react';

export interface DrawerProps {
  /** 是否打开 */
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  /** 抽屉位置 */
  placement?: 'right' | 'left';
  /** 面板宽度（px） */
  width?: number;
  /** 底部操作区 */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}
```

`Drawer.tsx`（对齐 Modal 的 Esc/body 锁/portal 模式）:

```tsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@reef-ui/utils';
import type { DrawerProps } from './types';
import './drawer.css';

export function Drawer({
  open,
  onClose,
  title,
  placement = 'right',
  width = 378,
  footer,
  children,
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    // ponytail: 与 Modal 相同的直接置 body overflow，多浮层叠加时需改为计数器
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className={cn('reef-drawer', className)}>
      <div className="reef-drawer__overlay" onClick={() => onClose?.()} />
      <aside
        className="reef-drawer__panel"
        style={{ width, ...(placement === 'left' ? { left: 0 } : { right: 0 }) }}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
      >
        {title != null && <header className="reef-drawer__head">{title}</header>}
        <div className="reef-drawer__body">{children}</div>
        {footer != null && <footer className="reef-drawer__foot">{footer}</footer>}
      </aside>
    </div>,
    document.body,
  );
}
```

`drawer.css`（遮罩沿用 Modal 的 `rgb(0 0 0 / 45%)`，与 modal.css 一致；z-index 同为 1000）:

```css
.reef-drawer {
  position: fixed;
  inset: 0;
  z-index: 1000;
}

.reef-drawer__overlay {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 45%);
  animation: reef-drawer-fade 0.2s ease;
}

.reef-drawer__panel {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: var(--reef-color-surface);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--reef-color-text-primary) 12%, transparent);
  animation: reef-drawer-slide 0.2s ease;
}

.reef-drawer__head {
  display: flex;
  align-items: center;
  padding: var(--reef-space-lg) var(--reef-space-xl);
  font-size: var(--reef-font-size-lg);
  font-weight: 600;
  color: var(--reef-color-text-primary);
  border-bottom: 1px solid color-mix(in srgb, var(--reef-color-text-primary) 10%, transparent);
}

.reef-drawer__body {
  flex: 1;
  padding: var(--reef-space-xl);
  overflow-y: auto;
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-primary);
}

.reef-drawer__foot {
  display: flex;
  justify-content: flex-end;
  gap: var(--reef-space-sm);
  padding: var(--reef-space-md) var(--reef-space-xl);
  border-top: 1px solid color-mix(in srgb, var(--reef-color-text-primary) 10%, transparent);
}

@keyframes reef-drawer-fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes reef-drawer-slide {
  from {
    transform: translateX(24px);
    opacity: 0;
  }

  to {
    transform: none;
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reef-drawer__overlay,
  .reef-drawer__panel {
    animation: none;
  }
}
```

`index.ts`:

```ts
export { Drawer } from './Drawer';
export type { DrawerProps } from './types';
```

- [ ] **Step 4: 确认 GREEN**

Run: `pnpm --filter @reef-ui/components test -- drawer`
Expected: PASS 4/4。

- [ ] **Step 5: 导出 + docs + App.tsx**

新建 `apps/docs/src/pages/DrawerPage.tsx`:

```tsx
import { Button, Drawer } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';
import { useState } from 'react';

const basicCode = `const [open, setOpen] = useState(false);
<>
  <Button onClick={() => setOpen(true)}>打开抽屉</Button>
  <Drawer open={open} onClose={() => setOpen(false)} title="详情">
    <p>抽屉内容</p>
  </Drawer>
</>`;

export function DrawerPage() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <h2>Drawer 抽屉</h2>
      <p>从屏幕边缘滑出的浮层面板，适合承载表单、详情等中等复杂度内容。</p>

      <Demo title="基础用法" code={basicCode}>
        <>
          <Button onClick={() => setOpen(true)}>打开抽屉</Button>
          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            title="详情"
            footer={<Button onClick={() => setOpen(false)}>关闭</Button>}
          >
            <p>抽屉内容</p>
          </Drawer>
        </>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['open', '是否打开', 'boolean', '必填'],
          ['onClose', '点遮罩 / Esc 关闭回调', '() => void', '—'],
          ['title', '标题', 'ReactNode', '—'],
          ['placement', '滑出位置', "'right' | 'left'", "'right'"],
          ['width', '面板宽度（px）', 'number', '378'],
          ['footer', '底部操作区', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
```

（左侧滑出不单独演示交互 Demo（避免页面上常驻一个开着的抽屉），placement 用法见 API 表。）

App.tsx 五处：import 在 `import { DividerPage } from './pages/DividerPage';` 行后加 `import { DrawerPage } from './pages/DrawerPage';`；PageKey 在 `  | 'divider'` 行后加 `  | 'drawer'`；currentPage keys 在 `    'divider',` 行后加 `    'drawer',`；groups keys 里 `'divider'` 后插 `'drawer'`；pages 在 divider 条目行后加 `{ key: 'drawer', title: 'Drawer 抽屉', node: <DrawerPage /> },`。

- [ ] **Step 6: 门禁 + 提交**

Run: `pnpm lint && pnpm stylelint && pnpm --filter @reef-ui/components test`
Expected: 零输出 / 全绿 79/79。

```bash
git add packages/components apps/docs/src
git commit -m "feat: add Drawer component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 8: Message 全局提示

**Files:**
- Create: `packages/components/src/message/{Message.tsx,types.ts,message.css,index.ts,Message.test.tsx}`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`、`apps/docs/src/App.tsx`、新建 `apps/docs/src/pages/MessagePage.tsx`

**Interfaces:**
- Produces: `export function Message(props: MessageProps)`；`MessageItem { key: string; type?: 'info' | 'success' | 'warning' | 'danger'; content: ReactNode }`；`MessageProps { items: MessageItem[]; onClose?: (key: string) => void; className?: string }`。受控列表：父级持有 items state，组件只负责渲染与回调；items 为空返回 null。

- [ ] **Step 1: 写失败测试（含 Review Focus #3）**

```tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Message } from './Message';

afterEach(cleanup);

describe('Message', () => {
  test('按序渲染全部消息', () => {
    render(
      <Message
        items={[
          { key: '1', content: '第一条' },
          { key: '2', type: 'success', content: '第二条' },
        ]}
      />,
    );
    expect(screen.getByText('第一条')).toBeTruthy();
    expect(screen.getByText('第二条')).toBeTruthy();
    expect(document.querySelector('.reef-message__item--success') ?? document.querySelector("[data-type='success']")).toBeTruthy();
  });

  test('items 为空不渲染任何东西', () => {
    const { container } = render(<Message items={[]} />);
    expect(container.innerHTML).toBe('');
    expect(document.querySelector('.reef-message')).toBeNull();
  });

  test('点关闭按钮触发 onClose 且携带该条 key（Review Focus #3）', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Message
        items={[
          { key: 'first', content: '第一条' },
          { key: 'second', content: '第二条' },
        ]}
        onClose={onClose}
      />,
    );
    const closes = document.querySelectorAll('.reef-message__close');
    await user.click(closes[1]);
    expect(onClose).toHaveBeenCalledWith('second');
    expect(onClose).not.toHaveBeenCalledWith('first');
  });
});
```

- [ ] **Step 2: 确认 RED**

Run: `pnpm --filter @reef-ui/components test -- message`
Expected: FAIL，`Cannot find module './Message'`。

- [ ] **Step 3: 实现**

`types.ts`:

```ts
import type { ReactNode } from 'react';

export interface MessageItem {
  key: string;
  /** 消息类型，决定左侧强调色 */
  type?: 'info' | 'success' | 'warning' | 'danger';
  content: ReactNode;
}

export interface MessageProps {
  /** 消息列表（父级受控） */
  items: MessageItem[];
  /** 单条关闭回调，携带该条 key */
  onClose?: (key: string) => void;
  className?: string;
}
```

`Message.tsx`（类型色用 `data-type` 属性选择器，不引入 elem--mod 类）:

```tsx
import { createPortal } from 'react-dom';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import type { MessageProps } from './types';
import './message.css';

export function Message({ items, onClose, className }: MessageProps) {
  if (items.length === 0) return null;
  return createPortal(
    <div role="status" className={cn('reef-message', className)}>
      {items.map((item) => (
        <div
          key={item.key}
          data-type={item.type ?? 'info'}
          className="reef-message__item"
        >
          <span className="reef-message__content">{item.content}</span>
          {onClose && (
            <button
              type="button"
              className="reef-message__close"
              aria-label="关闭"
              onClick={() => onClose(item.key)}
            >
              <Icon name="close" size={12} />
            </button>
          )}
        </div>
      ))}
    </div>,
    document.body,
  );
}
```

`message.css`:

```css
.reef-message {
  position: fixed;
  top: 16px;
  left: 50%;
  z-index: 1010;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--reef-space-sm);
  transform: translateX(-50%);
}

.reef-message__item {
  display: flex;
  align-items: center;
  gap: var(--reef-space-sm);
  padding: var(--reef-space-xs) var(--reef-space-md);
  border-radius: var(--reef-radius-md);
  border: 1px solid color-mix(in srgb, var(--reef-color-text-primary) 10%, transparent);
  background: var(--reef-color-surface);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--reef-color-text-primary) 12%, transparent);
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-primary);
  animation: reef-message-slide 0.2s ease;
}

.reef-message__item[data-type='success'] {
  color: var(--reef-color-success);
}

.reef-message__item[data-type='warning'] {
  color: var(--reef-color-warning);
}

.reef-message__item[data-type='danger'] {
  color: var(--reef-color-danger);
}

.reef-message__content {
  color: inherit;
}

.reef-message__close {
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: none;
  color: var(--reef-color-text-secondary);
  cursor: pointer;
}

.reef-message__close:hover {
  color: var(--reef-color-text-primary);
}

@keyframes reef-message-slide {
  from {
    transform: translateY(-8px);
    opacity: 0;
  }

  to {
    transform: none;
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reef-message__item {
    animation: none;
  }
}
```

注意：`data-type` 的颜色选择器染色整条消息文字是刻意的简洁做法（与 Tag 的做法一致）；`.reef-message__content { color: inherit }` 保证嵌套内容继承强调色。

`index.ts`:

```ts
export { Message } from './Message';
export type { MessageProps, MessageItem } from './types';
```

- [ ] **Step 4: 确认 GREEN**

Run: `pnpm --filter @reef-ui/components test -- message`
Expected: PASS 3/3。注意测试 1 里的 `document.querySelector('.reef-message__item--success')` 兜底写法：实现落地后该选择器不会命中（用的是 data-type），靠 `??` 后半段断言——若 lint 报该表达式冗余，直接删掉 `??` 前半段，仅保留 `document.querySelector(".reef-message__item[data-type='success']")`。

- [ ] **Step 5: 导出 + docs + App.tsx**

新建 `apps/docs/src/pages/MessagePage.tsx`:

```tsx
import { Button, Message } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';
import { useState } from 'react';

const fullCode = `const [items, setItems] = useState([
  { key: '1', type: 'success', content: '保存成功' },
  { key: '2', type: 'warning', content: '部分字段未填写' },
]);
<Message
  items={items}
  onClose={(key) => setItems(items.filter((item) => item.key !== key))}
/>`;

export function MessagePage() {
  const [items, setItems] = useState([
    { key: '1', type: 'success' as const, content: '保存成功' },
    { key: '2', type: 'warning' as const, content: '部分字段未填写' },
  ]);
  return (
    <>
      <h2>Message 全局提示</h2>
      <p>页面顶部居中的轻量反馈。父级持有 items，关闭时按 key 移除。</p>

      <Demo title="受控列表" code={fullCode}>
        <div>
          <p style={{ marginBottom: 12 }}>
            <Button
              onClick={() =>
                setItems([
                  { key: '1', type: 'success', content: '保存成功' },
                  { key: '2', type: 'warning', content: '部分字段未填写' },
                ])
              }
            >
              显示提示
            </Button>
          </p>
          <Message items={items} onClose={(key) => setItems(items.filter((item) => item.key !== key))} />
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '消息列表（父级受控）', 'MessageItem[]', '必填'],
          ['items[].type', '消息类型', "'info' | 'success' | 'warning' | 'danger'", "'info'"],
          ['onClose', '单条关闭回调，携带 key', '(key: string) => void', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 五处：import 在 `import { InputPage } from './pages/InputPage';` 行后加 `import { MessagePage } from './pages/MessagePage';`（注意与 Modal 相邻，别锚到 MenuPage——不存在）；PageKey 在 `  | 'input'` 行后加 `  | 'message'`；currentPage keys 在 `    'input',` 行后加 `    'message',`；groups keys 里 `'input'` 后插 `'message'`；pages 在 input 条目行后加 `{ key: 'message', title: 'Message 全局提示', node: <MessagePage /> },`。

- [ ] **Step 6: 门禁 + 提交**

Run: `pnpm lint && pnpm stylelint && pnpm --filter @reef-ui/components test`
Expected: 零输出 / 全绿 82/82。

```bash
git add packages/components apps/docs/src
git commit -m "feat: add Message component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

## 收尾

- 全部任务后：`git log --oneline` 应为 9 个新提交（1 fix + 8 feat）叠在批次 3 之上；组件 31 个、测试 82/82、turbo build 全绿
- 最终 whole-branch review（executing-plans 技能流程）+ 是否 push 由用户决定
