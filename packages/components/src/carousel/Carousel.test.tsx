import { cleanup, fireEvent, render, screen, act } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Carousel } from './Carousel';

const slides = [
  <p key="a">幻灯一</p>,
  <p key="b">幻灯二</p>,
  <p key="c">幻灯三</p>,
];

const track = () => document.querySelector('.reef-carousel__track') as HTMLElement;
const transform = () => track().style.transform;

afterEach(cleanup);

describe('Carousel', () => {
  test('渲染所有子元素为幻灯片，并生成对应指示点', () => {
    render(<Carousel>{slides}</Carousel>);

    const items = document.querySelectorAll('.reef-carousel__item');
    expect(items.length).toBe(3);
    expect(screen.getByText('幻灯一')).toBeTruthy();
    expect(screen.getByText('幻灯二')).toBeTruthy();
    expect(screen.getByText('幻灯三')).toBeTruthy();
    expect(screen.getByRole('button', { name: '第 2 张' })).toBeTruthy();
  });

  test('点击指示点切换幻灯片，track 位移到对应位置', () => {
    const onChange = vi.fn();
    render(<Carousel onChange={onChange}>{slides}</Carousel>);

    fireEvent.click(screen.getByRole('button', { name: '第 2 张' }));
    expect(transform()).toBe('translateX(-100%)');
    expect(onChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: '第 3 张' }));
    expect(transform()).toBe('translateX(-200%)');
  });

  test('左右箭头切换，到边界循环回绕', () => {
    render(<Carousel arrows>{slides}</Carousel>);

    fireEvent.click(screen.getByRole('button', { name: '下一张' }));
    expect(transform()).toBe('translateX(-100%)');

    fireEvent.click(screen.getByRole('button', { name: '上一张' }));
    expect(transform()).toBe('translateX(-0%)');

    fireEvent.click(screen.getByRole('button', { name: '上一张' }));
    expect(transform()).toBe('translateX(-200%)'); // 从第一张回绕到最后一张
  });

  test('autoplay 按间隔自动推进并循环', () => {
    vi.useFakeTimers();
    try {
      const onChange = vi.fn();
      render(
        <Carousel autoplay interval={3000} onChange={onChange}>
          {slides}
        </Carousel>,
      );

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(transform()).toBe('translateX(-100%)');
      expect(onChange).toHaveBeenCalledWith(1);

      // 真实浏览器里两张之间的重渲染一定先于下一次 tick，故分两个 act 推进
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(transform()).toBe('translateX(-200%)');

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(transform()).toBe('translateX(-0%)'); // 第三张之后回到第一张
    } finally {
      vi.useRealTimers();
    }
  });

  test('pauseOnHover：悬停时暂停自动播放', () => {
    vi.useFakeTimers();
    try {
      render(
        <Carousel autoplay interval={3000}>
          {slides}
        </Carousel>,
      );

      fireEvent.mouseEnter(document.querySelector('.reef-carousel')!);
      act(() => {
        vi.advanceTimersByTime(6000);
      });
      expect(transform()).toBe('translateX(-0%)');

      fireEvent.mouseLeave(document.querySelector('.reef-carousel')!);
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(transform()).toBe('translateX(-100%)');
    } finally {
      vi.useRealTimers();
    }
  });

  test('受控模式：activeIndex 优先，点击指示点不改变位置', () => {
    render(
      <Carousel activeIndex={1} onChange={() => {}}>
        {slides}
      </Carousel>,
    );

    expect(transform()).toBe('translateX(-100%)');

    fireEvent.click(screen.getByRole('button', { name: '第 1 张' }));
    expect(transform()).toBe('translateX(-100%)');
    expect(
      document.querySelector('.reef-carousel__dot--active')!.getAttribute('aria-label'),
    ).toBe('第 2 张');
  });
});
