import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { Dropdown } from '../dropdown';
import { Select } from '../select';

// jsdom 未实现 scrollIntoView
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(cleanup);

const opts = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
];

describe('useAnchoredPopup：浮层进顶层', () => {
  test('打开时面板挂上 popover 与 position-anchor，触发器挂上同名 anchor-name', async () => {
    const { container } = render(<Select options={opts} />);
    await userEvent.click(screen.getByRole('combobox'));

    const panel = container.querySelector<HTMLElement>('.reef-select__panel')!;
    const root = container.querySelector<HTMLElement>('.reef-select')!;
    expect(panel.getAttribute('popover')).toBe('manual');
    expect(panel.className).toContain('reef-popup');

    const anchorName = root.style.getPropertyValue('anchor-name');
    expect(anchorName).toMatch(/^--reef-anchor-/);
    expect(panel.style.getPropertyValue('position-anchor')).toBe(anchorName);
  });

  test('关闭后触发器上的 anchor-name 被清掉，不留残样式', async () => {
    const { container } = render(<Select options={opts} />);
    const root = container.querySelector<HTMLElement>('.reef-select')!;
    await userEvent.click(screen.getByRole('combobox'));
    expect(root.style.getPropertyValue('anchor-name')).not.toBe('');

    await userEvent.keyboard('{Escape}');
    expect(root.style.getPropertyValue('anchor-name')).toBe('');
  });

  test('两个实例的 anchor-name 不重名', async () => {
    const { container } = render(
      <>
        <Select options={opts} />
        <Select options={opts} />
      </>,
    );
    const [a, b] = screen.getAllByRole('combobox');
    await userEvent.click(a);
    await userEvent.click(b);
    const roots = container.querySelectorAll<HTMLElement>('.reef-select');
    const names = [...roots].map((r) => r.style.getPropertyValue('anchor-name'));
    expect(new Set(names.filter(Boolean)).size).toBe(names.filter(Boolean).length);
  });

  test('Dropdown placement 为 *-end 时走右对齐修饰类', async () => {
    const { container } = render(
      <Dropdown placement="bottom-end" items={[{ key: 'a', label: 'A' }]}>
        <span>触发</span>
      </Dropdown>,
    );
    await userEvent.click(screen.getByText('触发'));
    const menu = container.querySelector<HTMLElement>('[role="menu"]')!;
    expect(menu.className).toContain('reef-popup--end');
    expect(menu.getAttribute('popover')).toBe('manual');
  });
});
