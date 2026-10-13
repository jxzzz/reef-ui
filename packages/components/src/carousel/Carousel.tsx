import { forwardRef, useEffect, useRef, useState } from 'react';
import { Children } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import type { CarouselProps } from './types';
import './carousel.css';

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      children,
      autoplay = false,
      interval = 3000,
      arrows = false,
      dots = true,
      activeIndex,
      defaultActiveIndex = 0,
      onChange,
      pauseOnHover = true,
      className,
    },
    ref,
  ) => {
    const [inner, setInner] = useState(defaultActiveIndex);
    const [paused, setPaused] = useState(false);
    const current = activeIndex !== undefined ? activeIndex : inner;
    // ponytail: ref 镜像 current，interval 闭包不依赖渲染快照，
    // 同一事件批次内连续 tick 也能算对下一张
    const currentRef = useRef(current);
    currentRef.current = current;
    const count = Children.count(children);
    const slides = Children.toArray(children);

    const goTo = (index: number) => {
      const next = ((index % count) + count) % count;
      if (activeIndex === undefined) setInner(next);
      onChange?.(next);
    };

    useEffect(() => {
      if (!autoplay || paused || count < 2) return;
      const id = setInterval(() => {
        goTo((currentRef.current + 1) % count);
      }, interval);
      return () => clearInterval(id);
      // ponytail: 刻意省略 goTo（每次渲染重建），interval 只随节奏相关依赖重建
    }, [autoplay, paused, count, interval, activeIndex]);

    return (
      <div
        ref={ref}
        className={cn('reef-carousel', className)}
        onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
        onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
      >
        <div className="reef-carousel__track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {slides.map((slide, i) => (
            <div key={i} className="reef-carousel__item">
              {slide}
            </div>
          ))}
        </div>

        {dots && count > 0 && (
          <div className="reef-carousel__dots">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`第 ${i + 1} 张`}
                className={cn('reef-carousel__dot', i === current && 'reef-carousel__dot--active')}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}

        {arrows && (
          <>
            <button
              type="button"
              aria-label="上一张"
              className="reef-carousel__arrow reef-carousel__arrow--prev"
              onClick={() => goTo(current - 1)}
            >
              <Icon name="chevron-left" size={18} />
            </button>
            <button
              type="button"
              aria-label="下一张"
              className="reef-carousel__arrow reef-carousel__arrow--next"
              onClick={() => goTo(current + 1)}
            >
              <Icon name="chevron-right" size={18} />
            </button>
          </>
        )}
      </div>
    );
  },
);

Carousel.displayName = 'Carousel';
