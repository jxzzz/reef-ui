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
