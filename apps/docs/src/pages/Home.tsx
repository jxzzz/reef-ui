import { useEffect, useState } from 'react';
import * as Reef from '@reef-ui/components';
import { DatePicker, Icon, Progress, Segmented, Switch, Tag } from '@reef-ui/components';
// 版本号直接取组件包 package.json，发版随 changeset 自动更新
import componentsPkg from '../../../../packages/components/package.json';
import { useChrome, useLang } from '../i18n';

// 组件数量从库导出动态统计，新增组件自动跟上
const componentCount = Object.keys(Reef).filter((k) => /^[A-Z]/.test(k)).length;

/** 换肤预设：取明暗主题下都可读的中调色；品牌色 + 悬停色成对 */
const brandPresets = [
  { id: 'tide', brand: '#2563eb', hover: '#1d4ed8' },
  { id: 'coral', brand: '#e5624b', hover: '#c74a35' },
  { id: 'anemone', brand: '#8b5cf6', hover: '#7c3aed' },
  { id: 'kelp', brand: '#059669', hover: '#047857' },
  { id: 'amber', brand: '#d97706', hover: '#b45309' },
] as const;

/** 首页文案双语（组件舞台里的示例标签跟随语言） */
const strings = {
  zh: {
    entries: [
      { href: '#guide', icon: 'package', term: '使用指南', desc: '安装、引入与主题定制，几分钟接入你的应用。' },
      { href: '#button', icon: 'layers', term: '组件', desc: '精心打磨的基础组件，类型、尺寸与状态完整。' },
      { href: '#icon', icon: 'heart', term: '资源', desc: '图标与排版规范，与组件共享同一套 Design Token。' },
    ],
    navComponents: '组件',
    heroTitle: (<>一致的组件，<br />可切换的主题。</>),
    heroSub: 'Reef UI 是为中后台场景打造的基础 React 组件库：TypeScript 编写，样式基于 CSS Variables，开箱即用，覆盖变量即可换成你的品牌。',
    cta: '查看组件',
    ghostCta: 'Playground 实时演练',
    entryLink: '查看详情 →',
    installCmd: 'npm install @reef-ui/components',
    stats: [` ${componentCount} 个组件`, '零运行时依赖', '100% TypeScript', `v${componentsPkg.version}`],
    themeTitle: '一套变量，整个主题。',
    themeSub: '组件里没有写死的颜色，全部来自 CSS Variables。点一个色板，整个文档站实时换肤——离开首页自动还原。',
    presetNames: { tide: '潮汐', coral: '珊瑚', anemone: '海葵', kelp: '海草', amber: '琥珀' } as Record<string, string>,
    themeNote: '离开首页自动还原',
    footer: 'MIT License · Reef UI · 用 TypeScript 与 CSS Variables 构建',
    stageNotify: '消息通知',
    stageStable: '稳定',
    stageStorage: '存储用量 72%',
    segDay: '日', segWeek: '周', segMonth: '月',
  },
  en: {
    entries: [
      { href: '#guide', icon: 'package', term: 'Guide', desc: 'Install, import and theme — integrate in minutes.' },
      { href: '#button', icon: 'layers', term: 'Components', desc: 'Carefully crafted foundational components with full types, sizes and states.' },
      { href: '#icon', icon: 'heart', term: 'Resources', desc: 'Icons and typography guidelines sharing the same Design Tokens.' },
    ],
    navComponents: 'Components',
    heroTitle: (<>Consistent components,<br />switchable themes.</>),
    heroSub: 'Reef UI is a foundational React component library for admin apps: written in TypeScript, styled with CSS Variables, ready out of the box — override the tokens to make it yours.',
    cta: 'Browse components',
    ghostCta: 'Open Playground',
    entryLink: 'Explore →',
    installCmd: 'npm install @reef-ui/components',
    stats: [`${componentCount} components`, 'Zero runtime deps', '100% TypeScript', `v${componentsPkg.version}`],
    themeTitle: 'One set of variables, the whole theme.',
    themeSub: 'No colors are hard-coded in components — everything comes from CSS Variables. Pick a swatch and the entire site re-skins live; leaving this page restores it.',
    presetNames: { tide: 'Tide', coral: 'Coral', anemone: 'Anemone', kelp: 'Kelp', amber: 'Amber' } as Record<string, string>,
    themeNote: 'Restored automatically when you leave',
    footer: 'MIT License · Reef UI · Built with TypeScript and CSS Variables',
    stageNotify: 'Notifications',
    stageStable: 'Stable',
    stageStorage: 'Storage 72%',
    segDay: 'Day', segWeek: 'Week', segMonth: 'Month',
  },
} as const;

