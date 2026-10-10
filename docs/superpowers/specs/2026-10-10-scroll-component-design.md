# Scroll 滚动容器组件设计

日期：2026-10-10
状态：待评审

## 背景与目标

中后台界面大量存在固定高度区域的滚动场景：侧栏导航、限高面板、长列表、横向宽表格。浏览器原生滚动条样式不可控、占据布局空间、与组件库视觉不符。

目标：提供 `<Scroll>` 容器组件，内容溢出时显示**覆盖式自定义滚动条**——hover 容器淡入，移开淡出；滑块可拖拽；样式完全由 token 控制。

非目标（明确不做）：

- 常驻滚动条模式（后续有需求再加 prop）
- 键盘滚动时自动显示滚动条（`:focus-within` 已覆盖焦点在容器内的场景）
- 轨道点击跳页
- 滚动吸附、惯性等高级行为
- RTL 支持

## 已定决策

| 决策点 | 结论 | 备选被否原因 |
|---|---|---|
| 组件名 | `Scroll` | `ScrollView` 偏长；`Scrollbar` 语义是"条"不是"容器" |
| 轴向 | 横竖双向，按溢出情况各自独立出现 | 只做纵向的话横向宽表场景缺失，且几何计算同构，增量成本低 |
| 滚动条实现 | 隐藏原生 + 自绘 overlay | 纯 CSS `::-webkit-scrollbar` 无法做淡入淡出过渡，Firefox 的 `scrollbar-color` 无 hover 显隐能力 |
| 拖拽 | Pointer Events + `setPointerCapture` | 鼠标/触摸统一处理，无需区分事件类型 |

## API

```ts
export interface ScrollProps {
  /** 便捷限高（数字 px 或任意 CSS 值）；不传时容器尺寸由消费方样式决定 */
  maxHeight?: number | string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

刻意最小。滑块粗细（8px，hover 10px）、颜色（`--reef-color-text-primary` 20%/40%）走 CSS 默认值，不开放 props——需要定制时再议。

## 结构

```tsx
<div className="reef-scroll" style={{ maxHeight }}>        {/* position: relative */}
  <div className="reef-scroll__content" tabIndex={0}>      {/* overflow: auto，真实滚动层 */}
    <div className="reef-scroll__inner">{children}</div>   {/* ResizeObserver 观察目标 */}
  </div>
  <div className="reef-scroll__bar reef-scroll__bar--y">  {/* 右侧覆盖，宽 8px，按需渲染 */}
    <div className="reef-scroll__thumb" />                 {/* 灰色圆角滑块，绝对定位 */}
  </div>
  <div className="reef-scroll__bar reef-scroll__bar--x">…</div>
</div>
```

- `__content`：`height: 100%; overflow: auto; scrollbar-width: none` + `::-webkit-scrollbar { display: none }`；`tabIndex={0}` 让键盘方向键滚动可用（非强制聚焦，仅可聚焦）。
- `__bar--y`：`position: absolute; top: 4px; right: 2px; bottom: 4px; width: 8px`；`__bar--x` 镜像。轨道本身透明，只有滑块可见。
- 滑块：`border-radius: full; background: color-mix(text-primary 20%, transparent)`；bar hover 时加粗到 10px、加深到 40%。

## 显隐逻辑（核心交互）

状态全部用 data/class 表达，CSS 过渡驱动：

```css
.reef-scroll__bar {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}
/* 无溢出的轴：JS 直接不渲染对应 bar 元素 */
.reef-scroll:hover .reef-scroll__bar,
.reef-scroll:focus-within .reef-scroll__bar {
  opacity: 1;
  pointer-events: auto;
}
.reef-scroll--dragging .reef-scroll__bar {  /* 拖拽中移出容器不消失 */
  opacity: 1;
  pointer-events: auto;
}
```

- bar 元素由 JS 按需渲染：该轴 `内容尺寸 > 视口尺寸` 才渲染；不溢出的轴 hover 也不出现。
- 淡出无延迟：鼠标移出即开始 0.2s 过渡。

## 几何计算

抽出纯函数（放在组件文件内，供单测直接调用，jsdom 无布局也能测）：

```ts
interface ThumbGeometry { size: number; offset: number; needed: boolean }

