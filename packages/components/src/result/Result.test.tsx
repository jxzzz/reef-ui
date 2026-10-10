import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Result } from './Result';

afterEach(cleanup);

describe('Result', () => {
  test('渲染标题与副标题', () => {
    render(<Result status="success" title="提交成功" subTitle="审核将在 1 个工作日内完成" />);
    expect(screen.getByText('提交成功')).toBeTruthy();
    expect(screen.getByText('审核将在 1 个工作日内完成')).toBeTruthy();
  });

  test('status 类名生效，icon 可覆盖默认图标', () => {
    const { container } = render(<Result status="error" icon={<b className="my-icon">x</b>} title="失败" />);
    expect((container.firstElementChild as HTMLElement).className).toContain('reef-result--error');
    expect(container.querySelector('.my-icon')).toBeTruthy();
    expect(container.querySelector('.reef-result__icon svg')).toBeNull();
  });

  test('extra 渲染操作区', () => {
    render(<Result title="完成" extra={<button type="button">返回首页</button>} />);
    expect(screen.getByText('返回首页')).toBeTruthy();
  });
});
