# Scroll 滚动容器实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 `<Scroll>` 组件——覆盖式自定义滚动条容器，hover 淡入、移开淡出、滑块可拖拽。

**Architecture:** 隐藏原生滚动条的 `overflow: auto` 内容层 + 绝对定位的自绘 bar/thumb；几何计算抽为纯函数 `calcThumb`；`scroll` 事件与 `ResizeObserver` 双时机驱动 React state；Pointer Events 拖拽经 scroll 回路写回 `scrollTop`。

**Tech Stack:** React 18（函数组件 + hooks）、vitest + @testing-library/react + jsdom、CSS（BEM `reef-` 前缀 + theme token）、无新依赖。

**Spec:** docs/superpowers/specs/2026-10-10-scroll-component-design.md

## Global Constraints

- BEM 命名 `reef-scroll*`；颜色/圆角/间距只引用 `--reef-*` token，不写死色值。
- 不新增任何 npm 依赖。
- 组件文件模式：`packages/components/src/scroll/{thumb.ts,Scroll.tsx,types.ts,scroll.css,index.ts,Scroll.test.tsx}`；导出模式与 `src/progress` 一致（具名导出 + `export type`）。
- 测试：vitest 显式导入（`import { describe, test, expect, vi } from 'vitest'`），jsdom 环境，`afterEach(cleanup)`。
- jsdom 无布局：所有几何用 `Object.defineProperty` mock 到元素实例上；`ResizeObserver` 用 `vi.stubGlobal` 桩。
- `docs/` 目录不提交 git；提交信息以 `Co-Authored-By: Claude Code <noreply@anthropic.com>` 结尾。
- 每个任务完成后的门禁：`pnpm --filter @reef-ui/components test`；最终门禁：`pnpm lint && pnpm build`。

## Review Focus

spec 的四条评审重点 + 一条边界，逐条钉到任务：

1. **异步内容变更漏测**（spec 评审重点 1）：`scrollHeight` 变化无 scroll 事件 → ResizeObserver 必须同时观察 `__content` 与 `__inner` 两个目标 → Task 3 测试 `RO observe 两个目标`。
2. **拖拽除零**（spec 评审重点 2）：内容略溢出时 `轨道长 - 滑块高` 可能为 0（24px 下限撑满轨道），除零产生 NaN 打飞 scrollTop → Task 4 测试 `trackRange ≤ 0 时 scrollTop 不变且无 NaN`。
3. **双轴联动误判**（spec 评审重点 3）：仅纵向溢出时横向 bar 不得出现 → Task 3 测试 `仅 y 溢出 → 只渲染 y bar`。
4. **hover 加粗基准跳动**（spec 评审重点 4）：加粗方向垂直于滚动轴（宽度 8→10），不改变沿轴 offset，CSS 实现 → Task 5 人工验证项，附验证命令。
5. **内容恰好等于视口**（spec 边界）：`content === viewport` 不出现 bar → Task 3 测试断言 `needed` 为 false。

---

### Task 1: calcThumb 纯函数

**Files:**
- Create: `packages/components/src/scroll/thumb.ts`
- Test: `packages/components/src/scroll/thumb.test.ts`

**Interfaces:**
- Consumes: 无
- Produces: `calcThumb(viewport, content, scroll, track): ThumbGeometry`，`MIN_THUMB = 24`。Task 2-4 从 `'./thumb'` 导入。

- [ ] **Step 1: 写失败测试**

```ts
// packages/components/src/scroll/thumb.test.ts
import { describe, expect, test } from 'vitest';
import { calcThumb } from './thumb';

describe('calcThumb', () => {
  test('无溢出时 needed 为 false', () => {
    expect(calcThumb(200, 200, 0, 192)).toEqual({ size: 0, offset: 0, needed: false });
    expect(calcThumb(200, 150, 0, 192).needed).toBe(false);
  });

  test('滑块大小 = 轨道 × 视口/内容', () => {
    // viewport 200, content 400, track 192 → size 96
    expect(calcThumb(200, 400, 0, 192).size).toBe(96);
  });

  test('滑块有 24px 下限（内容略溢出时不会被压成针尖）', () => {
    // viewport 200, content 100000, track 192 → 0.384 → clamp 24
    expect(calcThumb(200, 100000, 0, 192).size).toBe(24);
  });

  test('offset 随 scroll 线性映射到 [0, track - size]', () => {
    const g = calcThumb(200, 400, 100, 192); // maxScroll 200, track-size 96
    expect(g.offset).toBe(48);
    expect(calcThumb(200, 400, 200, 192).offset).toBe(96);
    expect(calcThumb(200, 400, 0, 192).offset).toBe(0);
  });

  test('content === viewport 视为无溢出（Review Focus #5）', () => {
    expect(calcThumb(200, 200, 0, 192).needed).toBe(false);
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/components && pnpm vitest run src/scroll/thumb.test.ts`
Expected: FAIL，`Cannot find module './thumb'`