interface HomePageProps {
  dark: boolean;
  onToggleDark: () => void;
}

// 海底氛围：光柱 + 珊瑚海草 + 气泡 + 对游的鱼，纯装饰（aria-hidden）
function SeaScene() {
  const coralPath =
    'M30 80V28M30 46c-10 0-16-7-16-22M30 52c10 0 16-7 16-22';
  return (
    <div className="landing__sea" aria-hidden="true">
      <i className="landing__ray landing__ray--a" />
      <i className="landing__ray landing__ray--b" />
      <svg className="landing__coral landing__coral--a" viewBox="0 0 60 80">
        <path d={coralPath} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
      <svg className="landing__coral landing__coral--b" viewBox="0 0 60 80">
        <path d={coralPath} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
      <svg className="landing__coral landing__coral--c" viewBox="0 0 60 80">
        <path d={coralPath} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
      <svg className="landing__coral landing__coral--d" viewBox="0 0 60 80">
        <path d={coralPath} fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      </svg>
      <svg className="landing__weed landing__weed--a" viewBox="0 0 24 90">
        <path d="M12 88C12 60 4 52 10 26 13 13 8 8 12 2" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <svg className="landing__weed landing__weed--b" viewBox="0 0 24 90">
        <path d="M12 88C12 64 20 56 14 30 11 17 16 10 12 4" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <svg className="landing__weed landing__weed--c" viewBox="0 0 24 90">
        <path d="M12 88C12 60 4 52 10 26 13 13 8 8 12 2" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <svg className="landing__fish landing__fish--a" viewBox="0 0 36 20">
        <path d="M34 10C29 3.5 20 2.5 13 6.5L4 2l3.5 8L4 18l9-4.5C20 17.5 29 16.5 34 10Z" fill="currentColor" />
        <circle cx="28" cy="9" r="1.4" fill="var(--reef-color-surface)" />
      </svg>
      <svg className="landing__fish landing__fish--b" viewBox="0 0 36 20">
        <path d="M34 10C29 3.5 20 2.5 13 6.5L4 2l3.5 8L4 18l9-4.5C20 17.5 29 16.5 34 10Z" fill="currentColor" />
        <circle cx="28" cy="9" r="1.4" fill="var(--reef-color-surface)" />
      </svg>
      <svg className="landing__wave" viewBox="0 0 1200 40" preserveAspectRatio="none">
        <path d="M0 20C100 40 200 0 300 16C400 32 500 8 600 18C700 28 800 6 900 16C1000 26 1100 10 1200 20V40H0Z" fill="currentColor" />
      </svg>
      {Array.from({ length: 6 }, (_, i) => (
        <i key={i} className={`landing__bubble landing__bubble--${i + 1}`} />
      ))}
    </div>
  );
}

/** hero 右侧的活体组件舞台：全部是真实可交互的库内组件（aria-hidden 由组件自身语义保证，不加） */
function ComponentStage() {
  const [notify, setNotify] = useState(true);
  const { lang } = useLang();
  const t = strings[lang];
  return (
    <div className="landing__stage">
      <div className="landing__stage-card landing__stage-card--a">
        <Segmented
          options={[
            { label: t.segDay, value: 'day' },
            { label: t.segWeek, value: 'week' },
            { label: t.segMonth, value: 'month' },
          ]}
          defaultValue="week"
        />
      </div>
      <div className="landing__stage-card landing__stage-card--b">
        <label className="landing__stage-row">
          <Switch checked={notify} onChange={(checked) => setNotify(checked)} />
          {t.stageNotify}
        </label>
      </div>
      <div className="landing__stage-card landing__stage-card--c">
        <Tag color="brand">v{componentsPkg.version}</Tag>
        <Tag color="success">{t.stageStable}</Tag>
        <Tag color="warning">Beta</Tag>
      </div>
      <div className="landing__stage-card landing__stage-card--d">
        <Progress percent={72} />
        <span className="landing__stage-note">{t.stageStorage}</span>
      </div>
      <div className="landing__stage-card landing__stage-card--e">
        <DatePicker defaultValue="2026-10-11" />
      </div>
    </div>
  );
}

