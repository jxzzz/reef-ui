import { Button, Icon } from '@reef-ui/components';

const features = [
  {
    icon: 'layers',
    term: '一致性',
    desc: '统一的视觉、交互与命名规范，所有样式出自同一套 Design Token。',
  },
  {
    icon: 'sliders',
    term: '可定制',
    desc: '颜色、间距、圆角全部是 CSS 变量，覆盖变量即可换成品牌主题。',
  },
  {
    icon: 'heart',
    term: '可访问性',
    desc: '键盘可达、焦点可见、对比度达标——WCAG AA 是底线，不是加分项。',
  },
  {
    icon: 'package',
    term: '工程化',
    desc: 'TypeScript 类型、ESM 按需引入、Tree Shaking，从开发到发布完整闭环。',
  },
] as const;

const compCards = [
  {
    href: '#button',
    name: 'Button 按钮',
    desc: '5 种类型 · 3 种尺寸',
    preview: (
      <span className="landing__comp-btns">
        <Button size="small" variant="primary">主要按钮</Button>
        <Button size="small" variant="secondary">次要按钮</Button>
        <Button size="small" variant="danger">危险按钮</Button>
      </span>
    ),
  },
  {
    href: '#icon',
    name: 'Icon 图标',
    desc: 'SVG 图标 · currentColor 着色',
    preview: (
      <span className="landing__comp-icons">
        {(['search', 'heart', 'sliders', 'moon', 'github'] as const).map((n) => (
          <Icon key={n} name={n} size={20} />
        ))}
      </span>
    ),
  },
  {
    href: '#typography',
    name: 'Typography 排版',
    desc: '标题层级 · 正文与辅助文本',
    preview: (
      <span className="landing__comp-typo">
        <strong>Aa</strong>
        <span>
          <b>标题文本</b>
          <i>正文与辅助说明文字</i>
        </span>
      </span>
    ),
  },
] as const;

interface HomePageProps {
  dark: boolean;
  onToggleDark: () => void;
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
        </section>

        <section className="landing__comps" aria-label="组件一览">
          {compCards.map((c) => (
            <a key={c.href} className="landing__comp" href={c.href}>
              <span className="landing__comp-header">
                <span className="landing__comp-name">{c.name}</span>
                <span className="landing__comp-desc">{c.desc}</span>
              </span>
              <span className="landing__comp-preview">{c.preview}</span>
            </a>
          ))}
          <div className="landing__comp landing__comp--soon">
            <span className="landing__comp-header">
              <span className="landing__comp-name">更多组件</span>
              <span className="landing__comp-desc">开发中</span>
            </span>
            <span className="landing__comp-preview">
              <Icon name="plus" size={20} />
              Tag · Avatar · Divider · Space…
            </span>
          </div>
        </section>

        <section className="landing__features" aria-label="特性">
          {features.map((f) => (
            <div key={f.term} className="landing__feature">
              <span className="landing__feature-icon">
                <Icon name={f.icon} size={20} />
              </span>
              <h3>{f.term}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="landing__footer">
        <div className="landing__footer-inner">
          MIT License · Reef UI · 用 TypeScript 与 CSS Variables 构建
        </div>
      </footer>
    </div>
  );
}
