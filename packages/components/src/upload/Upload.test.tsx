import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Upload } from './Upload';

afterEach(cleanup);

/** jsdom 没有真实拖拽，手搓 drop 事件并挂上 dataTransfer */
function dropFiles(el: Element, files: File[]) {
  const event = new Event('drop', { bubbles: true });
  Object.defineProperty(event, 'dataTransfer', { value: { files } });
  fireEvent(el, event);
}

describe('Upload', () => {
  test('渲染拖拽区 hint 与隐藏的 file input', () => {
    render(<Upload />);
    expect(screen.getByText('点击或拖拽文件到此处')).toBeTruthy();
    const input = document.querySelector('input[type="file"]')!;
    expect(input).toBeTruthy();
    expect(input.className).toContain('reef-upload__input');
  });

  test('input change 抛 onChange 含新文件，multiple 支持多选', () => {
    const handleChange = vi.fn();
    render(<Upload multiple onChange={handleChange} />);
    const input = document.querySelector('input[type="file"]')!;
    fireEvent.change(input, { target: { files: [new File(['x'], 'a.txt'), new File(['yy'], 'b.txt')] } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    const files = handleChange.mock.calls[0][0];
    expect(files.map((f: File) => f.name)).toEqual(['a.txt', 'b.txt']);
    expect(screen.getByText('1 B')).toBeTruthy();
    expect(screen.getByText('2 B')).toBeTruthy();
  });

  test('drop 事件把 dataTransfer.files 合并进列表', () => {
    const handleChange = vi.fn();
    const { container } = render(<Upload onChange={handleChange} />);
    const dropzone = container.querySelector('.reef-upload__dropzone')!;
    dropFiles(dropzone, [new File(['x'], 'a.txt')]);
    dropFiles(dropzone, [new File(['yy'], 'b.txt')]);
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange.mock.calls[1][0].map((f: File) => f.name)).toEqual(['a.txt', 'b.txt']);
  });

  test('按 name+size+lastModified 去重', () => {
    const handleChange = vi.fn();
    const { container } = render(<Upload onChange={handleChange} />);
    const dropzone = container.querySelector('.reef-upload__dropzone')!;
    const a = new File(['x'], 'a.txt');
    const dup = new File(['x'], 'a.txt');
    Object.defineProperty(dup, 'lastModified', { value: a.lastModified });
    dropFiles(dropzone, [a]);
    dropFiles(dropzone, [dup, new File(['yy'], 'b.txt')]);
    expect(handleChange.mock.calls[1][0]).toHaveLength(2);
    expect(handleChange.mock.calls[1][0].map((f: File) => f.name)).toEqual(['a.txt', 'b.txt']);
  });

  test('dragover 高亮，dragleave 取消', () => {
    const { container } = render(<Upload />);
    const dropzone = container.querySelector('.reef-upload__dropzone')!;
    fireEvent.dragOver(dropzone);
    expect(dropzone.className).toContain('reef-upload__dropzone--dragover');
    fireEvent.dragLeave(dropzone);
    expect(dropzone.className).not.toContain('reef-upload__dropzone--dragover');
  });

  test('移除按钮抛剩余列表', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Upload defaultValue={[new File(['x'], 'a.txt'), new File(['yy'], 'b.txt')]} onChange={handleChange} />,
    );
    expect(container.querySelectorAll('.reef-upload__item')).toHaveLength(2);
    fireEvent.click(screen.getAllByRole('button', { name: '移除' })[0]);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].map((f: File) => f.name)).toEqual(['b.txt']);
  });

  test('maxCount 截断新文件', () => {
    const handleChange = vi.fn();
    const { container } = render(<Upload maxCount={2} onChange={handleChange} />);
    const dropzone = container.querySelector('.reef-upload__dropzone')!;
    dropFiles(dropzone, [new File(['x'], 'a.txt'), new File(['yy'], 'b.txt'), new File(['zzz'], 'c.txt')]);
    expect(handleChange.mock.calls[0][0]).toHaveLength(2);
    expect(handleChange.mock.calls[0][0].map((f: File) => f.name)).toEqual(['a.txt', 'b.txt']);
  });

  test('disabled 不响应 drop 与 input change', () => {
    const handleChange = vi.fn();
    const { container } = render(<Upload disabled onChange={handleChange} />);
    const dropzone = container.querySelector('.reef-upload__dropzone')!;
    expect(dropzone.className).toContain('reef-upload__dropzone--disabled');
    dropFiles(dropzone, [new File(['x'], 'a.txt')]);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    fireEvent.change(input, { target: { files: [new File(['x'], 'a.txt')] } });
    expect(handleChange).not.toHaveBeenCalled();
  });
});
