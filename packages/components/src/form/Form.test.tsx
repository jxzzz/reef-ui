import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  test('提交时 onSubmit 通过 FormData 拿到输入的值', async () => {
    const values = vi.fn<(f: FormData, form: HTMLFormElement) => void>();
    render(
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          values(new FormData(e.currentTarget), e.currentTarget);
        }}
      >
        <FormItem name="user" label="用户名">
          <input name="user" />
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );

    await userEvent.type(userBox(), 'imx');
    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(values).toHaveBeenCalledTimes(1);
    const [data, form] = values.mock.calls[0];
    expect(data.get('user')).toBe('imx');
    expect(form.tagName).toBe('FORM');
  });

  test('help 显示在标签行；外部 error 直接展示且优先于表单校验错误', async () => {
    const { container } = render(
      <Form>
        <FormItem
          name="a"
          label="字段A"
          help="选填"
          error="外部错误"
          validate={() => '内部错误'}
        >
          <input name="a" />
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );

    expect(container.querySelector('.reef-formitem__help')!.textContent).toBe('选填');
    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(screen.getByRole('alert').textContent).toBe('外部错误');
  });

  test('validate 返回 undefined 视为通过', async () => {
    const onValid = vi.fn();
    render(
      <Form onSubmit={(e) => { e.preventDefault(); onValid(); }}>
        <FormItem name="a" label="A" validate={() => undefined}>
          <input name="a" />
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );

    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(onValid).toHaveBeenCalledTimes(1);
  });

  test('htmlFor 关联控件：点击 label 聚焦输入框', async () => {
    render(
      <Form>
        <FormItem name="user" label="用户名" htmlFor="user-input">
          <input id="user-input" name="user" />
        </FormItem>
      </Form>,
    );

    await userEvent.click(screen.getByText('用户名'));
    expect(userBox()).toBe(document.activeElement);
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

  test('rules：校验失败时控件描红（control 加 error 修饰类）', async () => {
    const { container } = render(
      <Form onSubmit={(e) => e.preventDefault()}>
        <FormItem name="a" label="A" rules={[{ required: true }]}>
          <input name="a" />
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(container.querySelector('.reef-formitem__control--error')).toBeTruthy();
  });
});

describe('Form 校验规则（rules）', () => {
  const alertText = () => document.querySelector('[role="alert"]')?.textContent;
  const box = (n: string) => document.querySelector<HTMLInputElement>(`input[name="${n}"]`)!;

  test('required：空值提交报错，默认文案为「请输入」', async () => {
    render(
      <Form>
        <FormItem name="nick" label="昵称" rules={[{ required: true }]}>
          <input name="nick" />
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    expect((await screen.findByRole('alert')).textContent).toBe('请输入');
  });

  test('custom message：自定义错误信息覆盖内置文案', async () => {
    render(
      <Form>
        <FormItem name="tel" label="电话" rules={[{ required: true, message: '电话必须填写' }]}>
          <input name="tel" />
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    expect((await screen.findByRole('alert')).textContent).toBe('电话必须填写');
  });

  test('min/max：按字符串长度校验', async () => {
    render(
      <Form>
        <FormItem name="pw" label="密码" rules={[{ min: 6 }, { max: 12 }]}>
          <input name="pw" />
        </FormItem>
      </Form>,
    );
    await userEvent.type(box('pw'), 'abc');
    expect(alertText()).toBe('最少 6 个字符');

    fireEvent.input(box('pw'), { target: { value: 'abcdefghijklmn' } });
    await waitFor(() => expect(alertText()).toBe('最多 12 个字符'));
  });

  test('min/max：数字输入按大小校验', async () => {
    render(
      <Form>
        <FormItem name="age" label="年龄" rules={[{ min: 18, max: 100 }]}>
          <input type="number" name="age" />
        </FormItem>
      </Form>,
    );
    await userEvent.type(box('age'), '3');
    expect(alertText()).toBe('不能小于 18');

    fireEvent.input(box('age'), { target: { value: '300' } });
    await waitFor(() => expect(alertText()).toBe('不能大于 100'));

    fireEvent.input(box('age'), { target: { value: '30' } });
    await waitFor(() => expect(alertText()).toBeUndefined());
  });

  test('pattern：正则不匹配时报错', async () => {
    render(
      <Form>
        <FormItem name="phone" label="手机号" rules={[{ pattern: /^1\d{10}$/, message: '手机号格式不正确' }]}>
          <input name="phone" />
        </FormItem>
      </Form>,
    );
    await userEvent.type(box('phone'), '123');
    expect(alertText()).toBe('手机号格式不正确');
  });

  test('异步 validator：等待 Promise，返回字符串为错误，undefined 通过后错误消除', async () => {
    render(
      <Form>
        <FormItem
          name="code"
          label="编号"
          rules={[
            {
              validator: (v) =>
                new Promise<string | undefined>((resolve) => {
                  setTimeout(() => resolve(String(v) === 'ok' ? undefined : '编号不可用'), 10);
                }),
            },
          ]}
        >
          <input name="code" />
        </FormItem>
      </Form>,
    );
    await userEvent.type(box('code'), 'no');
    expect((await screen.findByRole('alert')).textContent).toBe('编号不可用');

    fireEvent.input(box('code'), { target: { value: 'ok' } });
    await waitFor(() => expect(alertText()).toBeUndefined());
  });

  test('trigger 为 blur 时：输入不校验，失焦才校验', async () => {
    render(
      <Form>
        <FormItem name="tel" label="电话" rules={[{ required: true, trigger: 'blur' }]}>
          <input name="tel" />
        </FormItem>
      </Form>,
    );
    await userEvent.type(box('tel'), '123');
    expect(document.querySelector('[role="alert"]')).toBeNull();

    // 改回空值，change 事件依旧不校验（trigger: blur）
    fireEvent.input(box('tel'), { target: { value: '' } });
    expect(document.querySelector('[role="alert"]')).toBeNull();

    fireEvent.focusOut(box('tel'));
    expect((await screen.findByRole('alert')).textContent).toBe('请输入');
  });

  test('trigger 为 change 时：失焦不校验', async () => {
    render(
      <Form>
        <FormItem name="tel" label="电话" rules={[{ required: true, trigger: 'change' }]}>
          <input name="tel" />
        </FormItem>
      </Form>,
    );
    fireEvent.focusOut(box('tel'));
    await new Promise((r) => setTimeout(r, 20));
    expect(document.querySelector('[role="alert"]')).toBeNull();
  });

  test('输入改对后错误即时消除', async () => {
    render(
      <Form>
        <FormItem name="pw" label="密码" rules={[{ min: 6 }]}>
          <input name="pw" />
        </FormItem>
      </Form>,
    );
    await userEvent.type(box('pw'), 'abc');
    expect(alertText()).toBe('最少 6 个字符');

    fireEvent.input(box('pw'), { target: { value: 'abcdef' } });
    await waitFor(() => expect(alertText()).toBeUndefined());
  });

  test('rules 全部通过时提交：onFinish 收到表单值', async () => {
    const onFinish = vi.fn();
    render(
      <Form onFinish={onFinish}>
        <FormItem name="user" label="用户名" rules={[{ required: true }, { min: 2 }]}>
          <input name="user" />
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );
    await userEvent.type(box('user'), 'imx');
    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    await waitFor(() => expect(onFinish).toHaveBeenCalledTimes(1));
    expect(onFinish.mock.calls[0][0]).toEqual({ user: 'imx' });
  });

  test('rules 存在错误时提交：onFinishFailed 收到错误表', async () => {
    const onFinish = vi.fn();
    const onFinishFailed = vi.fn();
    render(
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <FormItem name="user" label="用户名" rules={[{ required: true, message: '必填项' }]}>
          <input name="user" />
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: '提交' }));
    expect((await screen.findByRole('alert')).textContent).toBe('必填项');
    expect(onFinish).not.toHaveBeenCalled();
    await waitFor(() => expect(onFinishFailed).toHaveBeenCalledTimes(1));
    expect(onFinishFailed.mock.calls[0][0]).toEqual({ user: '必填项' });
  });

  test('rules 与 validate 同时存在：rules 优先，通过后再走 validate', async () => {
    render(
      <Form>
        <FormItem
          name="a"
          label="A"
          rules={[{ min: 3, message: '至少 3 个字符' }]}
          validate={(v) => (v.includes('!') ? '不能包含感叹号' : null)}
        >
          <input name="a" />
        </FormItem>
      </Form>,
    );
    await userEvent.type(box('a'), 'ab');
    expect(alertText()).toBe('至少 3 个字符');

    fireEvent.input(box('a'), { target: { value: 'oh!' } });
    await waitFor(() => expect(alertText()).toBe('不能包含感叹号'));

    fireEvent.input(box('a'), { target: { value: 'okk' } });
    await waitFor(() => expect(alertText()).toBeUndefined());
  });
});
