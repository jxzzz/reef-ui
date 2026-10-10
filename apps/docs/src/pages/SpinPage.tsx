import { Spin } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Spin size="small" />
<Spin />
<Spin size="large" />`;

const wrapCode = `<Spin spinning={loading} tip="加载中…">
  <div className="panel">表格内容</div>
</Spin>`;

export function SpinPage() {
  return (
    <>
      <h2>Spin 加载中</h2>
      <p>可独立使用，也可包裹内容显示加载遮罩；遵循 prefers-reduced-motion。</p>

      <Demo title="三种尺寸" code={basicCode}>
        <Spin size="small" />
        <Spin />
        <Spin size="large" />
      </Demo>

      <Demo title="包裹内容" code={wrapCode}>
        <Spin spinning tip="加载中…">
          <div style={{ padding: '24px 48px', border: '1px dashed #d1d5db' }}>表格内容</div>
        </Spin>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['spinning', '是否加载中', 'boolean', 'true'],
          ['size', '尺寸', "'small' | 'medium' | 'large'", "'medium'"],
          ['tip', '加载文案（仅包裹内容时显示）', 'string', '—'],
          ['children', '被包裹的内容', 'ReactNode', '—'],
        ]}
      />
    </>
  );
}
