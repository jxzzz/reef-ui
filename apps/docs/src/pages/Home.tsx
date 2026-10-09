import { Icon } from '@reef-ui/components';

const entries = [
  {
    href: '#guide',
    icon: 'package',
    term: '使用指南',
    desc: '安装、引入与主题定制，几分钟接入你的应用。',
  },
  {
    href: '#button',
    icon: 'layers',
    term: '组件',
    desc: '精心打磨的基础组件，类型、尺寸与状态完整。',
  },
  {
    href: '#icon',
    icon: 'heart',
    term: '资源',
    desc: '图标与排版规范，与组件共享同一套 Design Token。',
  },
] as const;

const values = [
  { icon: 'layers', text: '统一 Design Token' },
  { icon: 'moon', text: '暗色主题' },
  { icon: 'package', text: '零运行时依赖' },
  { icon: 'heart', text: 'WCAG AA' },
] as const;

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

export function HomePage({ dark, onToggleDark }: HomePageProps) {
  return (
    <div className="landing">
      <header className="landing__nav">
        <div className="landing__nav-inner">
          <a className="landing__brand" href="#home">
            Reef UI
            <span className="landing__version">v0.1</span>
          </a>
          <nav className="landing__links" aria-label="站点导航">
            <a href="#button">组件</a>
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
          <h1 className="landing__title">
            一致的组件，
            <br />
            可切换的主题。
          </h1>
          <p className="landing__sub">
            Reef UI 是为中后台场景打造的基础 React
            组件库：TypeScript 编写，样式基于 CSS
            Variables，开箱即用，覆盖变量即可换成你的品牌。
          </p>
          <div className="landing__cta">
            <a className="landing__cta-primary" href="#button">
              查看组件
            </a>
          </div>
          <SeaScene />
        </section>

        <section className="landing__entries" aria-label="探索">
          {entries.map((e) => (
            <a key={e.href} className="landing__entry" href={e.href}>
              <span className="landing__entry-icon">
                <Icon name={e.icon} size={18} />
              </span>
              <h3>{e.term}</h3>
              <p>{e.desc}</p>
              <span className="landing__entry-link">查看详情 →</span>
            </a>
          ))}
        </section>

        <section className="landing__values" aria-label="特性">
          {values.map((v) => (
            <span key={v.text} className="landing__value">
              <Icon name={v.icon} size={16} />
              {v.text}
            </span>
          ))}
        </section>
      </main>

      <footer className="landing__footer">
        <div className="landing__footer-inner">
          <span>MIT License · Reef UI · 用 TypeScript 与 CSS Variables 构建</span>
          <nav className="landing__footer-links" aria-label="页脚导航">
            <a href="#guide">使用指南</a>
            <a href="#button">组件</a>
            <a href="https://github.com/jxzzz/reef-ui" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
