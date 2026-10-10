# 组件库第二批组件（表单补全 + 反馈 + 覆盖层 + 导航）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按 Reef UI 既有设计模式新增 7 个中后台高频组件：Radio/RadioGroup、Tag、Alert、Tooltip、Modal、Tabs、Pagination，每个组件带单元测试和文档页。

**Architecture:** 每个组件遵循仓库既有模式：`src/<name>/` 目录下 `X.tsx`（forwardRef/函数组件）+ `types.ts` + `x.css` + `index.ts` + `X.test.tsx`，BEM 命名 `reef-` 前缀，样式全部走 `--reef-*` design token，`cn()` 来自 `@reef-ui/utils`。受控/非受控双模式用 `value !== undefined ? value : inner` 惯用法。CSS 中优先原生平台能力（`:checked`、`::after`、`color-mix`），不引第三方依赖。

**Tech Stack:** React 18 + TypeScript + tsup + vitest/jsdom + @testing-library/react + 纯 CSS token。

**Spec:** 无正式 spec 文档；本计划即设计基线，视觉与交互对齐 `packages/components/src/` 现有组件与 `apps/docs` 现有页面。

## Global Constraints

- 组件目录结构固定：`packages/components/src/<name>/{X.tsx,types.ts,x.css,index.ts,X.test.tsx}`
- 命名：CSS 类 `reef-<block>__<element>--<modifier>`；导出名 PascalCase；`index.ts` 只做 re-export
- 样式只用 `packages/theme/src/tokens.css` 里已有的 `--reef-*` token + `color-mix()` 派生色，不新增 token、不写死色值（参考 `select.css` 的 z-index 用字面量 `100`，Modal 用 `1000`）
- 表单类控件必须保留原生 input（视觉隐藏），保证 `FormData`、label 点击、键盘行为原生可用
- 受控/非受控：`value`/`checked`/`current` 为 `undefined` 时走内部 `useState`
- 键盘行为与 Select 一致：方向键到边界即停（clamp），不做循环
- 每个组件测试 2-4 个用例即可，覆盖核心交互，不追求覆盖率数字
- 每个任务结束前：`pnpm --filter @reef-ui/components test` + `pnpm lint` + `pnpm stylelint` 全绿；commit message 末尾加 `Co-Authored-By: Claude Code <noreply@anthropic.com>`
- 文档页遵循 `apps/docs/src/pages/CheckboxPage.tsx` 的结构：`<h2>` 标题 + `<p>` 一句话说明 + `Demo` + `ApiTable`；代码字符串常量放页面文件顶部
- `apps/docs/src/App.tsx` 注册四件套（每个任务都要做）：① pages import（按字母序插入）② `PageKey` 联合类型 ③ `currentPage()` 里的 `keys` 数组 ④ `groups` 组件组 + `pages` 数组
- `packages/components/src/index.ts` 加 `export * from './<name>';`（按字母序）；`src/style.css` 加对应 `@import url('./<name>/<name>.css');`（tokens.css 保持第一，其余按字母序）

## Review Focus

按"用户最可能踩到"排序；每条已在对应任务的测试步骤中钉死：

1. **RadioGroup 内互斥**：点选一个必须让兄弟项取消选中——checked 由 group value 派生，不能依赖 DOM 自身行为（Task 1 测试 1）
2. **Modal 关闭事件只在 open 时存在**：Esc/遮罩关闭的监听不得在 open=false 后残留（Task 5 测试 2、3，用条件渲染+useEffect cleanup 保证）
3. **Pagination 越界钳制**：传入的 current 超过总页数时显示最后一页而不是空白（Task 7 测试 3）
4. **Tabs 键盘导航边界**：第一项按 ←、最后一项按 → 不应报错也不应循环（Task 6 测试 2）
5. **Tooltip 不能挡住点击**：气泡必须 `pointer-events: none`，且被包裹元素 hover/focus 才显示（Task 4 测试 1 + CSS 断言靠 stylelint 人工核验）

---

### Task 1: Radio 单选框 + RadioGroup

**Files:**
- Create: `packages/components/src/radio/Radio.tsx`
- Create: `packages/components/src/radio/RadioGroup.tsx`
- Create: `packages/components/src/radio/context.ts`
- Create: `packages/components/src/radio/types.ts`
- Create: `packages/components/src/radio/radio.css`
- Create: `packages/components/src/radio/index.ts`
- Test: `packages/components/src/radio/Radio.test.tsx`
- Modify: `packages/components/src/index.ts`（加 `export * from './radio';`，按字母序插在 input 之后）
- Modify: `packages/components/src/style.css`（加 `@import url('./radio/radio.css');`，按字母序）
- Create: `apps/docs/src/pages/RadioPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册四件套，见下）

**Interfaces:**
- Consumes: `cn()` from `@reef-ui/utils`
- Produces: `export const Radio` (forwardRef<HTMLInputElement, RadioProps>)、`export const RadioGroup` ({ name: string; value?: string; defaultValue?: string; onChange?: (value: string) => void; disabled?: boolean; className?: string; children: ReactNode })、`export type { RadioProps, RadioGroupProps }`。`RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'>` 且 `onChange?: React.ChangeEventHandler<HTMLInputElement>`（保留原生事件签名，额外经 group 派发）。RadioGroup 给内部 input 注入 `name`，因此天然兼容 Form 的 FormData 读取。

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/radio/Radio.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

afterEach(cleanup);

describe('RadioGroup', () => {
  test('点选一个，兄弟项取消选中（互斥由 value 派生，不靠 DOM）', async () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup name="fruit" defaultValue="apple" onChange={handleChange}>
        <Radio value="apple">苹果</Radio>
        <Radio value="banana">香蕉</Radio>
      </RadioGroup>,
    );

    const apple = screen.getByRole('radio', { name: '苹果' }) as HTMLInputElement;
    const banana = screen.getByRole('radio', { name: '香蕉' }) as HTMLInputElement;
    expect(apple.checked).toBe(true);
    expect(banana.checked).toBe(false);

    await userEvent.click(banana);
    expect(handleChange).toHaveBeenCalledWith('banana');
    expect(banana.checked).toBe(true);
    expect(apple.checked).toBe(false);
  });

  test('受控模式：value 不变则点击不改变选中', async () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup name="fruit" value="apple" onChange={handleChange}>
        <Radio value="apple">苹果</Radio>
        <Radio value="banana">香蕉</Radio>
      </RadioGroup>,
    );

    await userEvent.click(screen.getByRole('radio', { name: '香蕉' }));
    expect(handleChange).toHaveBeenCalledWith('banana');
    expect((screen.getByRole('radio', { name: '香蕉' }) as HTMLInputElement).checked).toBe(false);
  });

  test('group disabled 时子项全部禁用', async () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup name="fruit" defaultValue="apple" disabled onChange={handleChange}>
        <Radio value="banana">香蕉</Radio>
      </RadioGroup>,
    );

    await userEvent.click(screen.getByRole('radio', { name: '香蕉' }));
    expect(handleChange).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Radio'`）