// axis: 视口尺寸、内容尺寸、滚动位置、轨道可用长度（轨道长 - 上下内边距 8px）
function calcThumb(viewport: number, content: number, scroll: number, track: number): ThumbGeometry {
  const needed = content > viewport;
  if (!needed) return { size: 0, offset: 0, needed: false };
  const size = Math.max(24, track * (viewport / content));
  const maxScroll = content - viewport;
  const offset = maxScroll === 0 ? 0 : (scroll / maxScroll) * (track - size);
  return { size, offset, needed: true };
}
```

- 纵轴：`viewport = clientHeight`，`content = scrollHeight`，`scroll = scrollTop`；横轴镜像。
- 更新时机：`__content` 的 `scroll` 事件 + `ResizeObserver` 同时观察 `__content`（视口侧变化）与 `__inner`（内容侧变化，异步加载/变更不经过滚动事件）。
- 状态存入 `useState`（geometry 对象），直接驱动滑块 `style={{ height, transform: translateY(offset) }}`，不走 ref 直改 DOM（保持 React 惯例；滚动事件频率足够，无需 rAF 节流——60Hz 下 transform 更新成本可忽略）。

## 拖拽

- 滑块 `pointerdown`：记录 `startY = e.clientY`、`startScrollTop`；`e.preventDefault()`（防文本选中）；根节点加 `reef-scroll--dragging`；`thumb.setPointerCapture(e.pointerId)`。
- `pointermove`：`scrollTop = startScrollTop + (e.clientY - startY) × (内容高 - 视口高) / (轨道长 - 滑块高)`。走 scroll 事件回路更新几何，不单独算滑块位置（单一数据源）。
- `pointerup` / `pointercancel`：移除 dragging，释放捕获。
- 横轴镜像（clientX / scrollLeft）。

## 边界情况

| 场景 | 行为 |
|---|---|
| percent 为 0（无溢出） | `needed: false`，该轴 bar 不出现 |
| 内容恰好等于视口 | 同上，不出现 |
| 拖拽到边界 | `scrollTop` 由浏览器钳制，无需额外处理 |
| 0%（无溢出）→ 内容增多出现溢出 | ResizeObserver 触发重算，下次 hover 出现 |
| 拖拽中窗口失焦 | `pointercancel` 兜底释放 |
| 键盘滚动 | `tabIndex=0` + `:focus-within` 显示滚动条 |
| children 为空 | 无溢出，无 bar |

## 测试策略

- `calcThumb`：纯函数直测——不溢出、正常比例、最小 24px 下限、滚动位置到 offset 的映射、边界（0 溢出、满溢出）。
- 组件（jsdom，几何 mock）：
  - 无溢出（mock clientHeight ≥ scrollHeight）→ 不渲染 `data-visible` bar；
  - 溢出 → 纵轴 bar 有 `data-visible`，横轴没有；
  - `scroll` 事件后滑块 `transform` 更新；
  - 拖拽 pointer 事件序列换算 `scrollTop`。
- CSS 显隐（hover/过渡/圆角）无单测，靠文档站 demo 人工验证（沿用本会话 CDP 截图管线）。

## 文件与文档

- `packages/components/src/scroll/{Scroll.tsx,types.ts,scroll.css,Scroll.test.tsx,index.ts}`
- `apps/docs/src/pages/ScrollPage.tsx`：限高列表 demo、横向宽内容 demo、API 表；侧栏"通用"分组注册。

## 评审重点（Review Focus）

1. **内容异步变更**：列表加载完成后 `scrollHeight` 变化但无 scroll 事件——依赖 ResizeObserver，漏接则滑块长度错。
2. **拖拽换算分母为零**：`轨道长 - 滑块高` 在内容略溢出时可能极小或为 0（滑块被 24px 下限撑满轨道），除零产生 NaN 直接打飞 scrollTop。
3. **横轴 false阳性**：竖向滚动条占据宽度可能诱发横向溢出（`overflow-x` 联动），需确认 `__content` 的 `overflow: auto` 行为下两轴判定互不干扰。
4. **滑块 hover 加粗引发跳动**：8→10px 用 transform/宽度过渡时滑块位置基准变化，需固定轨道定位基准。
