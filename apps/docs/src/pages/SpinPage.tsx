import { useState } from 'react';
import { Button, Spin } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode = `<Spin size="small" />
<Spin />
<Spin size="large" />`;

const wrapCode: Record<Lang, string> = {
  zh: `const [loading, setLoading] = useState(true);

<p style={{ marginBottom: 12 }}>
  <Button onClick={() => setLoading(!loading)}>
    {loading ? '停止加载' : '开始加载'}
  </Button>
</p>
<Spin spinning={loading} tip="加载中…">
  <div
    style={{
      padding: '24px 48px',
      border: '1px dashed color-mix(in srgb, var(--reef-color-text-primary) 15%, transparent)',
    }}
  >
    表格内容
  </div>
</Spin>`,
  en: `const [loading, setLoading] = useState(true);

<p style={{ marginBottom: 12 }}>
  <Button onClick={() => setLoading(!loading)}>
    {loading ? 'Stop loading' : 'Start loading'}
  </Button>
</p>
<Spin spinning={loading} tip="Loading…">
  <div
    style={{
      padding: '24px 48px',
      border: '1px dashed color-mix(in srgb, var(--reef-color-text-primary) 15%, transparent)',
    }}
  >
    Table content
  </div>
</Spin>`,
};

export function SpinPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [loading, setLoading] = useState(true);
  return (
    <>
      <ComponentHeader group="反馈" title={zh ? 'Spin 加载中' : 'Spin'}>
        {zh
          ? '可独立使用，也可包裹内容显示加载遮罩；遵循 prefers-reduced-motion。'
          : 'Can be used standalone or wrap content to show a loading overlay; respects prefers-reduced-motion.'}
      </ComponentHeader>

      <Demo title={zh ? '三种尺寸' : 'Three sizes'} code={basicCode}>
        <Spin size="small" />
        <Spin />
        <Spin size="large" />
      </Demo>

      <Demo title={zh ? '包裹内容' : 'Wrapping content'} code={zh ? wrapCode.zh : wrapCode.en}>
        <p style={{ marginBottom: 12 }}>
          <Button onClick={() => setLoading(!loading)}>
            {loading ? (zh ? '停止加载' : 'Stop loading') : (zh ? '开始加载' : 'Start loading')}
          </Button>
        </p>
        <Spin spinning={loading} tip={zh ? '加载中…' : 'Loading…'}>
          <div
            style={{
              padding: '24px 48px',
              border: '1px dashed color-mix(in srgb, var(--reef-color-text-primary) 15%, transparent)',
            }}
          >
            {zh ? '表格内容' : 'Table content'}
          </div>
        </Spin>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['spinning', zh ? '是否加载中' : 'Whether spinning', 'boolean', 'true'],
          ['size', zh ? '尺寸' : 'Size', "'small' | 'medium' | 'large'", "'medium'"],
          ['tip', zh ? '加载文案（仅包裹内容时显示）' : 'Loading text (only shown when wrapping content)', 'string', '—'],
          ['children', zh ? '被包裹的内容' : 'Wrapped content', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
