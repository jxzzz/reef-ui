import { forwardRef, useRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import { useLocale } from '../locale';
import type { UploadProps, UploadStatus } from './types';
import './upload.css';

/** 去重键：同名且同大小、同修改时间视为同一文件 */
function fileKey(f: File): string {
  return `${f.name}:${f.size}:${f.lastModified}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/** 响应体尽量 JSON.parse，失败则原样返回文本 */
function parseResponse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const Upload = forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      multiple,
      accept,
      disabled,
      draggable = true,
      maxCount,
      action,
      beforeUpload,
      onProgress,
      onSuccess,
      onError,
      headers,
      name,
      withCredentials,
      className,
      ...rest
    },
    ref,
  ) => {
    const t = useLocale();
    const [inner, setInner] = useState<File[]>(defaultValue ?? []);
    // 受控时以 value 为准，非受控回落到内部状态
    const files = value ?? inner;
    const [dragover, setDragover] = useState(false);
    // HTTP 模式下每个文件的上传状态，键为 fileKey
    const [meta, setMeta] = useState<Record<string, { status: UploadStatus; percent: number }>>({});
    // xhr 回调里要拿最新列表；渲染期间同步写 ref（latest-value 模式）
    const filesRef = useRef(files);
    filesRef.current = files;

    const commit = (next: File[]) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    };

    const addFiles = async (incoming: File[]) => {
      if (disabled || incoming.length === 0) return;
      const seen = new Set(files.map(fileKey));
      let accepted = incoming.filter((f) => !seen.has(fileKey(f)));
      if (action) {
        const checked: File[] = [];
        for (const f of accepted) {
          const r = beforeUpload?.(f);
          if (r === false) continue; // 返回 false：不入列表也不上传
          if (r instanceof Promise) {
            if ((await r) === false) continue;
          }
          checked.push(f);
        }
        accepted = checked;
      }
      let next = [...files, ...accepted];
      if (maxCount != null) next = next.slice(0, maxCount);
      commit(next);
      if (action) accepted.forEach((f) => uploadFile(f));
    };

    const uploadFile = (file: File) => {
      if (!action) return;
      const key = fileKey(file);
      const setStatus = (status: UploadStatus, percent = 0) => {
        setMeta((m) => ({ ...m, [key]: { status, percent } }));
        // 状态变化也走一次 onChange（文件仍在列表中才通知）
        if (status !== 'uploading' && filesRef.current.includes(file)) onChange?.(filesRef.current);
      };

      const form = new FormData();
      form.append(name ?? 'file', file);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', action);
      for (const [k, v] of Object.entries(headers ?? {})) xhr.setRequestHeader(k, v);
      xhr.withCredentials = withCredentials ?? false;
      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;
        const percent = Math.round((e.loaded / e.total) * 100);
        setStatus('uploading', percent);
        onProgress?.(percent, file);
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setStatus('success', 100);
          onSuccess?.(parseResponse(xhr.responseText), file);
        } else {
          setStatus('error');
          onError?.(new Error(`HTTP ${xhr.status}`), file);
        }
      };
      xhr.onerror = () => {
        setStatus('error');
        onError?.(xhr, file);
      };
      setStatus('uploading');
      xhr.send(form);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      addFiles(Array.from(e.target.files ?? []));
      // 清空 value，保证再次选择同一文件也能触发 change
      e.target.value = '';
    };

    return (
      <div ref={ref} className={cn('reef-upload', className)} {...rest}>
        {draggable && (
          // 隐藏 input 以 opacity:0 覆盖整个拖拽区：点击即选中、键盘可聚焦，
          // 拖放落在 input 上也会冒泡到这里的 onDrop 并被 preventDefault
          <div
            className={cn('reef-upload__dropzone', {
              'reef-upload__dropzone--dragover': dragover,
              'reef-upload__dropzone--disabled': disabled,
            })}
            onDragOver={(e) => {
              if (disabled) return;
              e.preventDefault();
              setDragover(true);
            }}
            onDragLeave={() => setDragover(false)}
            onDrop={(e) => {
              if (disabled) return;
              e.preventDefault();
              setDragover(false);
              addFiles(Array.from(e.dataTransfer.files));
            }}
          >
            <Icon name="upload" size={20} />
            <span className="reef-upload__hint">{t.Upload.hint}</span>
            <input
              type="file"
              className="reef-upload__input"
              multiple={multiple}
              accept={accept}
              disabled={disabled}
              onChange={handleChange}
            />
          </div>
        )}
        {files.length > 0 && (
          <ul className="reef-upload__list">
            {files.map((f, i) => {
              const m = meta[fileKey(f)];
              return (
                <li
                  key={`${fileKey(f)}:${i}`}
                  className={cn('reef-upload__item', {
                    'reef-upload__item--success': m?.status === 'success',
                    'reef-upload__item--error': m?.status === 'error',
                  })}
                >
                  <Icon name="file" size={14} />
                  <span className="reef-upload__name">{f.name}</span>
                  <span className="reef-upload__size">{formatSize(f.size)}</span>
                  {m?.status === 'uploading' && (
                    <span
                      className="reef-upload__progress"
                      role="progressbar"
                      aria-valuenow={m.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span className="reef-upload__bar" style={{ width: `${m.percent}%` }} />
                    </span>
                  )}
                  {m?.status === 'success' && <Icon name="check" size={12} />}
                  {m?.status === 'error' && <Icon name="x-circle" size={12} />}
                  <button
                    type="button"
                    className="reef-upload__remove"
                    aria-label={t.Upload.remove}
                    onClick={() => commit(files.filter((_, j) => j !== i))}
                  >
                    <Icon name="close" size={10} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);

Upload.displayName = 'Upload';