- [ ] **Step 3: 最小实现**

```ts
// packages/components/src/radio/types.ts
import type * as React from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** 选中值（RadioGroup 内必填，作为该选项的取值） */
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export interface RadioGroupProps {
  /** 注入到每个子 Radio 的原生 name，FormData 依赖它 */
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

```ts
// packages/components/src/radio/context.ts
import { createContext } from 'react';

export interface RadioGroupContextValue {
  name: string;
  value?: string;
  disabled?: boolean;
  onSelect: (value: string) => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
```

```tsx
// packages/components/src/radio/RadioGroup.tsx
import { useState, type ReactNode } from 'react';
import { cn } from '@reef-ui/utils';
import { RadioGroupContext } from './context';
import type { RadioGroupProps } from './types';

export function RadioGroup({ name, value, defaultValue, onChange, disabled, className, children }: RadioGroupProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;

  const onSelect = (next: string) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  return (
    <div className={cn('reef-radio-group', className)} role="radiogroup">
      <RadioGroupContext.Provider value={{ name, value: current, disabled, onSelect }}>
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
}
```

```tsx
// packages/components/src/radio/Radio.tsx
import { forwardRef, useContext, type ChangeEvent } from 'react';
import { cn } from '@reef-ui/utils';
import { RadioGroupContext } from './context';
import type { RadioProps } from './types';
import './radio.css';

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ disabled, className, children, onChange, ...rest }, ref) => {
    const group = useContext(RadioGroupContext);
    const isDisabled = disabled ?? group?.disabled;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      group?.onSelect(e.target.value);
      onChange?.(e);
    };

    return (
      <label className={cn('reef-radio', isDisabled && 'reef-radio--disabled', className)}>
        <input
          ref={ref}
          type="radio"
          className="reef-radio__native"
          {...rest}
          name={group?.name ?? rest.name}
          checked={group ? group.value === rest.value : undefined}
          disabled={isDisabled}
          onChange={handleChange}
        />
        <span className="reef-radio__dot" aria-hidden="true" />
        {children != null && <span className="reef-radio__label">{children}</span>}
      </label>
    );
  },
);

Radio.displayName = 'Radio';
```

```css
/* packages/components/src/radio/radio.css */
.reef-radio-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--reef-space-lg);
}

.reef-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--reef-space-sm);
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-primary);
  cursor: pointer;
  user-select: none;
}

.reef-radio--disabled {
  color: var(--reef-color-text-disabled);
  cursor: not-allowed;
}

.reef-radio__native {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  opacity: 0;
}

.reef-radio__dot {
  position: relative;
  box-sizing: border-box;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: 1px solid var(--reef-color-text-disabled);
  border-radius: var(--reef-radius-full);
  background: var(--reef-color-surface);
  transition: border-color 0.15s;
}

.reef-radio__dot::after {
  content: '';
  position: absolute;
  inset: 3px;
  border-radius: var(--reef-radius-full);
  background: var(--reef-color-brand);
  opacity: 0;
  transform: scale(0);
  transition: transform 0.15s, opacity 0.15s;
}

.reef-radio__native:checked + .reef-radio__dot {
  border-color: var(--reef-color-brand);
}

.reef-radio__native:checked + .reef-radio__dot::after {
  opacity: 1;
  transform: scale(1);
}

.reef-radio__native:focus-visible + .reef-radio__dot {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--reef-color-brand) 18%, transparent);
}

.reef-radio--disabled .reef-radio__dot {
  border-color: var(--reef-color-text-disabled);
  background: color-mix(in srgb, var(--reef-color-text-disabled) 20%, transparent);
}

.reef-radio--disabled .reef-radio__dot::after {
  background: var(--reef-color-text-disabled);
}
```

```ts
// packages/components/src/radio/index.ts
export { Radio } from './Radio';
export { RadioGroup } from './RadioGroup';
export type { RadioProps, RadioGroupProps } from './types';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS（含 Button 既有 3 个用例）

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/RadioPage.tsx
import { Radio, RadioGroup } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<RadioGroup name="city" defaultValue="hz">
  <Radio value="hz">杭州</Radio>
  <Radio value="sh">上海</Radio>
  <Radio value="sz" disabled>深圳（禁用）</Radio>
</RadioGroup>`;

export function RadioPage() {
  return (
    <>
      <h2>Radio 单选框</h2>
      <p>在一组互斥选项中选择一个，配合 RadioGroup 使用。</p>

      <Demo title="基础用法" code={basicCode}>
        <RadioGroup name="city" defaultValue="hz">
          <Radio value="hz">杭州</Radio>
          <Radio value="sh">上海</Radio>
          <Radio value="sz" disabled>深圳（禁用）</Radio>
        </RadioGroup>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['name', '注入子 Radio 的原生 name', 'string', '必填'],
          ['value / defaultValue', '选中值', 'string', '—'],
          ['onChange', '选中变化回调', '(value: string) => void', '—'],
          ['disabled', '整组禁用（Radio 上也可单独设置）', 'boolean', 'false'],
        ]}
      />
    </>
  );
}
```

`apps/docs/src/App.tsx` 四处修改：
1. import 区按字母序加：`import { RadioPage } from './pages/RadioPage';`（在 SelectPage 之后、SwitchPage 之前）
2. `PageKey` 联合类型加 `| 'radio'`（加在 `'select'` 前，保持字母序）
3. `currentPage()` 的 `keys` 数组加 `'radio',`（同样按字母序）
4. `groups` 组件组 keys 改为 `['button', 'input', 'select', 'switch', 'checkbox', 'form', 'radio']`；`pages` 数组按侧栏显示顺序加 `{ key: 'radio', title: 'Radio 单选框', node: <RadioPage /> },`（放在 Form 之后）

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`
Expected: 无报错

```bash
git add packages/components/src/radio packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/RadioPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Radio and RadioGroup components

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2: Tag 标签

