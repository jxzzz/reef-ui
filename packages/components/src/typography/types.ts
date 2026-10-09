import type * as React from 'react';

export type TitleLevel = 1 | 2 | 3 | 4;

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** 标题层级，渲染为 h1–h4，默认 3 */
  level?: TitleLevel;
}

export type TextType = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  type?: TextType;
}
