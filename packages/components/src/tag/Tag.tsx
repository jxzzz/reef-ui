import { cn } from '@reef-ui/utils';
import { useLocale } from '../locale';
import type { TagProps } from './types';
import './tag.css';

export function Tag({ color = 'neutral', closable = false, onClose, className, children, ...rest }: TagProps) {
  const t = useLocale();
  return (
    <span className={cn('reef-tag', `reef-tag--${color}`, className)} {...rest}>
      {children}
      {closable && (
        <button type="button" className="reef-tag__close" aria-label={t.Tag.close} onClick={onClose}>
          ×
        </button>
      )}
    </span>
  );
}