**Files:**
- Create: `packages/components/src/tag/Tag.tsx`
- Create: `packages/components/src/tag/types.ts`
- Create: `packages/components/src/tag/tag.css`
- Create: `packages/components/src/tag/index.ts`
- Test: `packages/components/src/tag/Tag.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`（同 Task 1 方式，按字母序插在 switch 附近）
- Create: `apps/docs/src/pages/TagPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册四件套）

**Interfaces:**
- Consumes: `cn()`
- Produces: `export const Tag`、`export type TagProps`。`TagProps extends React.HTMLAttributes<HTMLSpanElement>`，新增 `color?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger'`（默认 'neutral'）、`closable?: boolean`（默认 false）、`onClose?: React.MouseEventHandler<HTMLButtonElement>`。`color` 等原生 span 属性冲突 → `Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>`。

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/tag/Tag.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Tag } from './Tag';

afterEach(cleanup);

describe('Tag', () => {
  test('渲染文本内容', () => {
    render(<Tag color="brand">进行中</Tag>);
    expect(screen.getByText('进行中')).toBeTruthy();
  });

  test('closable 显示关闭按钮，点击触发 onClose', async () => {
    const handleClose = vi.fn();
    render(
      <Tag closable onClose={handleClose}>
        可关闭
      </Tag>,
    );

    await userEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('非 closable 不渲染关闭按钮', () => {
    render(<Tag>静态</Tag>);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Tag'`）

- [ ] **Step 3: 最小实现**

```ts
// packages/components/src/tag/types.ts
import type * as React from 'react';

export type TagColor = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** 预设色 */
  color?: TagColor;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 点击关闭按钮回调（隐藏由外部控制） */
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
}
```

```tsx
// packages/components/src/tag/Tag.tsx
import { cn } from '@reef-ui/utils';
import type { TagProps } from './types';
import './tag.css';

export function Tag({ color = 'neutral', closable = false, onClose, className, children, ...rest }: TagProps) {
  return (
    <span className={cn('reef-tag', `reef-tag--${color}`, className)} {...rest}>
      {children}
      {closable && (
        <button type="button" className="reef-tag__close" aria-label="关闭" onClick={onClose}>
          ×
        </button>
      )}
    </span>
  );
}
```

```css
/* packages/components/src/tag/tag.css */
.reef-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--reef-radius-sm);
  font-size: var(--reef-font-size-sm);
  line-height: 20px;
  color: var(--reef-color-text-primary);
  background: color-mix(in srgb, var(--reef-color-text-primary) 8%, transparent);
}

.reef-tag--brand {
  color: var(--reef-color-brand);
  background: color-mix(in srgb, var(--reef-color-brand) 12%, transparent);
}

.reef-tag--success {
  color: var(--reef-color-success);
  background: color-mix(in srgb, var(--reef-color-success) 12%, transparent);
}

.reef-tag--warning {
  color: var(--reef-color-warning);
  background: color-mix(in srgb, var(--reef-color-warning) 15%, transparent);
}

.reef-tag--danger {
  color: var(--reef-color-danger);
  background: color-mix(in srgb, var(--reef-color-danger) 12%, transparent);
}

.reef-tag__close {
  padding: 0;
  border: none;
  background: none;
  font-size: 14px;
  line-height: 1;
  color: inherit;
  cursor: pointer;
  opacity: 0.6;
}

.reef-tag__close:hover {
  opacity: 1;
}
```

```ts
// packages/components/src/tag/index.ts
export { Tag } from './Tag';
export type { TagProps, TagColor } from './types';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/TagPage.tsx
import { Tag } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Tag>默认</Tag>
<Tag color="brand">进行中</Tag>
<Tag color="success">已完成</Tag>
<Tag color="warning">待审核</Tag>
<Tag color="danger">已失败</Tag>`;

const closableCode = `<Tag closable onClose={handleClose}>可关闭</Tag>`;

export function TagPage() {
  return (
    <>
      <h2>Tag 标签</h2>
      <p>标记状态与分类，支持五种预设色和关闭按钮。</p>

      <Demo title="五种预设色" code={basicCode}>
        <Tag>默认</Tag>
        <Tag color="brand">进行中</Tag>
        <Tag color="success">已完成</Tag>
        <Tag color="warning">待审核</Tag>
        <Tag color="danger">已失败</Tag>
      </Demo>

      <Demo title="可关闭" code={closableCode}>
        <Tag closable>可关闭</Tag>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['color', '预设色', "'neutral' | 'brand' | 'success' | 'warning' | 'danger'", "'neutral'"],
          ['closable', '显示关闭按钮', 'boolean', 'false'],
          ['onClose', '点击关闭回调', '(e) => void', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 四处修改同 Task 1 模式：PageKey 加 `'tag'`、keys 数组加 `'tag',`、组件组末尾加 `'tag'`、pages 数组加 `{ key: 'tag', title: 'Tag 标签', node: <TagPage /> },`、import 加 `import { TagPage } from './pages/TagPage';`（TypographyPage 之前）。

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`
Expected: 无报错

```bash
git add packages/components/src/tag packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/TagPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Tag component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3: Alert 警告提示

**Files:**
- Create: `packages/components/src/alert/Alert.tsx`
- Create: `packages/components/src/alert/types.ts`
- Create: `packages/components/src/alert/alert.css`
- Create: `packages/components/src/alert/index.ts`
- Test: `packages/components/src/alert/Alert.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/AlertPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册四件套）

**Interfaces:**
- Consumes: `cn()`
- Produces: `export const Alert`、`export type AlertProps`。`AlertProps`：`type?: 'info' | 'success' | 'warning' | 'error'`（默认 'info'）、`title: ReactNode`（必填）、`closable?: boolean`、`onClose?: () => void`、`children?: ReactNode`（正文）、`className?: string`。关闭是组件内部 `useState(false)` 自隐藏。

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/alert/Alert.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Alert } from './Alert';

afterEach(cleanup);

describe('Alert', () => {
  test('渲染标题、正文，容器有 role=alert', () => {
    render(
      <Alert type="warning" title="磁盘空间不足">
        清理后重试
      </Alert>,
    );

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('磁盘空间不足')).toBeTruthy();
    expect(screen.getByText('清理后重试')).toBeTruthy();
  });

  test('closable 点击后消失并触发 onClose', async () => {
    const handleClose = vi.fn();
    render(
      <Alert title="提示" closable onClose={handleClose}>
        内容
      </Alert>,
    );

    await userEvent.click(screen.getByRole('button', { name: '关闭' }));
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Alert'`）

- [ ] **Step 3: 最小实现**

```ts
// packages/components/src/alert/types.ts
import type * as React from 'react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  /** 语义类型，决定左侧色条与底色 */
  type?: AlertType;
  title: React.ReactNode;
  /** 是否可关闭 */
  closable?: boolean;
  /** 关闭回调（隐藏由组件内部完成） */
  onClose?: () => void;
  /** 正文，可选 */
  children?: React.ReactNode;
  className?: string;
}
```

```tsx
// packages/components/src/alert/Alert.tsx
import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { AlertProps } from './types';
import './alert.css';

export function Alert({ type = 'info', title, closable = false, onClose, className, children }: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div role="alert" className={cn('reef-alert', `reef-alert--${type}`, className)}>
      <div className="reef-alert__head">
        <span className="reef-alert__title">{title}</span>
        {closable && (
          <button
            type="button"
            className="reef-alert__close"
            aria-label="关闭"
            onClick={() => {
              setVisible(false);
              onClose?.();
            }}
          >
            ×
          </button>
        )}
      </div>
      {children != null && <div className="reef-alert__content">{children}</div>}
    </div>
  );
}
```

```css
/* packages/components/src/alert/alert.css */
.reef-alert {
  box-sizing: border-box;
  padding: var(--reef-space-md) var(--reef-space-lg);
  border-left: 3px solid var(--reef-color-brand);
  border-radius: var(--reef-radius-md);
  font-size: var(--reef-font-size-md);
  background: color-mix(in srgb, var(--reef-color-brand) 8%, transparent);
}

.reef-alert--success {
  border-left-color: var(--reef-color-success);
  background: color-mix(in srgb, var(--reef-color-success) 8%, transparent);
}

.reef-alert--warning {
  border-left-color: var(--reef-color-warning);
  background: color-mix(in srgb, var(--reef-color-warning) 10%, transparent);
}

.reef-alert--error {
  border-left-color: var(--reef-color-danger);
  background: color-mix(in srgb, var(--reef-color-danger) 8%, transparent);
}

.reef-alert__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--reef-space-sm);
}

.reef-alert__title {
  font-weight: 600;
  color: var(--reef-color-text-primary);
}

.reef-alert__close {
  padding: 0;
  border: none;
  background: none;
  font-size: 16px;
  line-height: 1;
  color: var(--reef-color-text-secondary);
  cursor: pointer;
}

.reef-alert__close:hover {
  color: var(--reef-color-text-primary);
}

.reef-alert__content {
  margin-top: var(--reef-space-xs);
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-secondary);
}
```

```ts
// packages/components/src/alert/index.ts
export { Alert } from './Alert';
export type { AlertProps, AlertType } from './types';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/AlertPage.tsx
import { Alert } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const typesCode = `<Alert title="信息提示">这是一条信息提示。</Alert>
<Alert type="success" title="操作成功">数据已保存。</Alert>
<Alert type="warning" title="注意">配额即将用尽。</Alert>
<Alert type="error" title="操作失败">网络异常，请重试。</Alert>`;

const closableCode = `<Alert type="success" title="操作成功" closable onClose={() => {}}>
  数据已保存，点击 × 可关闭。
</Alert>`;

export function AlertPage() {
  return (
    <>
      <h2>Alert 警告提示</h2>
      <p>展示需要用户关注的信息，四种语义类型，可关闭。</p>

      <Demo title="四种类型" code={typesCode}>
        <Alert title="信息提示">这是一条信息提示。</Alert>
        <Alert type="success" title="操作成功">数据已保存。</Alert>
        <Alert type="warning" title="注意">配额即将用尽。</Alert>
        <Alert type="error" title="操作失败">网络异常，请重试。</Alert>
      </Demo>

      <Demo title="可关闭" code={closableCode}>
        <Alert type="success" title="操作成功" closable>数据已保存，点击 × 可关闭。</Alert>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['type', '语义类型', "'info' | 'success' | 'warning' | 'error'", "'info'"],
          ['title', '标题', 'ReactNode', '必填'],
          ['closable', '显示关闭按钮', 'boolean', 'false'],
          ['onClose', '关闭回调', '() => void', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 四处修改同前：PageKey 加 `'alert'`（字母序最前）、keys 数组、组件组 keys 最前加 `'alert'`、pages 数组加对应行、import 加 `import { AlertPage } from './pages/AlertPage';`（ButtonPage 之前）。

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`
Expected: 无报错

```bash
git add packages/components/src/alert packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/AlertPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Alert component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4: Tooltip 文字提示

**Files:**
- Create: `packages/components/src/tooltip/Tooltip.tsx`
- Create: `packages/components/src/tooltip/types.ts`
- Create: `packages/components/src/tooltip/tooltip.css`
- Create: `packages/components/src/tooltip/index.ts`
- Test: `packages/components/src/tooltip/Tooltip.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/TooltipPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册四件套）

**Interfaces:**
- Consumes: `cn()`
- Produces: `export const Tooltip`、`export type TooltipProps`。`TooltipProps extends React.HTMLAttributes<HTMLSpanElement>`，新增 `title: string`（必填，气泡文案）、`placement?: 'top' | 'bottom'`（默认 'top'）。

设计取舍（ponytail 天花板标注在实现里）：纯 CSS `::after` + `attr(data-tip)` 方案，hover/focus-visible 显示。不做 JS 定位与翻转——溢出容器内会被裁剪，需要时升级为 portal + 定位计算。

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/tooltip/Tooltip.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Button } from '../button';
import { Tooltip } from './Tooltip';

afterEach(cleanup);

describe('Tooltip', () => {
  test('气泡文案挂到 data-tip，不渲染额外可见节点，不挡子元素', () => {
    render(
      <Tooltip title="删除该条目">
        <Button>删除</Button>
      </Tooltip>,
    );

    const wrapper = screen.getByRole('button', { name: '删除' }).parentElement!;
    expect(wrapper.getAttribute('data-tip')).toBe('删除该条目');
    expect(screen.queryByText('删除该条目')).toBeNull(); // ::after 内容不进 DOM
  });

  test('placement 透出对应 modifier 类', () => {
    const { container } = render(
      <Tooltip title="提示" placement="bottom">
        <span>目标</span>
      </Tooltip>,
    );

    expect(container.firstElementChild!.className).toContain('reef-tooltip--bottom');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Tooltip'`）

- [ ] **Step 3: 最小实现**

```ts
// packages/components/src/tooltip/types.ts
import type * as React from 'react';

export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 气泡文案 */
  title: string;
  /** 显示位置 */
  placement?: 'top' | 'bottom';
}
```

```tsx
// packages/components/src/tooltip/Tooltip.tsx
import { cn } from '@reef-ui/utils';
import type { TooltipProps } from './types';
import './tooltip.css';

// ponytail: 纯 CSS 气泡（::after + attr(data-tip)），不做 JS 定位/翻转；
// 溢出容器内会被裁剪，需要时升级为 portal + getBoundingClientRect 定位
export function Tooltip({ title, placement = 'top', className, children, ...rest }: TooltipProps) {
  return (
    <span className={cn('reef-tooltip', `reef-tooltip--${placement}`, className)} data-tip={title} {...rest}>
      {children}
    </span>
  );
}
```

```css
/* packages/components/src/tooltip/tooltip.css */
.reef-tooltip {
  position: relative;
  display: inline-flex;
}

.reef-tooltip::after {
  content: attr(data-tip);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 6px);
  z-index: 100;
  padding: 5px 10px;
  border-radius: var(--reef-radius-sm);
  font-size: var(--reef-font-size-sm);
  line-height: 1.5;
  white-space: nowrap;
  color: var(--reef-color-surface);
  background: color-mix(in srgb, var(--reef-color-text-primary) 94%, var(--reef-color-surface));
  translate: -50% 0;
  opacity: 0;
  /* 气泡绝不拦截指针，否则会挡住被包裹元素的点击 */
  pointer-events: none;
  transition: opacity 0.15s;
}

.reef-tooltip--bottom::after {
  bottom: auto;
  top: calc(100% + 6px);
}

.reef-tooltip:hover::after,
.reef-tooltip:focus-within::after {
  opacity: 1;
}
```

```ts
// packages/components/src/tooltip/index.ts
export { Tooltip } from './Tooltip';
export type { TooltipProps } from './types';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/TooltipPage.tsx
import { Button, Tooltip } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Tooltip title="删除该条目">
  <Button>删除</Button>
</Tooltip>
<Tooltip title="顶部提示" placement="top">
  <Button>上方</Button>
</Tooltip>`;

export function TooltipPage() {
  return (
    <>
      <h2>Tooltip 文字提示</h2>
      <p>鼠标悬停或键盘聚焦时显示的轻量气泡，纯 CSS 实现。</p>

      <Demo title="基础用法" code={basicCode}>
        <Tooltip title="删除该条目">
          <Button>删除</Button>
        </Tooltip>
        <Tooltip title="我在下面" placement="bottom">
          <Button>下方</Button>
        </Tooltip>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['title', '气泡文案', 'string', '必填'],
          ['placement', '显示位置', "'top' | 'bottom'", "'top'"],
        ]}
      />
    </>
  );
}
```

App.tsx 四处修改同前模式，key 用 `'tooltip'`，title `'Tooltip 文字提示'`。

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`
Expected: 无报错

```bash
git add packages/components/src/tooltip packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/TooltipPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Tooltip component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 5: Modal 对话框

**Files:**
- Create: `packages/components/src/modal/Modal.tsx`
- Create: `packages/components/src/modal/types.ts`
- Create: `packages/components/src/modal/modal.css`
- Create: `packages/components/src/modal/index.ts`
- Test: `packages/components/src/modal/Modal.test.tsx`
- Modify: `packages/components/package.json`（加 devDep `react-dom` + `@types/react-dom`，加 peerDep `"react-dom": ">=18"`）
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/ModalPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册四件套）

**Interfaces:**
- Consumes: `cn()`、`createPortal` from `react-dom`
- Produces: `export const Modal`、`export type ModalProps`。`ModalProps`：`open: boolean`（必填，受控）、`title?: ReactNode`、`width?: number`（默认 480）、`footer?: ReactNode`、`onClose?: () => void`、`children?: ReactNode`、`className?: string`。关闭途径：Esc、点击遮罩（footer 取消按钮由使用方自己渲染，调 `onClose` 的 setter）。

- [ ] **Step 0: 安装依赖**

```bash
pnpm --filter @reef-ui/components add -D react-dom@^18.3.1 @types/react-dom@^18
```

并在 `packages/components/package.json` 的 `peerDependencies` 中加 `"react-dom": ">=18"`。

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/modal/Modal.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Modal } from './Modal';

afterEach(cleanup);

describe('Modal', () => {
  test('open 时通过 portal 渲染 dialog，open=false 不渲染', () => {
    const { rerender } = render(
      <Modal open title="标题">
        内容
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: '标题' })).toBeTruthy();
    expect(screen.getByText('内容')).toBeTruthy();

    rerender(
      <Modal open={false} title="标题">
        内容
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('Esc 触发 onClose', async () => {
    const handleClose = vi.fn();
    render(
      <Modal open onClose={handleClose}>
        内容
      </Modal>,
    );

    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('点击遮罩触发 onClose，点击对话框内部不触发', async () => {
    const handleClose = vi.fn();
    render(
      <Modal open onClose={handleClose}>
        <button type="button">内部按钮</button>
      </Modal>,
    );

    await userEvent.click(screen.getByRole('button', { name: '内部按钮' }));
    expect(handleClose).not.toHaveBeenCalled();

    // 遮罩 = dialog 的直接父级
    const overlay = screen.getByRole('dialog').parentElement!;
    await userEvent.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Modal'`）

- [ ] **Step 3: 最小实现**

```ts
// packages/components/src/modal/types.ts
import type * as React from 'react';

export interface ModalProps {
  /** 受控开关，必填 */
  open: boolean;
  title?: React.ReactNode;
  /** 宽度（px） */
  width?: number;
  /** 底部操作区（取消/确定按钮由使用方渲染） */
  footer?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}
```

```tsx
// packages/components/src/modal/Modal.tsx
import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@reef-ui/utils';
import type { ModalProps } from './types';
import './modal.css';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function Modal({ open, title, width = 480, footer, onClose, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    // ponytail: 直接置 body overflow，多弹窗叠加时需改为计数器
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose?.();
      return;
    }
    if (e.key !== 'Tab') return;
    // 简易焦点圈：Shift+Tab 在第一个、Tab 在最后一个时绕回
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div
      className="reef-modal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
        style={{ width }}
        className={cn('reef-modal__dialog', className)}
        onKeyDown={handleKeyDown}
      >
        {title != null && (
          <div className="reef-modal__header">
            <h4 className="reef-modal__title">{title}</h4>
            <button type="button" className="reef-modal__close" aria-label="关闭" onClick={() => onClose?.()}>
              ×
            </button>
          </div>
        )}
        <div className="reef-modal__body">{children}</div>
        {footer != null && <div className="reef-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
```

```css
/* packages/components/src/modal/modal.css */
.reef-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 80px 24px;
  overflow-y: auto;
  background: rgb(0 0 0 / 45%);
  animation: reef-modal-fade 0.2s ease;
}

.reef-modal__dialog {
  box-sizing: border-box;
  max-width: 100%;
  border-radius: var(--reef-radius-lg);
  background: var(--reef-color-surface);
  box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
  outline: none;
  animation: reef-modal-zoom 0.2s ease;
}

.reef-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--reef-space-sm);
  padding: var(--reef-space-lg) var(--reef-space-xl);
  border-bottom: 1px solid color-mix(in srgb, var(--reef-color-text-primary) 10%, transparent);
}

.reef-modal__title {
  margin: 0;
  font-size: var(--reef-font-size-lg);
  font-weight: 600;
  color: var(--reef-color-text-primary);
}

.reef-modal__close {
  padding: 0;
  border: none;
  background: none;
  font-size: 18px;
  line-height: 1;
  color: var(--reef-color-text-secondary);
  cursor: pointer;
}

.reef-modal__close:hover {
  color: var(--reef-color-text-primary);
}

.reef-modal__body {
  padding: var(--reef-space-xl);
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-primary);
}

.reef-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--reef-space-sm);
  padding: var(--reef-space-md) var(--reef-space-xl);
  border-top: 1px solid color-mix(in srgb, var(--reef-color-text-primary) 10%, transparent);
}

@keyframes reef-modal-fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes reef-modal-zoom {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reef-modal,
  .reef-modal__dialog {
    animation: none;
  }
}
```

```ts
// packages/components/src/modal/index.ts
export { Modal } from './Modal';
export type { ModalProps } from './types';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/ModalPage.tsx
import { Button, Modal } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';
import { useState } from 'react';

const basicCode = `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>打开对话框</Button>
<Modal
  open={open}
  title="确认删除"
  onClose={() => setOpen(false)}
  footer={
    <>
      <Button onClick={() => setOpen(false)}>取消</Button>
      <Button variant="primary" onClick={() => setOpen(false)}>删除</Button>
    </>
  }
>
  <p>删除后不可恢复，确定继续吗？</p>
</Modal>`;

export function ModalPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <h2>Modal 对话框</h2>
      <p>模态对话框：Esc / 遮罩点击关闭，自动焦点圈与滚动锁定。</p>

      <Demo title="基础用法" code={basicCode}>
        <Button onClick={() => setOpen(true)}>打开对话框</Button>
        <Modal
          open={open}
          title="确认删除"
          onClose={() => setOpen(false)}
          footer={
            <>
              <Button onClick={() => setOpen(false)}>取消</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>删除</Button>
            </>
          }
        >
          <p>删除后不可恢复，确定继续吗？</p>
        </Modal>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['open', '受控开关', 'boolean', '必填'],
          ['title', '标题', 'ReactNode', '—'],
          ['width', '宽度（px）', 'number', '480'],
          ['footer', '底部操作区', 'ReactNode', '—'],
          ['onClose', 'Esc / 遮罩 / × 关闭回调', '() => void', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 四处修改同前模式，key `'modal'`，title `'Modal 对话框'`。

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`
Expected: 无报错

```bash
git add packages/components/src/modal packages/components/package.json packages/components/src/index.ts packages/components/src/style.css pnpm-lock.yaml apps/docs/src/pages/ModalPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Modal component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 6: Tabs 标签页

**Files:**
- Create: `packages/components/src/tabs/Tabs.tsx`
- Create: `packages/components/src/tabs/types.ts`
- Create: `packages/components/src/tabs/tabs.css`
- Create: `packages/components/src/tabs/index.ts`
- Test: `packages/components/src/tabs/Tabs.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/TabsPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册四件套）

**Interfaces:**
- Consumes: `cn()`
- Produces: `export const Tabs`、`export type TabsProps, TabsItem`。`TabsItem = { key: string; label: ReactNode; children: ReactNode }`；`TabsProps`：`items: TabsItem[]`（必填）、`activeKey?: string`、`defaultActiveKey?: string`（默认第一项）、`onChange?: (key: string) => void`、`className?: string`。键盘：← → 切换且到边界即停（与 Select 一致），焦点跟随。

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/tabs/Tabs.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Tabs } from './Tabs';

const items = [
  { key: 'a', label: '标签一', children: <p>内容一</p> },
  { key: 'b', label: '标签二', children: <p>内容二</p> },
  { key: 'c', label: '标签三', children: <p>内容三</p> },
];

afterEach(cleanup);

describe('Tabs', () => {
  test('点击切换激活 tab 与 panel，aria-selected 正确', async () => {
    const handleChange = vi.fn();
    render(<Tabs items={items} defaultActiveKey="a" onChange={handleChange} />);

    expect(screen.getByRole('tab', { name: '标签一' }).getAttribute('aria-selected')).toBe('true');
    await userEvent.click(screen.getByRole('tab', { name: '标签二' }));
    expect(handleChange).toHaveBeenCalledWith('b');
    expect(screen.getByText('内容二')).toBeTruthy();
    expect(screen.getByText('内容一').closest('[role="tabpanel"]')).toHaveProperty('hidden', true);
  });

  test('← → 键盘切换，到边界即停不循环', async () => {
    render(<Tabs items={items} defaultActiveKey="a" />);

    const first = screen.getByRole('tab', { name: '标签一' });
    first.focus();
    await userEvent.keyboard('{ArrowLeft}'); // 已在最左，应停在标签一
    expect(screen.getByRole('tab', { name: '标签一' }).getAttribute('aria-selected')).toBe('true');

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: '标签二' }).getAttribute('aria-selected')).toBe('true');
  });

  test('受控模式：activeKey 不变则点击不切换', async () => {
    render(<Tabs items={items} activeKey="a" />);

    await userEvent.click(screen.getByRole('tab', { name: '标签三' }));
    expect(screen.getByRole('tab', { name: '标签一' }).getAttribute('aria-selected')).toBe('true');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Tabs'`）

- [ ] **Step 3: 最小实现**

```ts
// packages/components/src/tabs/types.ts
import type * as React from 'react';

export interface TabsItem {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
}

export interface TabsProps {
  items: TabsItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  className?: string;
}
```

```tsx
// packages/components/src/tabs/Tabs.tsx
import { useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { TabsProps } from './types';
import './tabs.css';

export function Tabs({ items, activeKey, defaultActiveKey, onChange, className }: TabsProps) {
  const [inner, setInner] = useState(defaultActiveKey ?? items[0]?.key);
  const current = activeKey ?? inner;
  const listRef = useRef<HTMLDivElement>(null);

  const select = (key: string) => {
    if (activeKey === undefined) setInner(key);
    onChange?.(key);
  };

  // 方向键切换，到边界即停（与 Select 行为一致）
  const move = (delta: number) => {
    const index = items.findIndex((item) => item.key === current);
    const next = Math.min(Math.max(index + delta, 0), items.length - 1);
    const item = items[next];
    if (!item || item.key === current) return;
    select(item.key);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div className={cn('reef-tabs', className)}>
      <div ref={listRef} role="tablist" className="reef-tabs__list">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={item.key === current}
            tabIndex={item.key === current ? 0 : -1}
            className={cn('reef-tabs__tab', item.key === current && 'reef-tabs__tab--active')}
            onClick={() => select(item.key)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                move(1);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                move(-1);
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div key={item.key} role="tabpanel" hidden={item.key !== current} className="reef-tabs__panel">
          {item.children}
        </div>
      ))}
    </div>
  );
}
```

```css
/* packages/components/src/tabs/tabs.css */
.reef-tabs__list {
  display: flex;
  gap: var(--reef-space-xs);
  border-bottom: 1px solid color-mix(in srgb, var(--reef-color-text-primary) 10%, transparent);
}

.reef-tabs__tab {
  padding: var(--reef-space-sm) var(--reef-space-lg);
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  background: none;
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-secondary);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.reef-tabs__tab:hover {
  color: var(--reef-color-text-primary);
}

.reef-tabs__tab--active {
  border-bottom-color: var(--reef-color-brand);
  color: var(--reef-color-brand);
  font-weight: 600;
}

.reef-tabs__tab:focus-visible {
  outline: 2px solid var(--reef-color-brand);
  outline-offset: -2px;
  border-radius: var(--reef-radius-sm);
}

.reef-tabs__panel {
  padding-top: var(--reef-space-lg);
  font-size: var(--reef-font-size-md);
  color: var(--reef-color-text-primary);
}
```

```ts
// packages/components/src/tabs/index.ts
export { Tabs } from './Tabs';
export type { TabsProps, TabsItem } from './types';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/TabsPage.tsx
import { Tabs } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Tabs
  defaultActiveKey="order"
  items={[
    { key: 'order', label: '订单', children: <p>订单列表</p> },
    { key: 'refund', label: '退款', children: <p>退款列表</p> },
    { key: 'settings', label: '设置', children: <p>设置面板</p> },
  ]}
/>`;

export function TabsPage() {
  return (
    <>
      <h2>Tabs 标签页</h2>
      <p>内容分区切换，支持 ← → 键盘导航（ARIA tabs 模式）。</p>

      <Demo
        title="基础用法"
        code={basicCode}
      >
        <Tabs
          defaultActiveKey="order"
          items={[
            { key: 'order', label: '订单', children: <p>订单列表</p> },
            { key: 'refund', label: '退款', children: <p>退款列表</p> },
            { key: 'settings', label: '设置', children: <p>设置面板</p> },
          ]}
        />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '标签页配置', 'TabsItem[]', '必填'],
          ['activeKey / defaultActiveKey', '当前 key', 'string', '第一项'],
          ['onChange', '切换回调', '(key: string) => void', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 四处修改同前模式，key `'tabs'`，title `'Tabs 标签页'`。

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`
Expected: 无报错

```bash
git add packages/components/src/tabs packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/TabsPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Tabs component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 7: Pagination 分页

**Files:**
- Create: `packages/components/src/pagination/Pagination.tsx`
- Create: `packages/components/src/pagination/types.ts`
- Create: `packages/components/src/pagination/pagination.css`
- Create: `packages/components/src/pagination/index.ts`
- Test: `packages/components/src/pagination/Pagination.test.tsx`
- Modify: `packages/components/src/index.ts`、`packages/components/src/style.css`
- Create: `apps/docs/src/pages/PaginationPage.tsx`
- Modify: `apps/docs/src/App.tsx`（注册四件套）

**Interfaces:**
- Consumes: `cn()`
- Produces: `export const Pagination`、`export type PaginationProps`。`PaginationProps`：`total: number`（必填）、`pageSize?: number`（默认 10）、`current?: number`、`defaultCurrent?: number`（默认 1）、`onChange?: (page: number) => void`、`className?: string`。页码序列：总页数 ≤7 全显示；否则始终含 1、末页、当前页及其前后一页，间隔处渲染省略号（`…` 文本 span）。

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/pagination/Pagination.test.tsx
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Pagination } from './Pagination';

afterEach(cleanup);

describe('Pagination', () => {
  test('渲染页码，点击翻页触发 onChange', async () => {
    const handleChange = vi.fn();
    render(<Pagination total={100} defaultCurrent={1} onChange={handleChange} />);

    await userEvent.click(screen.getByRole('button', { name: '第 3 页' }));
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  test('上一页/下一页按钮与禁用态', async () => {
    const handleChange = vi.fn();
    render(<Pagination total={30} defaultCurrent={1} onChange={handleChange} />);

    const prev = screen.getByRole('button', { name: '上一页' });
    expect((prev as HTMLButtonElement).disabled).toBe(true);

    await userEvent.click(screen.getByRole('button', { name: '下一页' }));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  test('current 越界钳制到最后一页（Review Focus #3）', () => {
    render(<Pagination total={30} current={99} />);
    expect(screen.getByRole('button', { name: '第 3 页' }).getAttribute('aria-current')).toBe('page');
  });

  test('页数多时出现省略号', () => {
    render(<Pagination total={200} current={10} />);
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `pnpm --filter @reef-ui/components test`
Expected: FAIL（`Cannot find module './Pagination'`）

- [ ] **Step 3: 最小实现**

```ts
// packages/components/src/pagination/types.ts
export interface PaginationProps {
  /** 数据总条数 */
  total: number;
  /** 每页条数 */
  pageSize?: number;
  current?: number;
  defaultCurrent?: number;
  onChange?: (page: number) => void;
  className?: string;
}
```

```tsx
// packages/components/src/pagination/Pagination.tsx
import { useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { PaginationProps } from './types';
import './pagination.css';

type PageItem = number | 'ellipsis';

/** 页码序列：总页数少则全显，多则 1 / 当前±1 / 末页 + 省略号 */
function pageItems(current: number, count: number): PageItem[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const picked = new Set<number>([1, count, current - 1, current, current + 1]);
  const sorted = [...picked].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  const result: PageItem[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push('ellipsis');
    result.push(p);
    prev = p;
  }
  return result;
}

export function Pagination({ total, pageSize = 10, current, defaultCurrent = 1, onChange, className }: PaginationProps) {
  const count = Math.max(1, Math.ceil(total / pageSize));
  const [inner, setInner] = useState(Math.min(defaultCurrent, count));
  // 越界直接钳制到 [1, count]，受控值过大时显示最后一页
  const page = Math.min(Math.max(current ?? inner, 1), count);

  const go = (next: number) => {
    if (next < 1 || next > count || next === page) return;
    if (current === undefined) setInner(next);
    onChange?.(next);
  };

  return (
    <nav aria-label="分页" className={cn('reef-pagination', className)}>
      <button
        type="button"
        className="reef-pagination__btn"
        aria-label="上一页"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        ‹
      </button>
      {pageItems(page, count).map((item, i) =>
        item === 'ellipsis' ? (
          <span key={`e${i}`} className="reef-pagination__ellipsis">…</span>
        ) : (
          <button
            key={item}
            type="button"
            className={cn('reef-pagination__btn', item === page && 'reef-pagination__btn--active')}
            aria-label={`第 ${item} 页`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => go(item)}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className="reef-pagination__btn"
        aria-label="下一页"
        disabled={page >= count}
        onClick={() => go(page + 1)}
      >
        ›
      </button>
    </nav>
  );
}
```

```css
/* packages/components/src/pagination/pagination.css */
.reef-pagination {
  display: flex;
  align-items: center;
  gap: var(--reef-space-xs);
}

.reef-pagination__btn {
  box-sizing: border-box;
  min-width: 28px;
  height: 28px;
  padding: 0 var(--reef-space-sm);
  border: 1px solid color-mix(in srgb, var(--reef-color-text-primary) 15%, transparent);
  border-radius: var(--reef-radius-sm);
  background: var(--reef-color-surface);
  font-size: var(--reef-font-size-sm);
  color: var(--reef-color-text-primary);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.reef-pagination__btn:hover:not(:disabled) {
  border-color: var(--reef-color-brand);
  color: var(--reef-color-brand);
}

.reef-pagination__btn--active {
  border-color: var(--reef-color-brand);
  background: var(--reef-color-brand);
  color: #fff;
}

.reef-pagination__btn:disabled {
  color: var(--reef-color-text-disabled);
  cursor: not-allowed;
}

.reef-pagination__ellipsis {
  min-width: 28px;
  text-align: center;
  color: var(--reef-color-text-secondary);
}
```

```ts
// packages/components/src/pagination/index.ts
export { Pagination } from './Pagination';
export type { PaginationProps } from './types';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `pnpm --filter @reef-ui/components test`
Expected: PASS

- [ ] **Step 5: 文档页 + App 注册**

```tsx
// apps/docs/src/pages/PaginationPage.tsx
import { Pagination } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Pagination total={100} defaultCurrent={1} onChange={(page) => console.log(page)} />`;

const moreCode = `<Pagination total={200} defaultCurrent={10} />`;

export function PaginationPage() {
  return (
    <>
      <h2>Pagination 分页</h2>
      <p>长列表分页导航，页数多时自动折叠为省略号。</p>

      <Demo title="基础用法" code={basicCode}>
        <Pagination total={100} />
      </Demo>

      <Demo title="页数较多" code={moreCode}>
        <Pagination total={200} defaultCurrent={10} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['total', '数据总条数', 'number', '必填'],
          ['pageSize', '每页条数', 'number', '10'],
          ['current / defaultCurrent', '当前页', 'number', '1'],
          ['onChange', '页码变化回调', '(page: number) => void', '—'],
        ]}
      />
    </>
  );
}
```

App.tsx 四处修改同前模式，key `'pagination'`，title `'Pagination 分页'`。

- [ ] **Step 6: lint + stylelint + 提交**

Run: `pnpm lint && pnpm stylelint`
Expected: 无报错

```bash
git add packages/components/src/pagination packages/components/src/index.ts packages/components/src/style.css apps/docs/src/pages/PaginationPage.tsx apps/docs/src/App.tsx
git commit -m "feat: add Pagination component

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 8: 全量回归 + 更新使用指南

**Files:**
- Modify: `apps/docs/src/pages/GuidePage.tsx`（组件列表若有清单则补上 7 个新组件）
- Test: 无新测试；回归跑全部

**Interfaces:**
- Consumes: 前 7 个任务的全部导出
- Produces: 全绿的 main 分支

- [ ] **Step 1: 全量验证**

Run: `pnpm test && pnpm lint && pnpm stylelint && pnpm build && pnpm --filter docs build`
Expected: 全部通过。任何失败按报错回到对应任务修根因。

- [ ] **Step 2: 手工过一遍文档站**

启动 `pnpm docs`，逐页点开 7 个新组件页，检查 demo 可交互、暗色模式下无样式穿帮（Modal 遮罩、Tag 各色、Tooltip 气泡底色）。

- [ ] **Step 3: 提交收尾（如有 GuidePage 改动）**

```bash
git add apps/docs/src/pages/GuidePage.tsx
git commit -m "docs: add batch-2 components to guide

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```
