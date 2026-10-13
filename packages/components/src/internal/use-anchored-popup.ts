import { useEffect, useId, type RefObject } from 'react';
import './popup.css';

/** CSS anchor positioning 支持度：Chrome / Safari 有，Firefox 暂无，没有就走 JS 兜底 */
const hasAnchor = () => typeof CSS !== 'undefined' && !!CSS.supports?.('anchor-name: --a');

/**
 * 把浮层放进浏览器顶层（popover）：祖先的 overflow 裁剪和 z-index 层级都管不到它，
 * Select 放进滚动容器、Drawer、Modal 里都不会再被切掉。
 *
 * 定位优先交给 CSS anchor positioning（含放不下自动翻转），不支持时读触发器的
 * rect 写 inset，并跟随滚动 / 缩放更新。
 *
 * ponytail: 兜底只做上下翻转，不做左右收边和箭头定位；
 * 需要时在 place() 里给 left 补一个视口 clamp。
 */
export function useAnchoredPopup<A extends HTMLElement, P extends HTMLElement>(
  open: boolean,
  anchorRef: RefObject<A | null>,
  popupRef: RefObject<P | null>,
  align: 'start' | 'end' = 'start',
) {
  const anchorName = `--reef-anchor-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  useEffect(() => {
    const anchor = anchorRef.current;
    const popup = popupRef.current;
    if (!open || !anchor || !popup) return;

    // popover 属性在这里加：@types/react 18 还没有这个属性，写在 JSX 上过不了 typecheck
    popup.setAttribute('popover', 'manual');
    anchor.style.setProperty('anchor-name', anchorName);
    popup.style.setProperty('position-anchor', anchorName);
    try {
      popup.showPopover?.();
    } catch {
      // 已经打开，或环境不支持 popover
    }

    const close = () => {
      try {
        popup.hidePopover?.();
      } catch {
        // 已经关闭，或环境不支持 popover
      }
      anchor.style.removeProperty('anchor-name');
    };

    if (hasAnchor()) return close;

    const place = () => {
      const r = anchor.getBoundingClientRect();
      popup.style.minWidth = `${r.width}px`;
      popup.style.left =
        align === 'end' ? `${r.right - popup.offsetWidth}px` : `${r.left}px`;
      const below = r.bottom + 4;
      popup.style.top = `${below}px`;
      // 下方放不下、上方放得下就翻到上方
      if (below + popup.offsetHeight > window.innerHeight && r.top - 4 - popup.offsetHeight > 0) {
        popup.style.top = `${r.top - 4 - popup.offsetHeight}px`;
      }
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      close();
    };
  }, [open, anchorName, anchorRef, popupRef, align]);
}
