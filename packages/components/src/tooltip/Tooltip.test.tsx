import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { Button } from '../button';
import { Tooltip } from './Tooltip';

afterEach(cleanup);

describe('Tooltip', () => {
  test('气泡文案挂到 data-tip，不渲染额外可见节点，不挡子元素', () => {
    render(
      <Tooltip title="删除该条目">
        <Button>删除</Button>
      </Tooltip>,
    );

    const wrapper = screen.getByRole('button', { name: '删除' }).parentElement!;
    expect(wrapper.getAttribute('data-tip')).toBe('删除该条目');
    expect(screen.queryByText('删除该条目')).toBeNull(); // ::after 内容不进 DOM
  });

  test('placement 透出对应 modifier 类', () => {
    const { container } = render(
      <Tooltip title="提示" placement="bottom">
        <span>目标</span>
      </Tooltip>,
    );

    expect(container.firstElementChild!.className).toContain('reef-tooltip--bottom');
  });
});