- [ ] **Step 3: 最小实现**

```ts
// packages/components/src/scroll/thumb.ts
export const MIN_THUMB = 24;

export interface ThumbGeometry {
  /** 滑块沿轴长度（px）；不需要滚动时为 0 */
  size: number;
  /** 滑块沿轴偏移（px），相对轨道起点 */
  offset: number;
  /** 该轴是否真的溢出、需要滚动条 */
  needed: boolean;
}

/**
 * 由视口/内容/滚动位置算滑块几何。track 为轨道可用长度
 * （轨道长减去上下（左右）各 4px 内边距）。
 */
export function calcThumb(viewport: number, content: number, scroll: number, track: number): ThumbGeometry {
  const needed = content > viewport;
  if (!needed) return { size: 0, offset: 0, needed: false };
  const size = Math.max(MIN_THUMB, track * (viewport / content));
  const maxScroll = content - viewport;
  const offset = maxScroll <= 0 ? 0 : (scroll / maxScroll) * (track - size);
  return { size, offset, needed: true };
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/components && pnpm vitest run src/scroll/thumb.test.ts`
Expected: PASS 5/5

- [ ] **Step 5: 提交**

```bash
git add packages/components/src/scroll/thumb.ts packages/components/src/scroll/thumb.test.ts
git commit -m "feat(Scroll): calcThumb 滑块几何纯函数"
```

---

### Task 2: Scroll 组件骨架（结构 + 无溢出不出 bar）

**Files:**
- Create: `packages/components/src/scroll/types.ts`
- Create: `packages/components/src/scroll/Scroll.tsx`
- Create: `packages/components/src/scroll/scroll.css`
- Create: `packages/components/src/scroll/index.ts`
- Modify: `packages/components/src/index.ts`（在 `export * from './result';` 之后加一行）
- Test: `packages/components/src/scroll/Scroll.test.tsx`

**Interfaces:**
- Consumes: `calcThumb`、`MIN_THUMB`（Task 1）
- Produces: `Scroll`（React 组件）、`ScrollProps`。Task 3 在 `Scroll.tsx` 上扩展几何更新，Task 4 扩展拖拽。

- [ ] **Step 1: 写失败测试**

```tsx
// packages/components/src/scroll/Scroll.test.tsx
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Scroll } from './Scroll';

// jsdom 没有 ResizeObserver：桩掉，实例收集到数组供断言
const roInstances: { observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn>; unobserve: ReturnType<typeof vi.fn>; cb: ResizeObserverCallback }[] = [];
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(cb: ResizeObserverCallback) {
    roInstances.push({ observe: this.observe, disconnect: this.disconnect, unobserve: this.unobserve, cb });
  }
}
vi.stubGlobal('ResizeObserver', MockResizeObserver);

afterEach(() => {
  cleanup();
  roInstances.length = 0;
});

/** jsdom 无布局：把盒模型 mock 到元素实例上 */
function mockBox(el: HTMLElement, box: Partial<{ clientHeight: number; scrollHeight: number; scrollTop: number; clientWidth: number; scrollWidth: number; scrollLeft: number }>) {
  for (const [key, value] of Object.entries(box)) {
    Object.defineProperty(el, key, { configurable: true, value });
  }
}

describe('Scroll', () => {
  test('渲染内容层与 inner 包裹层', () => {
    const { container } = render(<Scroll>内容</Scroll>);
    expect(container.querySelector('.reef-scroll__content')).toBeTruthy();
    expect(container.querySelector('.reef-scroll__inner')!.textContent).toBe('内容');
  });

  test('jsdom 零尺寸（无溢出）下不渲染任何 bar', () => {
    const { container } = render(<Scroll>内容</Scroll>);
    expect(container.querySelector('.reef-scroll__bar--y')).toBeNull();
    expect(container.querySelector('.reef-scroll__bar--x')).toBeNull();
  });

  test('maxHeight 透传为 style', () => {
    const { container } = render(<Scroll maxHeight={320}>内容</Scroll>);
    expect((container.firstElementChild as HTMLElement).style.maxHeight).toBe('320px');
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/components && pnpm vitest run src/scroll/Scroll.test.tsx`
Expected: FAIL，`Cannot find module './Scroll'`

