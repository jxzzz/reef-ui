import { forwardRef, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import type { InputProps } from './types';
import './input.css';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'medium',
      invalid = false,
      block = false,
      clearable = false,
      prefix,
      suffix,
      className,
      type = 'text',
      value,
      defaultValue,
      onChange,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLInputElement | null>(null);
    const [hasContent, setHasContent] = useState(() => String(value ?? defaultValue ?? '').length > 0);
    const wrapped = clearable || prefix != null || suffix != null;

    const setRef = (el: HTMLInputElement | null) => {
      innerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as { current: HTMLInputElement | null }).current = el;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasContent(e.currentTarget.value.length > 0);
      onChange?.(e);
    };

    // 通过原生 setter + input 事件清空，受控/非受控都能触发 onChange
    const clear = () => {
      const input = innerRef.current;
      if (!input) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
      setter.call(input, '');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      setHasContent(false);
      input.focus();
    };

    const input = (
      <input
        ref={wrapped ? setRef : ref}
        type={type}
        className={cn(
          'reef-input',
          !wrapped && `reef-input--${size}`,
          !wrapped && {
            'reef-input--invalid': invalid,
            'reef-input--block': block,
          },
          wrapped && 'reef-input--bare',
          className,
        )}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    );

    if (!wrapped) return input;

    return (
      // 尺寸/状态走 data 属性，与组件库"元素状态用属性选择器"的约定一致
      <span
        className={cn('reef-input__wrapper', { 'reef-input__wrapper--block': block })}
        data-size={size}
        data-invalid={invalid || undefined}
      >
        {prefix != null && <span className="reef-input__prefix">{prefix}</span>}
        {input}
        {clearable && hasContent && !disabled && (
          <button type="button" className="reef-input__clear" aria-label="清空" onClick={clear}>
            <Icon name="close" size={10} />
          </button>
        )}
        {suffix != null && <span className="reef-input__suffix">{suffix}</span>}
      </span>
    );
  },
);

Input.displayName = 'Input';
