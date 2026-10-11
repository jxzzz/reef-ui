import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Slider } from './Slider';

afterEach(cleanup);

const input = () => screen.getByRole('slider') as HTMLInputElement;

describe('Slider', () => {
  test('defaultValue 初始值，min/max/step 默认 0/100/1', () => {
    render(<Slider defaultValue={30} />);
    const el = input();
    expect(el.value).toBe('30');
    expect(el.getAttribute('min')).toBe('0');
    expect(el.getAttribute('max')).toBe('100');
    expect(el.getAttribute('step')).toBe('1');
    expect(el.getAttribute('aria-label')).toBe('Slider');
  });

  test('未传 defaultValue 时取 min', () => {
    render(<Slider min={20} />);
    expect(input().value).toBe('20');
  });

  test('拖动（input 事件）回调数字并更新非受控值', () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={30} onChange={onChange} />);
    fireEvent.change(input(), { target: { value: '60' } });
    expect(onChange).toHaveBeenCalledWith(60);
    expect(input().value).toBe('60');
  });

  test('受控 value：显示跟随父组件，事件仍回调', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Slider value={40} onChange={onChange} />);
    expect(input().value).toBe('40');

    fireEvent.change(input(), { target: { value: '70' } });
    expect(onChange).toHaveBeenCalledWith(70);

    // 未更新 value 前显示保持 40，父组件更新后跟随
    expect(input().value).toBe('40');
    rerender(<Slider value={70} onChange={onChange} />);
    expect(input().value).toBe('70');
  });

  test('disabled 时渲染禁用且不触发 onChange', () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={30} disabled onChange={onChange} />);
    expect((input() as HTMLInputElement).disabled).toBeTruthy();
    fireEvent.change(input(), { target: { value: '60' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('min/max/step 透传，填充百分比写入 CSS 变量', () => {
    render(<Slider min={0} max={50} step={5} value={25} />);
    const el = input();
    expect(el.getAttribute('min')).toBe('0');
    expect(el.getAttribute('max')).toBe('50');
    expect(el.getAttribute('step')).toBe('5');
    expect((el.style as CSSStyleDeclaration).getPropertyValue('--reef-slider-fill')).toBe('50%');
  });
});
