import { forwardRef, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { FormItem } from './FormItem';
import { FormValidationContext } from './context';
import type { FormProps, Validator } from './types';
import './form.css';

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ layout = 'vertical', className, onSubmit, onInput, children, ...rest }, ref) => {
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

    const runField = (name: string, values: Record<string, string>) => {
      const validate = validators.current.get(name);
      return validate ? validate(values[name] ?? '', values) : null;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      const values = readValues(e.currentTarget);
      const next: Record<string, string> = {};
      // 提交时一次性校验全部字段，所有错误同时展示
      for (const name of validators.current.keys()) {
        const msg = runField(name, values);
        if (msg) next[name] = msg;
      }
      if (Object.keys(next).length > 0) {
        e.preventDefault();
        setErrors(next);
        return;
      }
      setErrors({});
      onSubmit?.(e);
    };

    // 已有错误的字段在输入时即时重校验，改对立即消错
    const handleInput = (e: React.FormEvent<HTMLFormElement>) => {
      onInput?.(e);
      const target = e.target as HTMLInputElement;
      if (!target.name || !errors[target.name]) return;
      const msg = runField(target.name, readValues(e.currentTarget));
      setErrors((prev) => {
        const next = { ...prev };
        if (msg) next[target.name] = msg;
        else delete next[target.name];
        return next;
      });
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
