import { forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { FormValidationContext } from './context';
import type { FormItemProps, FormRule, Validator } from './types';

const isEmpty = (v: unknown): boolean =>
  v == null ||
  v === '' ||
  (Array.isArray(v) && (v.length === 0 || v.every((x) => x == null || x === '')));

const isPromiseLike = (v: unknown): v is PromiseLike<string | undefined> =>
  typeof (v as PromiseLike<string | undefined> | null | undefined)?.then === 'function';

/** 单条规则校验：返回错误信息表示不通过，返回 undefined 表示通过 */
function checkRule(
  rule: FormRule,
  value: unknown,
): string | undefined | Promise<string | undefined> {
  const { required, min, max, pattern, validator, message } = rule;
  if (required && isEmpty(value)) return message ?? '请输入';
  if (!isEmpty(value)) {
    const isNumber = typeof value === 'number';
    const size = isNumber ? value : String(value).length;
    if (min !== undefined && size < min) {
      return message ?? (isNumber ? `不能小于 ${min}` : `最少 ${min} 个字符`);
    }
    if (max !== undefined && size > max) {
      return message ?? (isNumber ? `不能大于 ${max}` : `最多 ${max} 个字符`);
    }
    if (pattern && !pattern.test(String(value))) return message ?? '格式不正确';
  }
  if (validator) {
    const msg = validator(value);
    // 自定义 message 优先于 validator 返回的信息
    if (isPromiseLike(msg)) return msg.then((m) => (m ? message ?? m : undefined));
    return msg ? message ?? msg : undefined;
  }
  return undefined;
}

/** 按顺序执行规则，首个不通过的规则决定错误信息 */
export async function runRules(
  rules: FormRule[],
  value: unknown,
): Promise<string | undefined> {
  for (const rule of rules) {
    const msg = await checkRule(rule, value);
    if (msg) return msg;
  }
  return undefined;
}

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ name, validate, rules, label, htmlFor, required = false, error, help, className, children, ...rest }, ref) => {
    const validation = useContext(FormValidationContext);
    const [ruleError, setRuleError] = useState<string>();
    const controlRef = useRef<HTMLDivElement>(null);

    // 从 DOM 读字段值（与 Form 的 FormData 口径一致）；
    // number 输入转成数字，min/max 按大小而非位数校验
    const readValue = (): unknown => {
      const control = controlRef.current;
      if (!control) return undefined;
      const el = control.querySelector<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >('input, textarea, select');
      const normalize = (v: FormDataEntryValue | string): unknown =>
        el instanceof HTMLInputElement &&
        el.type === 'number' &&
        typeof v === 'string' &&
        v !== ''
          ? Number(v)
          : v;
      const form = control.closest('form');
      if (form && name) {
        const all = new FormData(form).getAll(name);
        if (all.length > 1) return all;
        if (all.length === 1) return normalize(all[0]);
      }
      return el ? normalize(el.value) : undefined;
    };

    // rules 与 validate 合并成注册给 Form 的校验函数：提交 / 即时重校验时由 Form 调用
    const combined = useMemo<Validator | undefined>(() => {
      if (!rules) return validate;
      return (_value, values) =>
        runRules(rules, readValue()).then(
          (msg) => msg ?? validate?.(values[name ?? ''] ?? '', values) ?? undefined,
        );
    }, [rules, validate, name]);

    // 把校验函数注册给所在 Form，提交时由 Form 统一调用
    useEffect(() => {
      if (validation && name && combined) {
        validation.register(name, combined);
      }
    }, [validation, name, combined]);

    // trigger 驱动的即时校验：input 冒泡对应 change，focusout 冒泡对应 blur
    useEffect(() => {
      const control = controlRef.current;
      if (!control || !rules || !name) return;
      let seq = 0; // 异步 validator 乱序返回时只认最后一次
      const run = (trigger: 'change' | 'blur') => {
        const list = rules.filter((r) => !r.trigger || r.trigger === trigger);
        if (!list.length) return;
        const id = ++seq;
        void runRules(list, readValue()).then((msg) => {
          if (id !== seq) return;
          // rules 通过后接着跑 validate，与提交时 combined 的口径保持一致
          if (msg || !validate || !name) return setRuleError(msg);
          const form = control.closest('form');
          const values = form
            ? (Object.fromEntries(new FormData(form).entries()) as Record<string, string>)
            : {};
          void Promise.resolve(validate(values[name] ?? '', values)).then((m) => {
            if (id === seq) setRuleError(m ?? undefined);
          });
        });
      };
      const onChange = () => run('change');
      const onBlur = () => run('blur');
      control.addEventListener('input', onChange);
      control.addEventListener('focusout', onBlur);
      return () => {
        control.removeEventListener('input', onChange);
        control.removeEventListener('focusout', onBlur);
      };
    }, [rules, name, validate]);

    const formError = name && validation ? validation.errors[name] : undefined;
    const message = error ?? formError ?? ruleError;

    return (
      <div
        ref={ref}
        className={cn('reef-formitem', { 'reef-formitem--error': !!message }, className)}
        {...rest}
      >
        {label && (
          <div className="reef-formitem__head">
            <label className="reef-formitem__label" htmlFor={htmlFor}>
              {required && (
                <span className="reef-formitem__required" aria-hidden="true">
                  *
                </span>
              )}
              {label}
            </label>
            {/* help 显示在标签右上角，不占下方提示行 */}
            {help && <span className="reef-formitem__help">{help}</span>}
          </div>
        )}
        <div
          ref={controlRef}
          className={cn('reef-formitem__control', {
            'reef-formitem__control--error': !!message,
          })}
        >
          {children}
          {/* 始终渲染，空时也占一行高度，避免错误出现时布局跳动 */}
          <div
            className={cn('reef-formitem__message', {
              'reef-formitem__message--error': !!message,
            })}
            role={message ? 'alert' : undefined}
          >
            {message}
          </div>
        </div>
      </div>
    );
  },
);

FormItem.displayName = 'FormItem';