- [ ] **Step 3: 最小实现**

```ts
// packages/components/src/scroll/types.ts
import type { CSSProperties, ReactNode } from 'react';

export interface ScrollProps {
  /** 便捷限高（数字按 px，或任意 CSS 值）；不传时容器尺寸由消费方样式决定 */
  maxHeight?: number | string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
```

```tsx
// packages/components/src/scroll/Scroll.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { calcThumb, type ThumbGeometry } from './thumb';
import type { ScrollProps } from './types';
import './scroll.css';

/** 轨道两端各留 4px，滑块不出容器圆角 */
const TRACK_INSET = 4;

interface AxisState {
  y: ThumbGeometry;
  x: ThumbGeometry;
}

const NO_OVERFLOW: AxisState = {
  y: { size: 0, offset: 0, needed: false },
  x: { size: 0, offset: 0, needed: false },
};

export function Scroll({ maxHeight, className, style, children }: ScrollProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [geom, setGeom] = useState<AxisState>(NO_OVERFLOW);

  const measure = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    setGeom({
      y: calcThumb(el.clientHeight, el.scrollHeight, el.scrollTop, el.clientHeight - TRACK_INSET * 2),
      x: calcThumb(el.clientWidth, el.scrollWidth, el.scrollLeft, el.clientWidth - TRACK_INSET * 2),
    });
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    const inner = innerRef.current;
    if (!content) return;
    // 内容异步变更不产生 scroll 事件，靠 RO 兜底（spec 评审重点 1）
    const ro = new ResizeObserver(measure);
    ro.observe(content);
    if (inner) ro.observe(inner);
    measure();
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div className={cn('reef-scroll', className)} style={{ maxHeight, ...style }}>
      <div className="reef-scroll__content" ref={contentRef} tabIndex={0} onScroll={measure}>
        <div className="reef-scroll__inner" ref={innerRef}>
          {children}
        </div>
      </div>
      {geom.y.needed && (
        <div className="reef-scroll__bar reef-scroll__bar--y">
          <div className="reef-scroll__thumb" style={{ height: geom.y.size, transform: `translateY(${geom.y.offset}px)` }} />
        </div>
      )}
      {geom.x.needed && (
        <div className="reef-scroll__bar reef-scroll__bar--x">
          <div className="reef-scroll__thumb" style={{ width: geom.x.size, transform: `translateX(${geom.x.offset}px)` }} />
        </div>
      )}
    </div>
  );
}
```

```css
/* packages/components/src/scroll/scroll.css */
.reef-scroll {
  position: relative;
}

.reef-scroll__content {
  height: 100%;
  overflow: auto;
  /* 隐藏原生滚动条：Firefox 与 Webkit 双路径 */
  scrollbar-width: none;
}

.reef-scroll__content::-webkit-scrollbar {
  display: none;
}

.reef-scroll__bar {
  position: absolute;
  z-index: 1;
  border-radius: var(--reef-radius-full);
}

.reef-scroll__bar--y {
  top: 4px;
  right: 2px;
  bottom: 4px;
  width: 8px;
}

.reef-scroll__bar--x {
  left: 4px;
  right: 4px;
  bottom: 2px;
  height: 8px;
}

.reef-scroll__thumb {
  border-radius: var(--reef-radius-full);
  background: color-mix(in srgb, var(--reef-color-text-primary) 20%, transparent);
}
```

```ts
// packages/components/src/scroll/index.ts
export { Scroll } from './Scroll';
export type { ScrollProps } from './types';
```

`packages/components/src/index.ts`：在 `export * from './result';` 一行后插入：

