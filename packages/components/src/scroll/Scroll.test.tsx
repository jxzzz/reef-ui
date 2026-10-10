import { cleanup, render } from '@testing-library/react';
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
