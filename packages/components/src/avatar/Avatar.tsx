import { useEffect, useState } from 'react';
import { cn } from '@reef-ui/utils';
import type { AvatarProps } from './types';
import './avatar.css';

export function Avatar({ src, alt, size = 32, shape = 'circle', children, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  // 换新地址后重置失败状态，否则旧图的一次失败会永久挡住新图
  useEffect(() => setFailed(false), [src]);

  return (
    <span
      className={cn('reef-avatar', `reef-avatar--${shape}`, className)}
      style={{ width: size, height: size }}
    >
      {src && !failed ? (
        <img className="reef-avatar__img" src={src} alt={alt ?? ''} onError={() => setFailed(true)} />
      ) : (
        <span className="reef-avatar__fallback">{children}</span>
      )}
    </span>
  );
}
