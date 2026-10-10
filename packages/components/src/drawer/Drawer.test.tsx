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
});
