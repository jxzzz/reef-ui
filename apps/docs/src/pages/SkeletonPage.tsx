import { useState } from 'react';
import { Button, Skeleton } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode = `<Skeleton rows={3} />`;

const avatarCode = `<Skeleton avatar rows={2} />`;

const loadCode: Record<Lang, string> = {
  zh: `<Skeleton loading={loading} rows={2}>
  <p>加载完成的内容</p>
</Skeleton>`,
  en: `<Skeleton loading={loading} rows={2}>
  <p>Content loaded</p>
</Skeleton>`,
};

export function SkeletonPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [loading, setLoading] = useState(true);
  return (
    <>
      <ComponentHeader group="反馈" title={zh ? 'Skeleton 骨架屏' : 'Skeleton'}>
        {zh
          ? '内容加载前的占位示意，loading 为 false 时渲染真实内容。'
          : 'Placeholder preview before content loads; renders real content when loading is false.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={basicCode}>
        <Skeleton rows={3} />
      </Demo>

      <Demo title={zh ? '带头像' : 'With avatar'} code={avatarCode}>
        <Skeleton avatar rows={2} />
      </Demo>

      <Demo title={zh ? '切换加载状态' : 'Toggle loading state'} code={zh ? loadCode.zh : loadCode.en}>
        <div>
          <p style={{ marginBottom: 12 }}>
            <Button onClick={() => setLoading(!loading)}>
              {loading ? (zh ? '停止加载' : 'Stop loading') : (zh ? '开始加载' : 'Start loading')}
            </Button>
          </p>
          <Skeleton loading={loading} rows={2}>
            <p>{zh ? '加载完成的内容' : 'Content loaded'}</p>
          </Skeleton>
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['loading', zh ? '是否加载中，false 时渲染 children' : 'Whether loading; renders children when false', 'boolean', 'true'],
          ['avatar', zh ? '是否显示头像占位' : 'Whether to show the avatar placeholder', 'boolean', 'false'],
          ['rows', zh ? '占位行数' : 'Number of placeholder rows', 'number', '3'],
          ['children', zh ? '加载完成的真实内容' : 'Real content shown once loading completes', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
