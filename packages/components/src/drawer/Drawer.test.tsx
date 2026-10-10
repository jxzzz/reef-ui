import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Drawer } from './Drawer';

afterEach(cleanup);

describe('Drawer', () => {
  test('open 时在 body 渲染面板与标题', () => {
    render(
      <Drawer open title="详情">
        <p>内容</p>
      </Drawer>,
    );
    expect(screen.getByText('详情')).toBeTruthy();
    expect(document.querySelector('.reef-drawer__panel')).toBeTruthy();
  });

  test('open=false 时 body 零残留（Review Focus #1）', () => {
    const { container } = render(
      <Drawer open={false} title="详情">
        内容
      </Drawer>,
    );
    expect(container.innerHTML).toBe('');
    expect(document.querySelector('.reef-drawer')).toBeNull();
  });

  test('点遮罩与 Esc 都触发 onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { rerender } = render(
      <Drawer open onClose={onClose}>
        内容
      </Drawer>,
    );
    await user.click(document.querySelector('.reef-drawer__overlay')!);
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(
      <Drawer open onClose={onClose}>
        内容
      </Drawer>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('placement=left 加左定位样式，面板宽度生效', () => {
    render(
      <Drawer open placement="left" width={420} title="左抽屉">
        内容
      </Drawer>,
    );
    const panel = document.querySelector('.reef-drawer__panel') as HTMLElement;
    expect(panel.style.width).toBe('420px');
    expect(panel.style.left).toBe('0px');
  });

  test('面板携带 data-placement 供动画方向区分', () => {
    render(
      <Drawer open placement="left" title="左抽屉">
        内容
      </Drawer>,
    );
    expect(document.querySelector('.reef-drawer__panel')!.getAttribute('data-placement')).toBe('left');
  });

  test('多层叠加时 Esc 只关闭最上层', async () => {
    const user = userEvent.setup();
    const onTop = vi.fn();
    const onBottom = vi.fn();
    render(
      <>
        <Drawer open onClose={onBottom} title="底层">
          底层
        </Drawer>
        <Drawer open onClose={onTop} title="顶层">
          顶层
        </Drawer>
      </>,
    );
    await user.keyboard('{Escape}');
    expect(onTop).toHaveBeenCalledTimes(1);
    expect(onBottom).not.toHaveBeenCalled();
  });

  test('open 时焦点移入面板，关闭后还原到触发元素', () => {
    const { rerender } = render(
      <>
        <button type="button">打开按钮</button>
        <Drawer open title="详情">
          内容
        </Drawer>
      </>,
    );
    expect(document.activeElement).toBe(document.querySelector('.reef-drawer__panel'));

    rerender(
      <>
        <button type="button">打开按钮</button>
        <Drawer open={false} title="详情">
          内容
        </Drawer>
      </>,
    );
    expect(document.activeElement!.textContent).toBe('打开按钮');
  });
});
