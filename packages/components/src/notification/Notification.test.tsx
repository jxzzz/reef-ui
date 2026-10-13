import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Notification } from './Notification';

// 命令式单例直接驱动 createRoot，需包 act 让渲染同步落盘
function openAct(fn: () => void) {
  act(fn);
}

// 单例挂在 body 上，RTL cleanup 清不掉，须手动复位并还原定时器
afterEach(() => {
  act(() => Notification.destroy());
  vi.useRealTimers();
  cleanup();
});

describe('Notification', () => {
  test('四种类型均渲染标题、内容与对应图标', () => {
    openAct(() => {
      Notification.success({ title: '保存成功', content: '数据已写入' });
      Notification.info({ title: '普通提示' });
      Notification.warning({ title: '请注意', content: '余额即将耗尽' });
      Notification.error({ title: '出错了' });
    });
    expect(screen.getByText('保存成功')).toBeTruthy();
    expect(screen.getByText('数据已写入')).toBeTruthy();
    expect(screen.getByText('普通提示')).toBeTruthy();
    expect(screen.getByText('请注意')).toBeTruthy();
    expect(screen.getByText('余额即将耗尽')).toBeTruthy();
    expect(screen.getByText('出错了')).toBeTruthy();
    for (const type of ['success', 'info', 'warning', 'error'] as const) {
      expect(
        document.querySelector(`.reef-notification__item--${type} .reef-notification__icon`),
      ).toBeTruthy();
    }
  });

  test('open() 未指定 type 时默认 info', () => {
    openAct(() => {
      Notification.open({ title: '默认类型' });
    });
    expect(document.querySelector('.reef-notification__item--info')).toBeTruthy();
  });

  test('到时自动关闭，容器随之移除', () => {
    vi.useFakeTimers();
    openAct(() => {
      Notification.open({ title: '三秒后消失', duration: 3000 });
    });
    expect(screen.getByText('三秒后消失')).toBeTruthy();
    // 3000ms 触发关闭 → 200ms 退出动画后真正移除
    act(() => {
      vi.advanceTimersByTime(3300);
    });
    expect(screen.queryByText('三秒后消失')).toBeNull();
    expect(document.querySelector('.reef-notification')).toBeNull();
  });

  test('默认延时 4500ms', () => {
    vi.useFakeTimers();
    openAct(() => {
      Notification.open({ title: '默认延时' });
    });
    act(() => {
      vi.advanceTimersByTime(4400);
    });
    expect(screen.getByText('默认延时')).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText('默认延时')).toBeNull();
  });

  test('duration 为 0 时不自动关闭', () => {
    vi.useFakeTimers();
    openAct(() => {
      Notification.open({ title: '常驻通知', duration: 0 });
    });
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(screen.getByText('常驻通知')).toBeTruthy();
  });

  test('手动点 × 关闭该条，其余保留', () => {
    vi.useFakeTimers();
    openAct(() => {
      Notification.open({ title: '第一条' });
      Notification.open({ title: '第二条', duration: 0 });
    });
    const closes = document.querySelectorAll('.reef-notification__close');
    fireEvent.click(closes[0]);
    // 退出动画结束后移除
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.queryByText('第一条')).toBeNull();
    expect(screen.getByText('第二条')).toBeTruthy();
  });
});
