import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { Anchor } from './Anchor';
import type { AnchorItem } from './types';

// jsdom 未实现 scrollIntoView
// ponytail: 只桩不测真实滚动行为，断言的是点击处理逻辑
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(cleanup);

const items: AnchorItem[] = [
  { key: 'intro', title: '简介', href: '#intro' },
  { key: 'usage', title: '用法', href: '#usage' },
  { key: 'api', title: 'API', href: '#api' },
];

describe('Anchor', () => {
  test('渲染全部链接并带 href', () => {
    render(<Anchor items={items} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links[0].getAttribute('href')).toBe('#intro');
    expect(links[1].getAttribute('href')).toBe('#usage');
    expect(links[2].getAttribute('href')).toBe('#api');
  });

  test('点击阻止默认行为并触发 onChange 回调对应 key', async () => {
    const onChange = vi.fn();
    const onClick = vi.fn();
    render(<Anchor items={items} onChange={onChange} onClick={onClick} />);

    await userEvent.click(screen.getByText('用法'));
    expect(onChange).toHaveBeenCalledWith('usage');
    expect(onClick).toHaveBeenCalledTimes(1);
    // 链接的默认跳转被阻止
    expect(onClick.mock.calls[0][0].defaultPrevented).toBe(true);
  });

  test('目标不存在时点击不抛错且仍触发 onChange', async () => {
    const onChange = vi.fn();
    render(<Anchor items={items} onChange={onChange} />);
    await userEvent.click(screen.getByText('API'));
    expect(onChange).toHaveBeenCalledWith('api');
  });

  test('defaultActiveKey 对应链接带激活修饰类', () => {
    render(<Anchor items={items} defaultActiveKey="usage" />);
    const active = document.querySelector('.reef-anchor__link--active');
    expect(active).toBeTruthy();
    expect(active!.textContent).toBe('用法');
    expect(document.querySelectorAll('.reef-anchor__link--active')).toHaveLength(1);
  });

  test('受控 activeKey：点击其它项不改变激活状态', async () => {
    render(<Anchor items={items} activeKey="intro" />);
    await userEvent.click(screen.getByText('API'));
    const active = document.querySelector('.reef-anchor__link--active');
    expect(active!.textContent).toBe('简介');
  });
});
