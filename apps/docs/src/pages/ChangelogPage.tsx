import { Timeline, type TimelineItem } from '@reef-ui/components';
import { changelog, type ChangelogEntry } from '../changelog.generated';

const typeColor: Record<string, string> = {
  新增: 'var(--reef-color-success)',
  修复: 'var(--reef-color-danger)',
  文档: 'var(--reef-color-brand)',
  其他: 'var(--reef-color-text-secondary)',
};

const timelineItems: TimelineItem[] = changelog.map((e: ChangelogEntry) => ({
  key: e.version,
  content: (
    <section className="docs-changelog__card">
      <header className="docs-changelog__head">
        <strong className="docs-changelog__version">{e.version}</strong>
        <time className="docs-changelog__date">{e.date}</time>
      </header>
      <ul className="docs-changelog__list">
        {e.items.map((item) => (
          <li key={item.text}>
            <span className="docs-changelog__type" style={{ color: typeColor[item.type] }}>
              {item.type}
            </span>
            {item.text}
          </li>
        ))}
      </ul>
    </section>
  ),
}));

export function ChangelogPage() {
  return (
    <>
      <p className="docs__eyebrow">指南</p>
      <h2>更新记录</h2>
      <p>
        遵循语义化版本：<code>0.x</code> 阶段 API 可能有小幅调整，<code>1.0</code> 后保持稳定。
        本页由构建时从 git 提交历史自动生成（版本边界取自发布标签与 version 提交），无需手动维护。
      </p>
      <Timeline className="docs-changelog" items={timelineItems} />
    </>
  );
}
