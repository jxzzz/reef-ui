import { Scroll } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const listCode = `<Scroll maxHeight={160}>
  {items.map((item) => (
    <div key={item}>{item}</div>
  ))}
</Scroll>`;

const wideCode = `<Scroll>
  <div style={{ width: 1200 }}>
    横向超宽内容，hover 后底部出现横向滚动条
  </div>
</Scroll>`;

const items = Array.from({ length: 20 }, (_, i) => `列表项 ${i + 1}`);

export function ScrollPage() {
  return (
    <>
      <h2>Scroll 滚动条</h2>
      <p>
        覆盖式滚动容器：内容溢出时滚动条 hover 淡入、移开淡出，滑块可拖拽。
        原生滚动条被隐藏，样式完全由主题控制。
      </p>

      <Demo title="限高列表" code={listCode}>
        <div style={{ width: 280 }}>
          <Scroll maxHeight={160}>
            {items.map((item) => (
              <div
                key={item}
                style={{ padding: '8px 12px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
              >
                {item}
              </div>
            ))}
          </Scroll>
        </div>
      </Demo>

      <Demo title="横向内容" code={wideCode}>
        <div style={{ width: 360 }}>
          <Scroll>
            <div style={{ width: 1200, padding: '8px 0' }}>
              横向超宽内容，hover 后底部出现横向滚动条
            </div>
          </Scroll>
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['maxHeight', '便捷限高（数字按 px），其余尺寸交给消费方样式', 'number | string', '—'],
          ['className', '追加到根元素', 'string', '—'],
          ['style', '追加到根元素', 'CSSProperties', '—'],
        ]}
      />
    </>
  );
}
