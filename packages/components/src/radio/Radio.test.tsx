import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

afterEach(cleanup);

describe('RadioGroup', () => {
  test('点选一个，兄弟项取消选中（互斥由 value 派生，不靠 DOM）', async () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup name="fruit" defaultValue="apple" onChange={handleChange}>
        <Radio value="apple">苹果</Radio>
        <Radio value="banana">香蕉</Radio>
      </RadioGroup>,
    );

    const apple = screen.getByRole('radio', { name: '苹果' }) as HTMLInputElement;
    const banana = screen.getByRole('radio', { name: '香蕉' }) as HTMLInputElement;
    expect(apple.checked).toBe(true);
    expect(banana.checked).toBe(false);

    await userEvent.click(banana);
    expect(handleChange).toHaveBeenCalledWith('banana');
    expect(banana.checked).toBe(true);
    expect(apple.checked).toBe(false);
  });

  test('受控模式：value 不变则点击不改变选中', async () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup name="fruit" value="apple" onChange={handleChange}>
        <Radio value="apple">苹果</Radio>
        <Radio value="banana">香蕉</Radio>
      </RadioGroup>,
    );

    await userEvent.click(screen.getByRole('radio', { name: '香蕉' }));
    expect(handleChange).toHaveBeenCalledWith('banana');
    expect((screen.getByRole('radio', { name: '香蕉' }) as HTMLInputElement).checked).toBe(false);
  });

  test('group disabled 时子项全部禁用', async () => {
    const handleChange = vi.fn();
    render(
      <RadioGroup name="fruit" defaultValue="apple" disabled onChange={handleChange}>
        <Radio value="banana">香蕉</Radio>
      </RadioGroup>,
    );

    await userEvent.click(screen.getByRole('radio', { name: '香蕉' }));
    expect(handleChange).not.toHaveBeenCalled();
  });
});
