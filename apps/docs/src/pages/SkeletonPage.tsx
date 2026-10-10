import { useState } from 'react';
import { Button, Skeleton } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Skeleton rows={3} />`;

const avatarCode = `<Skeleton avatar rows={2} />`;

const loadCode = `<Skeleton loading={loading} rows={2}>
  <p>加载完成的内容</p>
</Skeleton>`;

export function SkeletonPage() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <h2>Skeleton 骨架屏</h2>
      <p>内容加载前的占位示意，loading 为 false 时渲染真实内容。</p>

      <Demo title="基础用法" code={basicCode}>
        <Skeleton rows={3} />
      </Demo>

      <Demo title="带头像" code={avatarCode}>
        <Skeleton avatar rows={2} />
      </Demo>

      <Demo title="切换加载状态" code={loadCode}>
        <div>
          <p style={{ marginBottom: 12 }}>
            <Button onClick={() => setLoading(!loading)}>{loading ? '停止加载' : '开始加载'}</Button>
          </p>
          <Skeleton loading={loading} rows={2}>
            <p>加载完成的内容</p>
          </Skeleton>
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['loading', '是否加载中，false 时渲染 children', 'boolean', 'true'],
          ['avatar', '是否显示头像占位', 'boolean', 'false'],
          ['rows', '占位行数', 'number', '3'],
          ['children', '加载完成的真实内容', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
