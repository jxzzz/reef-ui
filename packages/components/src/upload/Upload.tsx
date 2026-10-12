import { forwardRef, useState } from 'react';
import { cn } from '@reef-ui/utils';
import { Icon } from '../icon';
import { useLocale } from '../locale';
import type { UploadProps } from './types';
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

    const commit = (next: File[]) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    };

    const addFiles = (incoming: File[]) => {
      if (disabled || incoming.length === 0) return;
      const seen = new Set(files.map(fileKey));
      let next = [...files, ...incoming.filter((f) => !seen.has(fileKey(f)))];
      if (maxCount != null) next = next.slice(0, maxCount);
      commit(next);
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
            {files.map((f, i) => (
              <li key={`${fileKey(f)}:${i}`} className="reef-upload__item">
                <Icon name="file" size={14} />
                <span className="reef-upload__name">{f.name}</span>
                <span className="reef-upload__size">{formatSize(f.size)}</span>
                <button
                  type="button"
                  className="reef-upload__remove"
                  aria-label={t.Upload.remove}
                  onClick={() => commit(files.filter((_, j) => j !== i))}
                >
                  <Icon name="close" size={10} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  },
);

Upload.displayName = 'Upload';