```ts
export * from './scroll';
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/components && pnpm vitest run src/scroll`
Expected: PASS（thumb 5/5 + Scroll 3/3）

- [ ] **Step 5: 提交**

```bash
git add packages/components/src/scroll packages/components/src/index.ts
git commit -m "feat(Scroll): 组件骨架，隐藏原生滚动条的覆盖式容器"
```

---

### Task 3: 溢出几何——scroll 事件与 ResizeObserver 更新

**Files:**
- Modify: `packages/components/src/scroll/Scroll.test.tsx`（追加用例）
- Modify: 无需改 Scroll.tsx——Task 2 已接线；本任务只补测试钉住行为。若测试暴露缺陷，修复 Scroll.tsx。

**Interfaces:**
- Consumes: Task 2 的渲染结构与 `measure` 接线
- Produces: 无新接口；行为保证：溢出轴渲染 bar 且尺寸正确、双轴独立、RO 观察双目标

- [ ] **Step 1: 追加失败测试**（加到 `describe('Scroll')` 内）

```tsx
// 追加到 Scroll.test.tsx
import { fireEvent } from '@testing-library/react';

describe('Scroll 几何', () => {
  test('纵向溢出：scroll 事件后渲染 y bar，滑块尺寸与偏移正确', () => {
    const { container } = render(
      <Scroll>
        <div style={{ height: 400 }} />
      </Scroll>,
    );
    const content = container.querySelector('.reef-scroll__content') as HTMLElement;
    // 视口 200，内容 400，轨道 192 → 滑块 96；scrollTop 100/200 → offset 48
    mockBox(content, { clientHeight: 200, scrollHeight: 400, scrollTop: 100 });
    fireEvent.scroll(content);

    const barY = container.querySelector('.reef-scroll__bar--y') as HTMLElement;
    expect(barY).toBeTruthy();
    const thumb = barY.querySelector('.reef-scroll__thumb') as HTMLElement;
    expect(thumb.style.height).toBe('96px');
    expect(thumb.style.transform).toBe('translateY(48px)');
  });

  test('双轴独立：仅纵向溢出时不渲染 x bar（Review Focus #3）', () => {
    const { container } = render(<Scroll>内容</Scroll>);
    const content = container.querySelector('.reef-scroll__content') as HTMLElement;
    mockBox(content, { clientHeight: 200, scrollHeight: 400, clientWidth: 300, scrollWidth: 300 });
    fireEvent.scroll(content);

    expect(container.querySelector('.reef-scroll__bar--y')).toBeTruthy();
    expect(container.querySelector('.reef-scroll__bar--x')).toBeNull();
  });

  test('ResizeObserver 同时观察 content 与 inner 两个目标（Review Focus #1）', () => {
    const { container } = render(<Scroll>内容</Scroll>);
    const content = container.querySelector('.reef-scroll__content') as HTMLElement;
    const inner = container.querySelector('.reef-scroll__inner') as HTMLElement;
    const instance = roInstances[roInstances.length - 1];
    const observed = instance.observe.mock.calls.map((call) => call[0]);
    expect(observed).toContain(content);
    expect(observed).toContain(inner);
  });

  test('RO 回调触发重新测量（异步内容长高后滑块出现）', () => {
    const { container } = render(<Scroll>内容</Scroll>);
    const content = container.querySelector('.reef-scroll__content') as HTMLElement;
    mockBox(content, { clientHeight: 200, scrollHeight: 400 });
    const instance = roInstances[roInstances.length - 1];
    instance.cb([], {} as ResizeObserver);
    expect(container.querySelector('.reef-scroll__bar--y')).toBeTruthy();
  });
});
```

- [ ] **Step 2: 跑测试确认通过或暴露缺陷**

Run: `cd packages/components && pnpm vitest run src/scroll`
Expected: 全部 PASS（Task 2 的实现已接线；若有 FAIL 属实现缺陷，修 `Scroll.tsx` 后重跑至绿）。注意：本任务是"用测试钉住已写行为"，与 TDD 的先红后绿不同——若第一步就全绿是正常结果，不视为违规。

- [ ] **Step 3: 全量回归**

Run: `pnpm --filter @reef-ui/components test`
Expected: 全绿（26+ 文件）

- [ ] **Step 4: 提交**