/** 换肤演示：选中预设时把品牌色写进 :root 内联变量（全站实时生效），卸载时还原 */
function ThemeDemo() {
  const { lang } = useLang();
  const chrome = useChrome();
  const t = strings[lang];
  const [active, setActive] = useState<string>('tide');
  const preset = brandPresets.find((p) => p.id === active)!;

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--reef-color-brand', preset.brand);
    root.setProperty('--reef-color-brand-hover', preset.hover);
    return () => {
      root.removeProperty('--reef-color-brand');
      root.removeProperty('--reef-color-brand-hover');
    };
  }, [preset]);

  const code = `:root {\n  --reef-color-brand: ${preset.brand};\n  --reef-color-brand-hover: ${preset.hover};\n}`;

  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="landing__theme" aria-label={t.themeTitle}>
      <h2>{t.themeTitle}</h2>
      <p className="landing__theme-sub">{t.themeSub}</p>
      <div className="landing__theme-inner">
        <div>
          <div className="landing__swatches" role="group">
            {brandPresets.map((p) => (
              <button
                key={p.id}
                type="button"
                className="landing__swatch"
                aria-pressed={p.id === active}
                onClick={() => setActive(p.id)}
              >
                <i style={{ background: p.brand }} />
                {t.presetNames[p.id]}
              </button>
            ))}
          </div>
          <p className="landing__theme-note">{t.themeNote}</p>
        </div>
        <div className="landing__theme-code">
          <pre>
            <code>{code}</code>
          </pre>
          <button type="button" className="landing__theme-copy" onClick={copy}>
            {copied ? chrome.copied : chrome.copy}
          </button>
        </div>
      </div>
    </section>
  );
}

export function HomePage({ dark, onToggleDark }: HomePageProps) {
  const { lang } = useLang();
  const chrome = useChrome();
  const t = strings[lang];
  const [copied, setCopied] = useState(false);
  return (
    <div className="landing">
      <header className="landing__nav">
        <div className="landing__nav-inner">
          <a className="landing__brand" href="#home">
            Reef UI
            <span className="landing__version">v{componentsPkg.version}</span>
          </a>
          <nav className="landing__links" aria-label="站点导航">
            <a href="#button">{t.navComponents}</a>
            <a
              href="https://github.com/jxzzz/reef-ui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub 仓库"
            >
              <Icon name="github" size={18} />
            </a>
          </nav>
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleDark}
            aria-label={dark ? '切换到浅色模式' : '切换到暗色模式'}
          >
            <Icon name={dark ? 'sun' : 'moon'} size={18} />
          </button>
        </div>
      </header>

      <main className="landing__main">
        <section className="landing__hero">
          <div className="landing__hero-inner">
            <div className="landing__hero-copy">
              <h1 className="landing__title">{t.heroTitle}</h1>
              <p className="landing__sub">{t.heroSub}</p>
              <div className="landing__cta">
                <a className="landing__cta-primary" href="#button">
                  {t.cta}
                </a>
                <a className="landing__cta-ghost" href="#playground">
                  {t.ghostCta}
                </a>
              </div>
            </div>
            <ComponentStage />
          </div>
          <SeaScene />
        </section>

        <section className="landing__install" aria-label={t.installCmd}>
          <code className="landing__install-cmd">
            {t.installCmd}
            <button
              type="button"
              className="icon-btn"
              aria-label={chrome.copy}
              onClick={async () => {
                await navigator.clipboard.writeText(t.installCmd);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              <Icon name={copied ? 'check' : 'copy'} size={14} />
            </button>
          </code>
          <div className="landing__stats">
            {t.stats.map((s) => (
              <span key={s} className="landing__stat">
                {s}
              </span>
            ))}
          </div>
        </section>

        <ThemeDemo />

        <section className="landing__entries" aria-label="探索">
          {t.entries.map((e) => (
            <a key={e.href} className="landing__entry" href={e.href}>
              <span className="landing__entry-icon">
                <Icon name={e.icon} size={18} />
              </span>
              <h3>{e.term}</h3>
              <p>{e.desc}</p>
              <span className="landing__entry-link">{t.entryLink}</span>
            </a>
          ))}
        </section>
      </main>

      <footer className="landing__footer">
        <div className="landing__footer-inner">
          <span>{t.footer}</span>
          <nav className="landing__footer-links" aria-label="页脚导航">
            <a href="#guide">使用指南</a>
            <a href="#button">{t.navComponents}</a>
            <a href="https://github.com/jxzzz/reef-ui" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
