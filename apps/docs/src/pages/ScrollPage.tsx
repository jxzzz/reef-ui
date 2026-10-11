import { Scroll } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const listCode = `<Scroll maxHeight={160}>
  {items.map((item) => (
    <div key={item}>{item}</div>
  ))}
</Scroll>`;

const wideCode: Record<Lang, string> = {
  zh: `<Scroll>
  <div style={{ width: 1200 }}>
    横向超宽内容，hover 后底部出现横向滚动条
  </div>
</Scroll>`,
  en: `<Scroll>
  <div style={{ width: 1200 }}>
    Wide horizontal content; hover to reveal the horizontal scrollbar at the bottom
  </div>
</Scroll>`,
};

export function ScrollPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const items = Array.from(
    { length: 20 },
    (_, i) => (zh ? `列表项 ${i + 1}` : `List item ${i + 1}`),
  );
  return (
    <>
      <ComponentHeader group="通用" title={zh ? 'Scroll 滚动条' : 'Scroll'}>
        {zh ? (
          <>
            覆盖式滚动容器：内容溢出时滚动条 hover 淡入、移开淡出，滑块可拖拽。
            原生滚动条被隐藏，样式完全由主题控制。
          </>
        ) : (
          <>
            Overlay-style scroll container: when content overflows, the scrollbar fades in on
            hover and fades out on leave, and the thumb is draggable. Native scrollbars are
            hidden and styling is fully controlled by the theme.
          </>
        )}
      </ComponentHeader>

      <Demo title={zh ? '限高列表' : 'Bounded-height list'} code={listCode}>
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

      <Demo title={zh ? '横向内容' : 'Horizontal content'} code={zh ? wideCode.zh : wideCode.en}>
        <div style={{ width: 360 }}>
          <Scroll>
            <div style={{ width: 1200, padding: '8px 0' }}>
              {zh
                ? '横向超宽内容，hover 后底部出现横向滚动条'
                : 'Wide horizontal content; hover to reveal the horizontal scrollbar at the bottom'}
            </div>
          </Scroll>
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          [
            'maxHeight',
            zh ? '便捷限高（数字按 px），其余尺寸交给消费方样式' : 'Convenient max height (numbers treated as px); other sizing is up to consumer styles',
            'number | string',
            '—',
          ],
          ['className', zh ? '追加到根元素' : 'Appended to the root element', 'string', '—'],
          ['style', zh ? '追加到根元素' : 'Appended to the root element', 'CSSProperties', '—'],
        ]}
      />
    </>
  );
}