```bash
git add packages/components/src/scroll/Scroll.test.tsx
git commit -m "test(Scroll): 钉住溢出几何、双轴独立与 ResizeObserver 行为"
```

---

### Task 4: 滑块拖拽

**Files:**
- Modify: `packages/components/src/scroll/Scroll.tsx`
- Modify: `packages/components/src/scroll/Scroll.test.tsx`（追加用例）

**Interfaces:**
- Consumes: Task 1 `calcThumb` 的 `size`（算 trackRange）、Task 2 的 refs/state
- Produces: 滑块可拖拽；根节点拖拽期间带 `reef-scroll--dragging` 类（Task 5 CSS 依赖）

- [ ] **Step 1: 写失败测试**（追加）

```tsx
// 追加到 Scroll.test.tsx
describe('Scroll 拖拽', () => {
  function setupOverflow() {
    const utils = render(
      <Scroll>
        <div style={{ height: 400 }} />
      </Scroll>,
    );
    const content = utils.container.querySelector('.reef-scroll__content') as HTMLElement;
    // scrollTop 用可写 mock：捕获组件写入
    let scrollTop = 0;
    Object.defineProperty(content, 'scrollTop', {
      configurable: true,
      get: () => scrollTop,
      set: (v: number) => { scrollTop = v; },
    });
    mockBox(content, { clientHeight: 200, scrollHeight: 400 });  // 注意：不带 scrollTop，保住上面的可写 mock
    fireEvent.scroll(content);
    const thumb = utils.container.querySelector('.reef-scroll__bar--y .reef-scroll__thumb') as HTMLElement;
    return { ...utils, content, thumb, getScrollTop: () => scrollTop };
  }

  test('pointer 拖拽把位移按比例换算成 scrollTop', () => {
    const { thumb, getScrollTop, container } = setupOverflow();
    thumb.setPointerCapture = vi.fn();
    // maxScroll 200，trackRange 192-96=96：下移 48px → scrollTop +100
    fireEvent.pointerDown(thumb, { pointerId: 1, clientY: 0 });
    expect(container.querySelector('.reef-scroll')!.className).toContain('reef-scroll--dragging');
    fireEvent.pointerMove(thumb, { pointerId: 1, clientY: 48 });
    expect(getScrollTop()).toBe(100);
    fireEvent.pointerUp(thumb, { pointerId: 1 });
    expect(container.querySelector('.reef-scroll')!.className).not.toContain('reef-scroll--dragging');
  });

  test('trackRange ≤ 0（滑块下限撑满轨道）时不出 NaN、scrollTop 不变（Review Focus #2）', () => {
    const { thumb, getScrollTop, content } = setupOverflow();
    // 让滑块 = 轨道：viewport 32, content 400, track 24 → 滑块 24px，trackRange 0
    mockBox(content, { clientHeight: 32, scrollHeight: 400 });
    fireEvent.scroll(content);
    thumb.setPointerCapture = vi.fn();
    fireEvent.pointerDown(thumb, { pointerId: 1, clientY: 0 });
    fireEvent.pointerMove(thumb, { pointerId: 1, clientY: 50 });
    expect(Number.isFinite(getScrollTop())).toBe(true);
    expect(getScrollTop()).toBe(0);
    fireEvent.pointerUp(thumb, { pointerId: 1 });
  });
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd packages/components && pnpm vitest run src/scroll`
Expected: 新增 2 例 FAIL（拖拽未实现：scrollTop 停在 0、无 dragging 类）

- [ ] **Step 3: 实现拖拽**

`Scroll.tsx`：组件内追加（放在 `measure` 之后、`useEffect` 之前）：

