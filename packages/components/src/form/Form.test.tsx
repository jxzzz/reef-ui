import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Form } from './Form';
import { FormItem } from './FormItem';

afterEach(cleanup);

function renderForm(onValid?: ReturnType<typeof vi.fn>) {
  return render(
    <Form onSubmit={(e) => { e.preventDefault(); onValid?.(e); }}>
      <FormItem name="user" label="用户名" required validate={(v) => (v.trim() ? null : '请输入用户名')}>
        <input name="user" />
      </FormItem>
      <FormItem name="mail" label="邮箱" validate={(v, all) => (all.user === v ? '不能与用户名相同' : null)}>
        <input name="mail" />
      </FormItem>
      <button type="submit">提交</button>
    </Form>,
  );
}

const messages = () =>
  [...document.querySelectorAll('[role="alert"]')].map((el) => el.textContent).sort();
const userError = () =>
  document.querySelector<HTMLInputElement>('input[name="user"]')!
    .closest('.reef-formitem')!.querySelector('[role="alert"]');
const userBox = () => document.querySelector<HTMLInputElement>('input[name="user"]')!;
const mailBox = () => document.querySelector<HTMLInputElement>('input[name="mail"]')!;

describe('Form', () => {
  test('提交时校验全部字段，无效则阻止提交并显示错误', async () => {
    const onValid = vi.fn();
    renderForm(onValid);

    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(onValid).not.toHaveBeenCalled();
    expect(messages()).toEqual(['不能与用户名相同', '请输入用户名']);
  });

  test('校验通过后提交', async () => {
    const onValid = vi.fn();
    renderForm(onValid);

    await userEvent.type(userBox(), 'imx');
    await userEvent.type(mailBox(), 'a@b.c');
    await userEvent.click(screen.getByRole('button', { name: '提交' }));

    expect(onValid).toHaveBeenCalledTimes(1);
    expect(messages()).toEqual([]);
  });

  test('跨字段校验：邮箱与用户名相同时报错', async () => {
    renderForm();

    await userEvent.type(userBox(), 'dup');
    await userEvent.type(mailBox(), 'dup');
    await userEvent.click(screen.getByRole('button', { name: '提交' }));

    expect(messages()).toEqual(['不能与用户名相同']);
  });

  test('已有错误字段输入改对后，错误即时消失', async () => {
    renderForm();

    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(userError()?.textContent).toBe('请输入用户名');

    await userEvent.type(userBox(), 'imx');
    expect(userError()).toBeNull();
  });

  test('无错误的字段输入不触发校验', async () => {
    renderForm();

    await userEvent.type(mailBox(), 'not-an-email');
    expect(messages()).toEqual([]);
  });

  test('fireEvent 派发 input 事件同样触发即时重校验', () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(userError()).toBeTruthy();

    fireEvent.input(userBox(), { target: { value: 'ok' } });
    expect(userError()).toBeNull();
  });

  test('layout class 生效；label 显示必填星号', () => {
    const { container } = render(
      <Form layout="inline">
        <FormItem name="a" label="A" required validate={() => null}>
          <input name="a" />
        </FormItem>
      </Form>,
    );
    expect(container.querySelector('form')!.className).toContain('reef-form--inline');
    expect(container.querySelector('.reef-formitem__required')).toBeTruthy();
  });
});
