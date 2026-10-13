import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { Upload } from './Upload';

afterEach(cleanup);
afterEach(() => vi.unstubAllGlobals());

/** jsdom 没有真实拖拽，手搓 drop 事件并挂上 dataTransfer */
function dropFiles(el: Element, files: File[]) {
  const event = new Event('drop', { bubbles: true });
  Object.defineProperty(event, 'dataTransfer', { value: { files } });
  fireEvent(el, event);
}

/** 可控的假 XHR：实例收进 FakeXHR.instances，测试里手动触发 onprogress/onload/onerror */
type ProgressLike = { lengthComputable: boolean; loaded: number; total: number };

class FakeXHR {
  static instances: FakeXHR[] = [];
  upload: { onprogress: ((e: ProgressLike) => void) | null } = { onprogress: null };
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  status = 200;
  responseText = '{"ok":true}';
  withCredentials = false;
  open = vi.fn();
  setRequestHeader = vi.fn();
  sent: FormData | null = null;
  send = vi.fn((data?: FormData) => {
    this.sent = data ?? null;
    FakeXHR.instances.push(this);
  });

  static stub() {
    FakeXHR.instances = [];
    vi.stubGlobal('XMLHttpRequest', FakeXHR);
  }
}

function pickFile(files: File[]) {
  const input = document.querySelector('input[type="file"]')!;
  fireEvent.change(input, { target: { files } });
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

describe('Upload HTTP 上传', () => {
  test('不传 action 时不发任何 XHR（仅本地列表）', () => {
    FakeXHR.stub();
    const { container } = render(<Upload />);
    pickFile([new File(['x'], 'a.txt')]);
    expect(container.querySelectorAll('.reef-upload__item')).toHaveLength(1);
    expect(FakeXHR.instances).toHaveLength(0);
  });

  test('action 触发 XHR：POST FormData、应用 name/headers/withCredentials', () => {
    FakeXHR.stub();
    const { container } = render(
      <Upload action="/upload" name="doc" headers={{ Authorization: 'Bearer x' }} withCredentials />,
    );
    const file = new File(['x'], 'a.txt');
    pickFile([file]);
    expect(FakeXHR.instances).toHaveLength(1);
    const xhr = FakeXHR.instances[0];
    expect(xhr.open).toHaveBeenCalledWith('POST', '/upload');
    expect(xhr.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer x');
    expect(xhr.withCredentials).toBe(true);
    expect(xhr.sent?.get('doc')).toBe(file);
    // 添加即进入 uploading 状态，显示进度条
    expect(container.querySelector('.reef-upload__progress')).toBeTruthy();
  });

  test('onprogress 更新进度条与 onProgress 回调', () => {
    FakeXHR.stub();
    const onProgress = vi.fn();
    const { container } = render(<Upload action="/upload" onProgress={onProgress} />);
    const file = new File(['x'], 'a.txt');
    pickFile([file]);
    act(() => FakeXHR.instances[0].upload.onprogress?.({ lengthComputable: true, loaded: 50, total: 100 }));
    const bar = container.querySelector('.reef-upload__bar')!;
    expect(bar.getAttribute('style')).toContain('width: 50%');
    expect(onProgress).toHaveBeenCalledWith(50, file);
  });

  test('2xx 响应转 success 并抛 onSuccess（JSON 响应体）', () => {
    FakeXHR.stub();
    const onSuccess = vi.fn();
    const { container } = render(<Upload action="/upload" onSuccess={onSuccess} />);
    const file = new File(['x'], 'a.txt');
    pickFile([file]);
    act(() => FakeXHR.instances[0].onload?.());
    expect(onSuccess).toHaveBeenCalledWith({ ok: true }, file);
    const item = container.querySelector('.reef-upload__item')!;
    expect(item.className).toContain('reef-upload__item--success');
    // 完成后进度条消失
    expect(container.querySelector('.reef-upload__progress')).toBeNull();
  });

  test('非 2xx 状态码转 error 并抛 onError', () => {
    FakeXHR.stub();
    const onError = vi.fn();
    const { container } = render(<Upload action="/upload" onError={onError} />);
    pickFile([new File(['x'], 'a.txt')]);
    const xhr = FakeXHR.instances[0];
    xhr.status = 500;
    act(() => xhr.onload?.());
    expect(onError).toHaveBeenCalledTimes(1);
    expect((onError.mock.calls[0][0] as Error).message).toBe('HTTP 500');
    expect(container.querySelector('.reef-upload__item')!.className).toContain('reef-upload__item--error');
  });

  test('网络错误转 error 并抛 onError', () => {
    FakeXHR.stub();
    const onError = vi.fn();
    const { container } = render(<Upload action="/upload" onError={onError} />);
    pickFile([new File(['x'], 'a.txt')]);
    act(() => FakeXHR.instances[0].onerror?.());
    expect(onError).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.reef-upload__item')!.className).toContain('reef-upload__item--error');
  });

  test('beforeUpload 同步返回 false：文件不入列表也不上传', () => {
    FakeXHR.stub();
    const beforeUpload = vi.fn(() => false);
    const { container } = render(<Upload action="/upload" beforeUpload={beforeUpload} />);
    pickFile([new File(['x'], 'a.txt')]);
    expect(beforeUpload).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.reef-upload__item')).toBeNull();
    expect(FakeXHR.instances).toHaveLength(0);
  });

  test('beforeUpload 异步返回 false 同样跳过', async () => {
    FakeXHR.stub();
    const { container } = render(<Upload action="/upload" beforeUpload={async () => false} />);
    pickFile([new File(['x'], 'a.txt')]);
    await act(async () => {});
    expect(container.querySelector('.reef-upload__item')).toBeNull();
    expect(FakeXHR.instances).toHaveLength(0);
  });
});