```tsx
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ axis: 'y' | 'x'; start: number; scroll: number } | null>(null);

  const onThumbPointerDown = (axis: 'y' | 'x') => (e: React.PointerEvent<HTMLDivElement>) => {
    const el = contentRef.current;
    if (!el) return;
    e.preventDefault();
    dragRef.current = {
      axis,
      start: axis === 'y' ? e.clientY : e.clientX,
      scroll: axis === 'y' ? el.scrollTop : el.scrollLeft,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = contentRef.current;
    if (!drag || !el) return;
    const geomAxis = drag.axis === 'y' ? geom.y : geom.x;
    const maxScroll = drag.axis === 'y' ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
    const trackRange = (drag.axis === 'y' ? el.clientHeight : el.clientWidth) - TRACK_INSET * 2 - geomAxis.size;
    // 滑块被 24px 下限撑满轨道时 trackRange ≤ 0，除零会产生 NaN（spec 评审重点 2）
    if (trackRange <= 0 || maxScroll <= 0) return;
    const delta = (drag.axis === 'y' ? e.clientY : e.clientX) - drag.start;
    const next = drag.scroll + (delta * maxScroll) / trackRange;
    if (drag.axis === 'y') el.scrollTop = next;
    else el.scrollLeft = next;
  };

  const onThumbPointerEnd = () => {
    dragRef.current = null;
    setDragging(false);
  };
```

根节点 className 与拖拽处理绑定（y bar 示例，x bar 同构换 `x` 与 `pointerMove` 复用同一 handler）：

```tsx
    <div className={cn('reef-scroll', dragging && 'reef-scroll--dragging', className)} style={{ maxHeight, ...style }}>
```

y thumb 上（x thumb 加 `onPointerDown={onThumbPointerDown('x')}`，move/end 复用）：

```tsx
          <div
            className="reef-scroll__thumb"
            style={{ height: geom.y.size, transform: `translateY(${geom.y.offset}px)` }}
            onPointerDown={onThumbPointerDown('y')}
            onPointerMove={onThumbPointerMove}
            onPointerUp={onThumbPointerEnd}
            onPointerCancel={onThumbPointerEnd}
          />
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd packages/components && pnpm vitest run src/scroll`
Expected: PASS（thumb 5 + Scroll 3 + 几何 4 + 拖拽 2）

- [ ] **Step 5: 全量回归并提交**

Run: `pnpm --filter @reef-ui/components test`
Expected: 全绿

```bash
git add packages/components/src/scroll
git commit -m "feat(Scroll): 滑块拖拽，Pointer Events 换算 scrollTop"
```

---

### Task 5: 交互 CSS（淡入淡出）+ 文档页与注册

**Files:**
- Modify: `packages/components/src/scroll/scroll.css`
- Create: `apps/docs/src/pages/ScrollPage.tsx`
- Modify: `apps/docs/src/App.tsx`（三处注册）

**Interfaces:**
- Consumes: Task 4 的 `reef-scroll--dragging` 类
- Produces: 完整视觉行为 + 文档站页面

- [ ] **Step 1: scroll.css 追加显隐与 hover 规则**（追加到文件末尾）

```css
/* ---- 覆盖式滚动条：默认隐藏，hover / 聚焦 / 拖拽中淡入 ---- */
.reef-scroll__bar {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.reef-scroll:hover .reef-scroll__bar,
.reef-scroll:focus-within .reef-scroll__bar,
.reef-scroll--dragging .reef-scroll__bar {
  opacity: 1;
  pointer-events: auto;
}

.reef-scroll__bar:hover .reef-scroll__thumb {
  /* 加粗方向垂直于滚动轴，不改变沿轴 offset，无跳动（spec 评审重点 4） */
  background: color-mix(in srgb, var(--reef-color-text-primary) 40%, transparent);
}

.reef-scroll__bar--y:hover {
  width: 10px;
}

.reef-scroll__bar--x:hover {
  height: 10px;
}
```

- [ ] **Step 2: 文档页**

```tsx
// apps/docs/src/pages/ScrollPage.tsx
import { Scroll } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const listCode = `<Scroll maxHeight={160}>
  {items.map((item) => (
    <div key={item} className="demo-scroll-item">
      {item}
    </div>
  ))}
</Scroll>`;

const wideCode = `<Scroll>
  <div style={{ width: 1200, padding: '8px 0' }}>
    横向超宽内容，hover 后底部出现横向滚动条
  </div>
