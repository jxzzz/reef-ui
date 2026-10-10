import { useEffect, useState } from 'react';
import { Breadcrumb, Icon, Scroll } from '@reef-ui/components';
import { SearchInput } from './docs-ui';
import { AlertPage } from './pages/AlertPage';
import { AvatarPage } from './pages/AvatarPage';
import { BadgePage } from './pages/BadgePage';
import { BreadcrumbPage } from './pages/BreadcrumbPage';
import { ButtonPage } from './pages/ButtonPage';
import { CardPage } from './pages/CardPage';
import { DescriptionsPage } from './pages/DescriptionsPage';
import { DividerPage } from './pages/DividerPage';
import { DrawerPage } from './pages/DrawerPage';
import { CheckboxPage } from './pages/CheckboxPage';
import { EmptyPage } from './pages/EmptyPage';
import { FormPage } from './pages/FormPage';
import { GuidePage } from './pages/GuidePage';
import { HomePage } from './pages/Home';
import { IconPage } from './pages/IconPage';
import { InputPage } from './pages/InputPage';
import { MessagePage } from './pages/MessagePage';
import { ModalPage } from './pages/ModalPage';
import { PaginationPage } from './pages/PaginationPage';
import { SegmentedPage } from './pages/SegmentedPage';
import { SelectPage } from './pages/SelectPage';
import { SkeletonPage } from './pages/SkeletonPage';
import { SpinPage } from './pages/SpinPage';
import { ProgressPage } from './pages/ProgressPage';
import { ScrollPage } from './pages/ScrollPage';
import { ResultPage } from './pages/ResultPage';
import { RadioPage } from './pages/RadioPage';
import { StepsPage } from './pages/StepsPage';
import { SwitchPage } from './pages/SwitchPage';
import { TimelinePage } from './pages/TimelinePage';
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
  | 'breadcrumb'
  | 'button'
  | 'card'
  | 'descriptions'
  | 'divider'
  | 'drawer'
  | 'checkbox'
  | 'empty'
  | 'form'
  | 'input'
  | 'message'
  | 'modal'
  | 'pagination'
  | 'segmented'
  | 'progress'
  | 'scroll'
  | 'result'
  | 'radio'
  | 'select'
  | 'skeleton'
  | 'spin'
  | 'steps'
  | 'switch'
  | 'timeline'
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
    'breadcrumb',
    'button',
    'card',
    'descriptions',
    'divider',
    'drawer',
    'checkbox',
    'empty',
    'form',
    'input',
    'message',
    'modal',
    'pagination',
    'segmented',
    'progress',
    'result',
    'scroll',
    'radio',
    'select',
    'skeleton',
    'spin',
    'steps',
    'switch',
    'timeline',
    'tabs',
    'tag',
    'tooltip',
    'icon',
    'typography',
  ];
  return keys.includes(key) ? key : 'home';
}

// 企业级文档站结构：使用指南 / 组件（按用途分 5 组）/ 资源
const groups = [
  { label: '指南', keys: ['guide'] },
  { label: '资源', keys: ['icon', 'typography'] },
  { label: '通用', keys: ['button', 'divider', 'scroll'] },
  { label: '数据录入', keys: ['checkbox', 'form', 'input', 'radio', 'segmented', 'select', 'switch'] },
  { label: '数据展示', keys: ['avatar', 'badge', 'card', 'descriptions', 'empty', 'tag', 'timeline', 'tooltip'] },
  { label: '反馈', keys: ['alert', 'drawer', 'message', 'modal', 'progress', 'result', 'skeleton', 'spin'] },
  { label: '导航', keys: ['breadcrumb', 'pagination', 'steps', 'tabs'] },
] as const;

export default function App() {
  const [page, setPage] = useState<PageKey>(currentPage);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState('');

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
    { key: 'breadcrumb', title: 'Breadcrumb 面包屑', node: <BreadcrumbPage /> },
    { key: 'button', title: 'Button 按钮', node: <ButtonPage /> },
    { key: 'card', title: 'Card 卡片', node: <CardPage /> },
    { key: 'descriptions', title: 'Descriptions 描述列表', node: <DescriptionsPage /> },
    { key: 'divider', title: 'Divider 分割线', node: <DividerPage /> },
    { key: 'drawer', title: 'Drawer 抽屉', node: <DrawerPage /> },
    { key: 'empty', title: 'Empty 空状态', node: <EmptyPage /> },
    { key: 'input', title: 'Input 输入框', node: <InputPage /> },
    { key: 'message', title: 'Message 全局提示', node: <MessagePage /> },
    { key: 'modal', title: 'Modal 对话框', node: <ModalPage /> },
    { key: 'pagination', title: 'Pagination 分页', node: <PaginationPage /> },
    { key: 'segmented', title: 'Segmented 分段控制器', node: <SegmentedPage /> },
    { key: 'progress', title: 'Progress 进度条', node: <ProgressPage /> },
    { key: 'scroll', title: 'Scroll 滚动条', node: <ScrollPage /> },
    { key: 'result', title: 'Result 结果页', node: <ResultPage /> },
    { key: 'select', title: 'Select 选择器', node: <SelectPage /> },
    { key: 'skeleton', title: 'Skeleton 骨架屏', node: <SkeletonPage /> },
    { key: 'spin', title: 'Spin 加载中', node: <SpinPage /> },
    { key: 'steps', title: 'Steps 步骤条', node: <StepsPage /> },
    { key: 'switch', title: 'Switch 开关', node: <SwitchPage /> },
    { key: 'timeline', title: 'Timeline 时间轴', node: <TimelinePage /> },
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
  // 面包屑：当前页所属分组（首页/指南不显示）
  const activeGroup = groups.find((g) => (g.keys as readonly string[]).includes(page));
  // 搜索过滤：按标题（含中文名）匹配，空结果组隐藏
  const q = query.trim().toLowerCase();
  const visibleGroups = groups
    .map((g) => ({ ...g, keys: (g.keys as readonly string[]).filter((k) => !q || pages.find((p) => p.key === k)!.title.toLowerCase().includes(q)) }))
    .filter((g) => g.keys.length > 0);

  // 首页是独立落地页，自带顶部导航，不带文档壳（侧栏）
  if (page === 'home') return <HomePage dark={dark} onToggleDark={toggleDark} />;

  return (
    <div className="docs">
      <aside className="docs__sidebar">
        <a className="docs__logo" href="#home">Reef UI</a>
        <SearchInput value={query} onChange={setQuery} placeholder="搜索组件…" />
        {/* flex:1 + minHeight:0：flex 列里滚动的前提是允许收缩到内容以下 */}
        <Scroll style={{ flex: 1, minHeight: 0 }}>
          <nav>
            {visibleGroups.map((g) => (
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
            {visibleGroups.length === 0 && <p className="docs__empty">没有匹配的组件</p>}
          </nav>
        </Scroll>
      </aside>
      <div className="docs__main">
        <header className="docs__topbar">
          <h2 className="docs__topbar-title">
            {activeGroup && page !== 'guide' ? (
              <Breadcrumb
                items={[{ title: activeGroup.label, key: 'group' }, { title: active.title, key: 'page' }]}
              />
            ) : (
              active.title
            )}
          </h2>
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
