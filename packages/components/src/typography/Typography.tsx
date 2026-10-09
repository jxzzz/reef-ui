import { forwardRef } from 'react';
import { cn } from '@reef-ui/utils';
import type { TextProps, TitleProps } from './types';
import './typography.css';

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ level = 3, className, children, ...rest }, ref) => {
    const Tag = (`h${level}`) as 'h1' | 'h2' | 'h3' | 'h4';
    return (
      <Tag ref={ref} className={cn('reef-title', `reef-title--h${level}`, className)} {...rest}>
        {children}
      </Tag>
    );
  },
);

Title.displayName = 'Title';

export const Text = forwardRef<HTMLSpanElement, TextProps>(
  ({ type = 'primary', className, children, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('reef-text', type !== 'primary' && `reef-text--${type}`, className)}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

Text.displayName = 'Text';
