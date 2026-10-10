import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Avatar } from './Avatar';

afterEach(cleanup);

describe('Avatar', () => {
  test('渲染图片', () => {
    render(<Avatar src="/a.png" alt="头像" />);
    const img = screen.getByRole('img', { name: '头像' });
    expect(img.getAttribute('src')).toBe('/a.png');
  });

  test('图片加载失败回退到 children（Review Focus #3）', () => {
    render(
      <Avatar src="/broken.png">
        <span>张</span>
      </Avatar>,
    );
    // alt 缺省为 ''，此时 img 的可访问角色是 presentation 而非 img，按类名取
    fireEvent.error(document.querySelector('.reef-avatar__img')!);
    expect(screen.getByText('张')).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
  });

  test('src 变化后失败状态重置，新图片可显示', () => {
    const { rerender } = render(
      <Avatar src="/broken.png" alt="头像">
        <span>张</span>
      </Avatar>,
    );
    fireEvent.error(document.querySelector('.reef-avatar__img')!);
    expect(screen.queryByRole('img', { name: '头像' })).toBeNull();

    rerender(
      <Avatar src="/fixed.png" alt="头像">
        <span>张</span>
      </Avatar>,
    );
    expect(screen.getByRole('img', { name: '头像' }).getAttribute('src')).toBe('/fixed.png');
  });

  test('size 应用到容器，square 用方角', () => {
    const { container } = render(<Avatar size={48} shape="square">Z</Avatar>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.width).toBe('48px');
    expect(el.className).toContain('reef-avatar--square');
  });

  test('无 src 直接渲染回退内容', () => {
    render(<Avatar>访客</Avatar>);
    expect(screen.getByText('访客')).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
  });
});
