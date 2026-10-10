import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Scroll } from './Scroll';

// jsdom 没有 ResizeObserver：桩掉，实例收集到数组供断言
const roInstances: {
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  cb: ResizeObserverCallback;
}[] = [];
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(cb: ResizeObserverCallback) {
    roInstances.push({ observe: this.observe, disconnect: this.disconnect, unobserve: this.unobserve, cb });
  }
}
vi.stubGlobal('ResizeObserver', MockResizeObserver);

// jsdom 没有 PointerEvent，fireEvent 会造出裸 Event 丢掉 clientX/clientY：
// 用把 init 展开到实例上的 polyfill 补齐
class PointerEventPolyfill extends Event {
  clientX = 0;
  clientY = 0;
  pointerId = 0;
  constructor(type: string, params: { clientX?: number; clientY?: number; pointerId?: number } = {}) {
    // pointer 事件默认冒泡，React 根节点委托依赖它
    super(type, { bubbles: true, cancelable: true });
    // 只取几何字段：init 里的 bubbles 等是 Event 只读属性，不能 assign
    this.clientX = params.clientX ?? 0;
    this.clientY = params.clientY ?? 0;
    this.pointerId = params.pointerId ?? 0;
  }
}
vi.stubGlobal('PointerEvent', PointerEventPolyfill);

afterEach(() => {
  cleanup();
  roInstances.length = 0;
});

/** jsdom 无布局：把盒模型 mock 到元素实例上 */
function mockBox(
  el: HTMLElement,
  box: Partial<{
    clientHeight: number;
    scrollHeight: number;
    scrollTop: number;
    clientWidth: number;
    scrollWidth: number;
    scrollLeft: number;
  }>,
) {
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
    act(() => instance.cb([], {} as ResizeObserver));
    expect(container.querySelector('.reef-scroll__bar--y')).toBeTruthy();
  });
});

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
      set: (v: number) => {
        scrollTop = v;
      },
    });
    // 注意：不带 scrollTop，保住上面的可写 mock
    mockBox(content, { clientHeight: 200, scrollHeight: 400 });
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
