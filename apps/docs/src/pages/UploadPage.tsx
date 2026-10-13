import { useState } from 'react';
import { Upload } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `const [files, setFiles] = useState<File[]>([]);

<Upload value={files} onChange={setFiles} />`,
  en: `const [files, setFiles] = useState<File[]>([]);

<Upload value={files} onChange={setFiles} />`,
};

const limitCode = `<Upload multiple accept="image/*" maxCount={3} />`;

const httpCode: Record<Lang, string> = {
  zh: `<Upload
  action="https://httpbin.org/post"
  name="file"
  headers={{ Authorization: 'Bearer token' }}
  beforeUpload={() => false} // 演示拦截：不真的发请求
  onProgress={(percent) => console.log(percent)}
  onSuccess={(response) => console.log(response)}
/>`,
  en: `<Upload
  action="https://httpbin.org/post"
  name="file"
  headers={{ Authorization: 'Bearer token' }}
  beforeUpload={() => false} // demo intercept: no real request
  onProgress={(percent) => console.log(percent)}
  onSuccess={(response) => console.log(response)}
/>`,
};

export function UploadPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [files, setFiles] = useState<File[]>([]);
  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Upload 上传' : 'Upload'}>
        {zh
          ? '点击或拖拽收集文件列表；不传 action 时由使用方自行上传，传 action 则组件用 XHR 上传并展示进度与状态。'
          : 'Collect files by clicking or dropping; without action the consumer uploads, with action the component uploads via XHR and shows progress and status.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Upload value={files} onChange={setFiles} />
      </Demo>

      <Demo title={zh ? '限制图片与数量' : 'Images only, max 3'} code={limitCode}>
        <Upload multiple accept="image/*" maxCount={3} />
      </Demo>

      <Demo
        title={zh ? 'HTTP 上传' : 'HTTP upload'}
        code={zh ? httpCode.zh : httpCode.en}
      >
        <Upload
          action="https://httpbin.org/post"
          name="file"
          headers={{ Authorization: 'Bearer token' }}
          beforeUpload={() => false}
        />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['value', zh ? '受控文件列表' : 'Controlled file list', 'File[]', '—'],
          ['defaultValue', zh ? '非受控初始文件列表' : 'Initial file list (uncontrolled)', 'File[]', '[]'],
          [
            'onChange',
            zh
              ? '文件列表变化时抛出完整 File[]（合并/去重/截断后）；HTTP 模式下状态变化也会再次触发'
              : 'Fires with the full File[] after merge/dedupe/truncation; fires again on status changes in HTTP mode',
            '(files: File[]) => void',
            '—',
          ],
          ['multiple', zh ? '允许一次选择多个文件' : 'Allow selecting multiple files', 'boolean', 'false'],
          ['accept', zh ? '原生 accept 过滤，如 "image/*"' : 'Native accept filter, e.g. "image/*"', 'string', '—'],
          ['disabled', zh ? '禁用，不响应点击与拖放' : 'Disable clicks and drops', 'boolean', 'false'],
          ['draggable', zh ? '是否显示拖拽区域' : 'Show the drop zone', 'boolean', 'true'],
          ['maxCount', zh ? '文件数量上限，超出后忽略新文件' : 'Max file count; extra files are ignored', 'number', '—'],
          [
            'action',
            zh ? '上传地址；不传时仅收集文件列表，不发任何网络请求' : 'Upload URL; when absent, no request is made',
            'string',
            '—',
          ],
          [
            'beforeUpload',
            zh
              ? '上传前校验；返回 false（或 resolve false）则该文件不入列表也不上传'
              : 'Return false (or resolve false) to exclude the file from the list and skip uploading',
            '(file: File) => boolean | Promise<boolean>',
            '—',
          ],
          [
            'onProgress',
            zh ? '上传进度回调，percent 为 0-100' : 'Progress callback, percent 0-100',
            '(percent: number, file: File) => void',
            '—',
          ],
          [
            'onSuccess',
            zh
              ? '上传成功回调，response 为响应体（可 JSON.parse 则为对象，否则为文本）'
              : 'Success callback; response is the parsed body (object if JSON, otherwise raw text)',
            '(response: unknown, file: File) => void',
            '—',
          ],
          [
            'onError',
            zh ? '上传失败回调（网络错误或非 2xx）' : 'Failure callback (network error or non-2xx)',
            '(error: unknown, file: File) => void',
            '—',
          ],
          ['headers', zh ? '附加请求头' : 'Extra request headers', 'Record<string, string>', '—'],
          ['name', zh ? '上传表单字段名' : 'Form field name', 'string', "'file'"],
          ['withCredentials', zh ? '跨域请求携带 cookie' : 'Send cookies cross-origin', 'boolean', 'false'],
        ]}
      />
      <p>
        {zh
          ? '不传 action 时组件只收集文件列表（按 name+size+lastModified 去重），拿到 File[] 后由业务代码自行上传。传 action 后组件用 XMLHttpRequest POST FormData 上传，上传中逐文件展示进度条，完成后展示成功/失败图标。'
          : 'Without action the component only collects the file list (deduped by name+size+lastModified) for you to upload. With action it POSTs FormData via XMLHttpRequest, shows a per-file progress bar while uploading and a success/error icon when done.'}
      </p>
      <TypeBlock
        code={`type UploadStatus = 'uploading' | 'success' | 'error';`}
      />
    </>
  );
}
