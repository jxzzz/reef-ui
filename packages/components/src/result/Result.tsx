import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import type { ResultProps } from './types';
import './result.css';

export function Result({ status = 'info', icon, title, subTitle, extra, className }: ResultProps) {
  const defaultIcon =
    status === 'success' ? <Icon name="check" size={22} /> : status === 'error' ? <Icon name="close" size={22} /> : '!';
  return (
    <div className={cn('reef-result', `reef-result--${status}`, className)}>
      <div className="reef-result__icon" aria-hidden>
        {icon ?? defaultIcon}
      </div>
      {title != null && <div className="reef-result__title">{title}</div>}
      {subTitle != null && <div className="reef-result__sub">{subTitle}</div>}
      {extra != null && <div className="reef-result__extra">{extra}</div>}
    </div>
  );
}
