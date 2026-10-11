import { Timeline, type TimelineItem } from '@reef-ui/components';
import { changelog, type ChangelogEntry } from '../changelog.generated';
import { useLang } from '../i18n';

const typeColor: Record<string, { zh: string; en: string }> = {
  新增: { zh: '新增', en: 'Added' },
  修复: { zh: '修复', en: 'Fixed' },
  文档: { zh: '文档', en: 'Docs' },
  其他: { zh: '其他', en: 'Other' },
};

const typeHue: Record<string, string> = {
  新增: 'var(--reef-color-success)',
  修复: 'var(--reef-color-danger)',
  文档: 'var(--reef-color-brand)',
  其他: 'var(--reef-color-text-secondary)',
};

// 提交文本是 git 历史原文，不翻译；仅类型徽标与页面文案双语
function useTimelineItems(lang: 'zh' | 'en'): TimelineItem[] {
  return changelog.map((e: ChangelogEntry) => ({
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
              <span className="docs-changelog__type" style={{ color: typeHue[item.type] }}>
                {typeColor[item.type]?.[lang] ?? item.type}
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </section>
    ),
  }));
}

export function ChangelogPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const items = useTimelineItems(lang);
  return (
    <>
      <p className="docs__eyebrow">{zh ? '指南' : 'Guide'}</p>
      <h2>{zh ? '更新记录' : 'Changelog'}</h2>
      <p>
        {zh ? (
          <>
            遵循语义化版本：<code>0.x</code> 阶段 API 可能有小幅调整，<code>1.0</code> 后保持稳定。
            本页由构建时从 git 提交历史自动生成（版本边界取自发布标签与 version 提交），无需手动维护。
          </>
        ) : (
          <>
            Follows semver: APIs may change slightly during <code>0.x</code> and stay stable after <code>1.0</code>.
            This page is generated at build time from git commit history (version boundaries from release tags and
            version commits) — no manual upkeep.
          </>
        )}
      </p>
      <Timeline className="docs-changelog" items={items} />
    </>
  );
}
