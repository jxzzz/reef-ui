import { forwardRef, useContext, useEffect } from 'react';
import { cn } from '@reef-ui/utils';
import { FormValidationContext } from './context';
import type { FormItemProps } from './types';

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ name, validate, label, htmlFor, required = false, error, help, className, children, ...rest }, ref) => {
    const validation = useContext(FormValidationContext);
    const formError = name && validation ? validation.errors[name] : undefined;
    const message = error ?? formError;

    // 把校验函数注册给所在 Form，提交时由 Form 统一调用
    useEffect(() => {
      if (validation && name && validate) {
        validation.register(name, validate);
      }
    }, [validation, name, validate]);

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
        <div className="reef-formitem__control">
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