</Scroll>`;

const items = Array.from({ length: 20 }, (_, i) => `列表项 ${i + 1}`);

export function ScrollPage() {
  return (
    <>
      <h2>Scroll 滚动条</h2>
      <p>
        覆盖式滚动容器：内容溢出时滚动条 hover 淡入、移开淡出，滑块可拖拽。
        原生滚动条被隐藏，样式完全由主题控制。
      </p>

      <Demo title="限高列表" code={listCode}>
        <div style={{ width: 280 }}>
          <Scroll maxHeight={160}>
            {items.map((item) => (
              <div
                key={item}
                style={{ padding: '8px 12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
              >
                {item}
              </div>
            ))}
          </Scroll>
        </div>
      </Demo>

      <Demo title="横向内容" code={wideCode}>
        <div style={{ width: 360 }}>
          <Scroll>
            <div style={{ width: 1200, padding: '8px 0' }}>
              横向超宽内容，hover 后底部出现横向滚动条
            </div>
          </Scroll>
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['maxHeight', '便捷限高（数字按 px），其余尺寸交给消费方样式', 'number | string', '—'],
          ['className', '追加到根元素', 'string', '—'],
          ['style', '追加到根元素', 'CSSProperties', '—'],
        ]}
      />
    </>
  );
}
```

- [ ] **Step 3: App.tsx 三处注册**

`apps/docs/src/App.tsx`：

1. 页面 key 联合类型（`'progress'` 一行后）加 `'scroll'`；
2. `'通用'` 分组的 keys 数组（`grep -n "label: '通用'" apps/docs/src/App.tsx` 定位）中 `'select',` 前后合适位置加 `'scroll',`；
3. 页面映射（`{ key: 'progress', title: 'Progress 进度条', node: <ProgressPage /> }` 一行附近）加：

```tsx
  { key: 'scroll', title: 'Scroll 滚动条', node: <ScrollPage /> },
```

4. 顶部 import 区（`import { ProgressPage } ...` 一行后）加：

```tsx
import { ScrollPage } from './pages/ScrollPage';
```

（key/分组/映射的确切行号以文件当前内容为准，用 grep 定位锚点后插入，保持数组顺序与侧栏展示顺序一致。）

- [ ] **Step 4: 构建 + 全量门禁**

Run: `pnpm lint && pnpm --filter @reef-ui/components test && pnpm build`
Expected: 全绿

- [ ] **Step 5: 文档站人工验证（Review Focus #4）**

用户 dev server（localhost:5173，**绝不重启它**）打开 `#scroll`，CDP 截图管线（`--no-proxy-server`，`/json` 过滤 `type=="page"`）验证：

1. hover 列表 demo → 右侧淡入竖向滑块；移开 → 淡出；
2. 拖拽滑块到中部 → 列表跟随滚动；拖拽中移出容器 → 滑块不消失；
3. hover 横向 demo → 底部横向滑块，加粗到 10px 时滑块沿轴位置不跳；
4. 内容恰好不溢出的容器 hover → 无滑块。

发现视觉问题回改 scroll.css 后重跑 Step 4 门禁。

- [ ] **Step 6: 提交**

```bash
git add packages/components/src/scroll/scroll.css apps/docs/src/pages/ScrollPage.tsx apps/docs/src/App.tsx
git commit -m "feat(Scroll): 显隐过渡样式与文档站页面"
```

---

## Self-Review 记录

- **Spec 覆盖**：API（Task 2 types）、结构（Task 2）、显隐 CSS（Task 5）、几何（Task 1/3）、拖拽（Task 4）、边界表（Task 1 #5 / Task 2 无溢出 / Task 4 除零）、文档页（Task 5）——无遗漏。spec 评审重点 4 条全部有测试或验证步骤钉住（见 Review Focus）。
- **占位符扫描**：无 TBD/TODO；Task 3 为"钉住已写行为"的测试任务，已注明与先红后绿的差异及理由。
- **类型一致性**：`ThumbGeometry{size,offset,needed}` 在 Task 1 定义、Task 2-4 消费一致；`TRACK_INSET=4` 两处使用（measure 与拖拽 trackRange）一致；`reef-scroll--dragging` 类名 Task 4 产出、Task 5 消费一致。
- **执行提示**：Task 3 无实现改动，若实现先绿属预期；拖拽测试的 scrollTop 可写 mock 与 Task 3 的 value mock 不同（get/set vs value），实现时注意 `mockBox` 里 `scrollTop: 0` 会覆盖 get/set——Task 4 的 `setupOverflow` 中先定义可写属性再调 `mockBox` 时**不要**传 `scrollTop`（上面代码已按此顺序编写，`mockBox` 调用去掉了 scrollTop）。
