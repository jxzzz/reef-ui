import { useEffect, useState } from 'react';
import { Icon } from '@reef-ui/components';
import { ButtonPage } from './pages/ButtonPage';
import { GuidePage } from './pages/GuidePage';
import { HomePage } from './pages/Home';
import { IconPage } from './pages/IconPage';
import { TypographyPage } from './pages/TypographyPage';

type PageKey = 'home' | 'guide' | 'button' | 'icon' | 'typography';

function currentPage(): PageKey {
  const key = location.hash.slice(1) as PageKey;
  return ['home', 'guide', 'button', 'icon', 'typography'].includes(key) ? key : 'home';
}

// 企业级文档站结构：使用指南 / 组件 / 资源 分组
const groups = [
  { label: '使用指南', keys: ['guide'] },
  { label: '组件', keys: ['button'] },
  { label: '资源', keys: ['icon', 'typography'] },
] as const;

export default function App() {
  const [page, setPage] = useState<PageKey>(currentPage);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const onHash = () => setPage(currentPage());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : '';
  }, [dark]);

  const toggleDark = () => setDark(!dark);

  const pages = [
    { key: 'home', title: '首页', node: <HomePage dark={dark} onToggleDark={toggleDark} /> },
    { key: 'guide', title: '使用指南', node: <GuidePage /> },
    { key: 'button', title: 'Button 按钮', node: <ButtonPage /> },
    { key: 'icon', title: 'Icon 图标', node: <IconPage /> },
    { key: 'typography', title: 'Typography 排版', node: <TypographyPage /> },
  ] as const;

  const active = pages.find((p) => p.key === page)!;

  // 首页是独立落地页，自带顶部导航，不带文档壳（侧栏）
  if (page === 'home') return <HomePage dark={dark} onToggleDark={toggleDark} />;

  return (
    <div className="docs">
      <aside className="docs__sidebar">
        <a className="docs__logo" href="#home">Reef UI</a>
        <nav>
          {/* 落地页时整页被 HomePage 替换，文档区内首页永远不处于激活态 */}
          <a href="#home">首页</a>
          {groups.map((g) => (
            <div key={g.label} className="docs__group">
              <p className="docs__group-label">{g.label}</p>
              {g.keys.map((k) => {
                const p = pages.find((item) => item.key === k)!;
                return (
                  <a key={p.key} href={`#${p.key}`} className={p.key === page ? 'active' : ''}>
                    {p.title}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
      <div className="docs__main">
        <header className="docs__topbar">
          <h2 className="docs__topbar-title">{active.title}</h2>
          <div className="docs__topbar-actions">
            <a
              className="icon-btn"
              href="https://github.com/jxzzz/reef-ui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub 仓库"
            >
              <Icon name="github" size={18} />
            </a>
            <button
              type="button"
              className="icon-btn"
              onClick={toggleDark}
              aria-label={dark ? '切换到浅色模式' : '切换到暗色模式'}
            >
              <Icon name={dark ? 'sun' : 'moon'} size={18} />
            </button>
          </div>
        </header>
        <main className="docs__content">{active.node}</main>
      </div>
    </div>
  );
}
