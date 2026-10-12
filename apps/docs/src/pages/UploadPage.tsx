import { useState } from 'react';
import { Upload } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `const [files, setFiles] = useState<File[]>([]);

<Upload value={files} onChange={setFiles} />`,
  en: `const [files, setFiles] = useState<File[]>([]);

<Upload value={files} onChange={setFiles} />`,
};

const limitCode = `<Upload multiple accept="image/*" maxCount={3} />`;

export function UploadPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [files, setFiles] = useState<File[]>([]);
  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Upload 上传' : 'Upload'}>
        {zh
          ? '点击或拖拽收集文件列表，由使用方自行上传。支持受控/非受控、多选、accept 过滤与数量上限。'
          : 'Collect files by clicking or dropping; uploading is left to the consumer. Supports controlled/uncontrolled usage, multiple selection, accept filtering, and a count limit.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Upload value={files} onChange={setFiles} />
      </Demo>

      <Demo title={zh ? '限制图片与数量' : 'Images only, max 3'} code={limitCode}>
        <Upload multiple accept="image/*" maxCount={3} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['value', zh ? '受控文件列表' : 'Controlled file list', 'File[]', '—'],
          ['defaultValue', zh ? '非受控初始文件列表' : 'Initial file list (uncontrolled)', 'File[]', '[]'],
          [
            'onChange',
            zh ? '文件列表变化时抛出完整 File[]（合并/去重/截断后）' : 'Fires with the full File[] after merge/dedupe/truncation',
            '(files: File[]) => void',
            '—',
          ],
          ['multiple', zh ? '允许一次选择多个文件' : 'Allow selecting multiple files', 'boolean', 'false'],
          ['accept', zh ? '原生 accept 过滤，如 "image/*"' : 'Native accept filter, e.g. "image/*"', 'string', '—'],
          ['disabled', zh ? '禁用，不响应点击与拖放' : 'Disable clicks and drops', 'boolean', 'false'],
          ['draggable', zh ? '是否显示拖拽区域' : 'Show the drop zone', 'boolean', 'true'],
          ['maxCount', zh ? '文件数量上限，超出后忽略新文件' : 'Max file count; extra files are ignored', 'number', '—'],
        ]}
      />
      <p>
        {zh
          ? '组件只负责收集文件列表（按 name+size+lastModified 去重），不执行真正的网络上传，拿到 File[] 后由业务代码自行上传。'
          : 'The component only collects the file list (deduped by name+size+lastModified) and never performs network requests; upload the File[] yourself.'}
      </p>
    </>
  );
}
