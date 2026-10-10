import { useEffect, useState } from 'react';
import { Icon } from '@reef-ui/components';
import { AlertPage } from './pages/AlertPage';
import { AvatarPage } from './pages/AvatarPage';
import { BadgePage } from './pages/BadgePage';
import { ButtonPage } from './pages/ButtonPage';
import { CardPage } from './pages/CardPage';
import { CheckboxPage } from './pages/CheckboxPage';
import { FormPage } from './pages/FormPage';
import { GuidePage } from './pages/GuidePage';
import { HomePage } from './pages/Home';
import { IconPage } from './pages/IconPage';
import { InputPage } from './pages/InputPage';
import { ModalPage } from './pages/ModalPage';
import { PaginationPage } from './pages/PaginationPage';
import { SelectPage } from './pages/SelectPage';
import { RadioPage } from './pages/RadioPage';
import { SwitchPage } from './pages/SwitchPage';
import { TabsPage } from './pages/TabsPage';
import { TagPage } from './pages/TagPage';
import { TooltipPage } from './pages/TooltipPage';
import { TypographyPage } from './pages/TypographyPage';

type PageKey =
  | 'home'
  | 'guide'
  | 'alert'
  | 'avatar'
  | 'badge'
  | 'button'
  | 'card'
  | 'checkbox'
  | 'form'
  | 'input'
  | 'modal'
  | 'pagination'
  | 'radio'
  | 'select'
  | 'switch'
  | 'tabs'
  | 'tag'
  | 'tooltip'
  | 'icon'
  | 'typography';

function currentPage(): PageKey {
  const key = location.hash.slice(1) as PageKey;
  const keys: PageKey[] = [
    'home',
    'guide',
    'alert',
    'avatar',
    'badge',
    'button',
    'card',
    'checkbox',
    'form',
    'input',
    'modal',
    'pagination',
    'radio',
    'select',
    'switch',
    'tabs',
    'tag',
    'tooltip',
    'icon',
    'typography',
  ];
  return keys.includes(key) ? key : 'home';
}

// 企业级文档站结构：使用指南 / 组件 / 资源 分组
const groups = [
  { label: '指南', keys: ['guide'] },
  { label: '组件', keys: ['alert', 'avatar', 'badge', 'button', 'card', 'input', 'modal', 'pagination', 'select', 'switch', 'tabs', 'checkbox', 'form', 'radio', 'tag', 'tooltip'] },
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
    { key: 'alert', title: 'Alert 警告提示', node: <AlertPage /> },
    { key: 'avatar', title: 'Avatar 头像', node: <AvatarPage /> },
    { key: 'badge', title: 'Badge 徽标数', node: <BadgePage /> },
    { key: 'button', title: 'Button 按钮', node: <ButtonPage /> },
    { key: 'card', title: 'Card 卡片', node: <CardPage /> },
    { key: 'input', title: 'Input 输入框', node: <InputPage /> },
    { key: 'modal', title: 'Modal 对话框', node: <ModalPage /> },
    { key: 'pagination', title: 'Pagination 分页', node: <PaginationPage /> },
    { key: 'select', title: 'Select 选择器', node: <SelectPage /> },
    { key: 'switch', title: 'Switch 开关', node: <SwitchPage /> },
    { key: 'tabs', title: 'Tabs 标签页', node: <TabsPage /> },
    { key: 'checkbox', title: 'Checkbox 复选框', node: <CheckboxPage /> },
    { key: 'form', title: 'Form 表单', node: <FormPage /> },
    { key: 'radio', title: 'Radio 单选框', node: <RadioPage /> },
    { key: 'tag', title: 'Tag 标签', node: <TagPage /> },
    { key: 'tooltip', title: 'Tooltip 文字提示', node: <TooltipPage /> },
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
