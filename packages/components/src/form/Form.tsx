import { forwardRef, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { FormItem } from './FormItem';
import { FormValidationContext } from './context';
import type { FormProps, Validator } from './types';
import './form.css';

/** 校验结果：rules/validator 为异步时是 Promise */
const isPromise = (r: unknown): r is PromiseLike<string | null | undefined> =>
  typeof (r as PromiseLike<string | null | undefined> | null | undefined)?.then === 'function';

interface FieldResult {
  name: string;
  msg: string | null | undefined;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ layout = 'vertical', className, onSubmit, onInput, onFinish, onFinishFailed, children, ...rest }, ref) => {
    // FormItem 注册的校验函数表：name -> validate
    const validators = useRef(new Map<string, Validator>());
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validation = {
      register: (name: string, validate: Validator) => {
        validators.current.set(name, validate);
      },
      errors,
    };

    // 表单值直接从 DOM 读（FormData），不接管控件状态，保持无侵入
    const readValues = (form: HTMLFormElement) =>
      Object.fromEntries(new FormData(form).entries() as Iterable<[string, string]>);

    // onFinish 的值口径：同名多值字段（多选 Select、Cascader 路径、日期区间）保留成数组
    const readAllValues = (form: HTMLFormElement) => {
      const data = new FormData(form);
      return Object.fromEntries(
        [...new Set(data.keys())].map((k) => {
          const all = data.getAll(k);
          return [k, all.length > 1 ? all : all[0]];
        }),
      );
    };

    const runField = (name: string, values: Record<string, string>) => {
      const validate = validators.current.get(name);
      return validate ? validate(values[name] ?? '', values) : null;
    };

    const collect = (results: FieldResult[]) => {
      const next: Record<string, string> = {};
      for (const { name, msg } of results) if (msg) next[name] = msg;
      return next;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      const values = readValues(e.currentTarget);
      // 提交时一次性校验全部字段，所有错误同时展示
      const results = [...validators.current.keys()].map((name) => ({
        name,
        msg: runField(name, values),
      }));

      // 同步校验保持原有路径：不通过则阻止提交，通过则不干预原生行为
      if (!results.some((r) => isPromise(r.msg))) {
        const next = collect(results as FieldResult[]);
        if (Object.keys(next).length > 0) {
          e.preventDefault();
          setErrors(next);
          onFinishFailed?.(next);
          return;
        }
        setErrors({});
        onFinish?.(readAllValues(e.currentTarget));
        onSubmit?.(e);
        return;
      }

      // ponytail: 异步校验必须先 preventDefault 再等待，通过后无法恢复原生提交，
      // 升级路径是 form.requestSubmit 重放（需去重防循环），当前只回调 onFinish
      e.preventDefault();
      const allValues = readAllValues(e.currentTarget);
      void Promise.all(
        results.map(async (r) => ({ name: r.name, msg: await r.msg })),
      ).then((settled) => {
        const next = collect(settled as FieldResult[]);
        setErrors(next);
        if (Object.keys(next).length > 0) onFinishFailed?.(next);
        else onFinish?.(allValues);
      });
    };

    // 已有错误的字段在输入时即时重校验，改对立即消错
    const handleInput = (e: React.FormEvent<HTMLFormElement>) => {
      onInput?.(e);
      const target = e.target as HTMLInputElement;
      if (!target.name || !errors[target.name]) return;
      const msg = runField(target.name, readValues(e.currentTarget));
      const apply = (m: string | null | undefined) =>
        setErrors((prev) => {
          const next = { ...prev };
          if (m) next[target.name] = m;
          else delete next[target.name];
          return next;
        });
      if (isPromise(msg)) void Promise.resolve(msg).then(apply);
      else apply(msg);
    };

    return (
      <form
        ref={ref}
        noValidate
        className={cn('reef-form', `reef-form--${layout}`, className)}
        onSubmit={handleSubmit}
        onInput={handleInput}
        {...rest}
      >
        <FormValidationContext.Provider value={validation}>
          {children}
        </FormValidationContext.Provider>
      </form>
    );
  },
);

Form.displayName = 'Form';

export const Item = FormItem;
