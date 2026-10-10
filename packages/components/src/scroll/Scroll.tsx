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
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ axis: 'y' | 'x'; start: number; scroll: number } | null>(null);

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

  return (
    <div className={cn('reef-scroll', dragging && 'reef-scroll--dragging', className)} style={{ maxHeight, ...style }}>
      <div className="reef-scroll__content" ref={contentRef} tabIndex={0} onScroll={measure}>
        <div className="reef-scroll__inner" ref={innerRef}>
          {children}
        </div>
      </div>
      {geom.y.needed && (
        <div className="reef-scroll__bar reef-scroll__bar--y">
          <div
            className="reef-scroll__thumb"
            style={{ height: geom.y.size, transform: `translateY(${geom.y.offset}px)` }}
            onPointerDown={onThumbPointerDown('y')}
            onPointerMove={onThumbPointerMove}
            onPointerUp={onThumbPointerEnd}
            onPointerCancel={onThumbPointerEnd}
          />
        </div>
      )}
      {geom.x.needed && (
        <div className="reef-scroll__bar reef-scroll__bar--x">
          <div
            className="reef-scroll__thumb"
            style={{ width: geom.x.size, transform: `translateX(${geom.x.offset}px)` }}
            onPointerDown={onThumbPointerDown('x')}
            onPointerMove={onThumbPointerMove}
            onPointerUp={onThumbPointerEnd}
            onPointerCancel={onThumbPointerEnd}
          />
        </div>
      )}
    </div>
  );
}
