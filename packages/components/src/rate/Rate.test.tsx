import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Rate } from './Rate';

afterEach(cleanup);

const stars = () => screen.getAllByRole('radio');

describe('Rate', () => {
  test('defaultValue 初始渲染前 n 颗有填充类', () => {
    render(<Rate defaultValue={3} />);
    const list = stars();
    expect(list[2].classList.contains('reef-rate__star--on')).toBeTruthy();
    expect(list[0].classList.contains('reef-rate__star--on')).toBeTruthy();
    expect(list[3].classList.contains('reef-rate__star--on')).toBe(false);
  });

  test('点击第 3 颗触发 onChange(3)', () => {
    const onChange = vi.fn();
    render(<Rate onChange={onChange} />);
    fireEvent.click(stars()[2]);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  test('受控模式点击只回调、不自行变更', () => {
    const onChange = vi.fn();
    const { container } = render(<Rate value={2} onChange={onChange} />);
    fireEvent.click(stars()[4]);
    expect(onChange).toHaveBeenCalledWith(5);
    expect(container.querySelectorAll('.reef-rate__star--on').length).toBe(2);
  });

  test('allowClear 再次点击当前值清零', () => {
    const onChange = vi.fn();
    render(<Rate defaultValue={2} allowClear onChange={onChange} />);
    fireEvent.click(stars()[1]);
    expect(onChange).toHaveBeenCalledWith(0);
  });

  test('disabled 点击不触发 onChange', () => {
    const onChange = vi.fn();
    render(<Rate disabled onChange={onChange} />);
    fireEvent.click(stars()[0]);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('readonly 点击不触发 onChange', () => {
    const onChange = vi.fn();
    render(<Rate readonly onChange={onChange} />);
    fireEvent.click(stars()[0]);
    expect(onChange).not.toHaveBeenCalled();
  });
});
