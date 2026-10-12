import { useEffect, useState } from 'react';
import { Breadcrumb, Icon, Menu, Scroll, type MenuItem } from '@reef-ui/components';
// 版本号直接取组件包 package.json，发版随 changeset 自动更新
import componentsPkg from '../../../packages/components/package.json';
import { groupLabel, LangProvider, useChrome, useLang } from './i18n';
import { SearchInput, Toc } from './docs-ui';
import { AlertPage } from './pages/AlertPage';
import { AvatarPage } from './pages/AvatarPage';
import { BadgePage } from './pages/BadgePage';
import { BreadcrumbPage } from './pages/BreadcrumbPage';
import { DatePickerPage } from './pages/DatePickerPage';
import { ButtonPage } from './pages/ButtonPage';
import { CascaderPage } from './pages/CascaderPage';
import { CardPage } from './pages/CardPage';
import { DescriptionsPage } from './pages/DescriptionsPage';
import { DividerPage } from './pages/DividerPage';
import { DrawerPage } from './pages/DrawerPage';
import { DropdownPage } from './pages/DropdownPage';
import { CheckboxPage } from './pages/CheckboxPage';
import { EmptyPage } from './pages/EmptyPage';
import { FormPage } from './pages/FormPage';
import { GuidePage } from './pages/GuidePage';
import { ChangelogPage } from './pages/ChangelogPage';
import { HomePage } from './pages/Home';
import { IconPage } from './pages/IconPage';
import { InputPage } from './pages/InputPage';
import { InputNumberPage } from './pages/InputNumberPage';
import { MessagePage } from './pages/MessagePage';
import { MenuPage } from './pages/MenuPage';
import { ModalPage } from './pages/ModalPage';
import { PaginationPage } from './pages/PaginationPage';
import { SegmentedPage } from './pages/SegmentedPage';
import { SelectPage } from './pages/SelectPage';
import { SkeletonPage } from './pages/SkeletonPage';
import { SpinPage } from './pages/SpinPage';
import { ProgressPage } from './pages/ProgressPage';
import { PopconfirmPage } from './pages/PopconfirmPage';
import { RatePage } from './pages/RatePage';
import { SliderPage } from './pages/SliderPage';
import { TimePickerPage } from './pages/TimePickerPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { ScrollPage } from './pages/ScrollPage';
import { ResultPage } from './pages/ResultPage';
import { RadioPage } from './pages/RadioPage';
import { StepsPage } from './pages/StepsPage';
import { TablePage } from './pages/TablePage';
import { SwitchPage } from './pages/SwitchPage';
import { TimelinePage } from './pages/TimelinePage';
import { TabsPage } from './pages/TabsPage';
import { TagPage } from './pages/TagPage';
import { TooltipPage } from './pages/TooltipPage';
import { TreePage } from './pages/TreePage';
import { TypographyPage } from './pages/TypographyPage';
import { UploadPage } from './pages/UploadPage';

// 页面注册单一来源：hash key、侧栏分组、页面渲染都从这里派生。
// 新增页面只改这一处（import + 一行注册）。
// 侧栏分组顺序 = group 字段的首次出现顺序；group: null 的页面不进侧栏。
const pages = [
  // 首页是独立落地页（自带顶部导航，提前 return），node 永远不会渲染
  { key: 'home', title: '首页', group: null, node: null, en: 'Home' },
  { key: 'guide', title: '使用指南', group: '指南', node: <GuidePage />, en: 'Guide' },
  { key: 'changelog', title: '更新记录', group: '指南', node: <ChangelogPage />, en: 'Changelog' },
  { key: 'playground', title: 'Playground 实时演练', group: '指南', node: <PlaygroundPage />, en: 'Playground' },
  { key: 'icon', title: 'Icon 图标', group: '资源', node: <IconPage />, en: 'Icon' },
  { key: 'typography', title: 'Typography 排版', group: '资源', node: <TypographyPage />, en: 'Typography' },
  { key: 'button', title: 'Button 按钮', group: '通用', node: <ButtonPage />, en: 'Button' },
  { key: 'cascader', title: 'Cascader 级联选择', group: '数据录入', node: <CascaderPage />, en: 'Cascader' },
  { key: 'divider', title: 'Divider 分割线', group: '通用', node: <DividerPage />, en: 'Divider' },
  { key: 'scroll', title: 'Scroll 滚动条', group: '通用', node: <ScrollPage />, en: 'Scroll' },
  { key: 'checkbox', title: 'Checkbox 复选框', group: '数据录入', node: <CheckboxPage />, en: 'Checkbox' },
  { key: 'date-picker', title: 'DatePicker 日期选择', group: '数据录入', node: <DatePickerPage />, en: 'DatePicker' },
  { key: 'input-number', title: 'InputNumber 数字输入框', group: '数据录入', node: <InputNumberPage />, en: 'InputNumber' },
  { key: 'form', title: 'Form 表单', group: '数据录入', node: <FormPage />, en: 'Form' },
  { key: 'input', title: 'Input 输入框', group: '数据录入', node: <InputPage />, en: 'Input' },
  { key: 'radio', title: 'Radio 单选框', group: '数据录入', node: <RadioPage />, en: 'Radio' },
  { key: 'segmented', title: 'Segmented 分段控制器', group: '数据录入', node: <SegmentedPage />, en: 'Segmented' },
  { key: 'rate', title: 'Rate 评分', group: '数据录入', node: <RatePage />, en: 'Rate' },
  { key: 'select', title: 'Select 选择器', group: '数据录入', node: <SelectPage />, en: 'Select' },
  { key: 'slider', title: 'Slider 滑动输入条', group: '数据录入', node: <SliderPage />, en: 'Slider' },
  { key: 'switch', title: 'Switch 开关', group: '数据录入', node: <SwitchPage />, en: 'Switch' },
  { key: 'time-picker', title: 'TimePicker 时间选择器', group: '数据录入', node: <TimePickerPage />, en: 'TimePicker' },
  { key: 'upload', title: 'Upload 上传', group: '数据录入', node: <UploadPage />, en: 'Upload' },
  { key: 'avatar', title: 'Avatar 头像', group: '数据展示', node: <AvatarPage />, en: 'Avatar' },
  { key: 'badge', title: 'Badge 徽标数', group: '数据展示', node: <BadgePage />, en: 'Badge' },
  { key: 'card', title: 'Card 卡片', group: '数据展示', node: <CardPage />, en: 'Card' },
  { key: 'descriptions', title: 'Descriptions 描述列表', group: '数据展示', node: <DescriptionsPage />, en: 'Descriptions' },
  { key: 'empty', title: 'Empty 空状态', group: '数据展示', node: <EmptyPage />, en: 'Empty' },
  { key: 'table', title: 'Table 表格', group: '数据展示', node: <TablePage />, en: 'Table' },
  { key: 'tag', title: 'Tag 标签', group: '数据展示', node: <TagPage />, en: 'Tag' },
  { key: 'timeline', title: 'Timeline 时间轴', group: '数据展示', node: <TimelinePage />, en: 'Timeline' },
  { key: 'tooltip', title: 'Tooltip 文字提示', group: '数据展示', node: <TooltipPage />, en: 'Tooltip' },
  { key: 'tree', title: 'Tree 树形控件', group: '数据展示', node: <TreePage />, en: 'Tree' },
  { key: 'alert', title: 'Alert 警告提示', group: '反馈', node: <AlertPage />, en: 'Alert' },
  { key: 'drawer', title: 'Drawer 抽屉', group: '反馈', node: <DrawerPage />, en: 'Drawer' },
  { key: 'message', title: 'Message 全局提示', group: '反馈', node: <MessagePage />, en: 'Message' },
  { key: 'menu', title: 'Menu 导航菜单', group: '导航', node: <MenuPage />, en: 'Menu' },
  { key: 'modal', title: 'Modal 对话框', group: '反馈', node: <ModalPage />, en: 'Modal' },
  { key: 'popconfirm', title: 'Popconfirm 气泡确认框', group: '反馈', node: <PopconfirmPage />, en: 'Popconfirm' },
  { key: 'progress', title: 'Progress 进度条', group: '反馈', node: <ProgressPage />, en: 'Progress' },
  { key: 'result', title: 'Result 结果页', group: '反馈', node: <ResultPage />, en: 'Result' },
  { key: 'skeleton', title: 'Skeleton 骨架屏', group: '反馈', node: <SkeletonPage />, en: 'Skeleton' },
  { key: 'spin', title: 'Spin 加载中', group: '反馈', node: <SpinPage />, en: 'Spin' },
  { key: 'breadcrumb', title: 'Breadcrumb 面包屑', group: '导航', node: <BreadcrumbPage />, en: 'Breadcrumb' },
  { key: 'dropdown', title: 'Dropdown 下拉菜单', group: '导航', node: <DropdownPage />, en: 'Dropdown' },
  { key: 'pagination', title: 'Pagination 分页', group: '导航', node: <PaginationPage />, en: 'Pagination' },
  { key: 'steps', title: 'Steps 步骤条', group: '导航', node: <StepsPage />, en: 'Steps' },
  { key: 'tabs', title: 'Tabs 标签页', group: '导航', node: <TabsPage />, en: 'Tabs' },
] as const;

type PageKey = (typeof pages)[number]['key'];

function currentPage(): PageKey {
  const key = location.hash.slice(1) as PageKey;
  return pages.some((p) => p.key === key) ? key : 'home';
}

// 侧栏分组：从 pages 派生
const groups = [...new Set(pages.map((p) => p.group).filter((g) => g !== null))].map(
  (label) => ({ label, keys: pages.filter((p) => p.group === label).map((p) => p.key) }),
);

export default function App() {
  return (
    <LangProvider>
      <DocsApp />
    </LangProvider>
  );
}

function DocsApp() {
  const [page, setPage] = useState<PageKey>(currentPage);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const { lang, setLang } = useLang();
  const t = useChrome();

  useEffect(() => {
    const onHash = () => setPage(currentPage());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // 移动端抽屉导航：Escape 关闭
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : '';
  }, [dark]);

  // 浏览器标签页标题跟随当前页面；首页用站点主标题
  useEffect(() => {
    document.title = page === 'home' ? 'Reef UI — React 组件库' : `${pageTitle(pages.find((p) => p.key === page)!)} · Reef UI`;
  }, [page, lang]);

  const toggleDark = () => setDark(!dark);

  const active = pages.find((p) => p.key === page)!;
  // 面包屑：当前页所属分组（首页/指南不显示）
  const activeGroup = groups.find((g) => (g.keys as readonly string[]).includes(page));
  // 上一篇/下一篇：按注册顺序（排除首页）
  const docPages = pages.filter((p) => p.group !== null);
  const docIndex = docPages.findIndex((p) => p.key === page);
  const prev = docIndex > 0 ? docPages[docIndex - 1] : null;
  const next = docIndex >= 0 && docIndex < docPages.length - 1 ? docPages[docIndex + 1] : null;
  // 页面标题：中文显示「组件 中文名」，英文只显示组件名
  const pageTitle = (p: (typeof pages)[number]) => (lang === 'en' ? p.en : p.title);
  // 搜索过滤：按标题（含中英文名）匹配，空结果组隐藏
  const q = query.trim().toLowerCase();
  const visibleGroups = groups
    .map((g) => ({
      ...g,
      keys: (g.keys as readonly string[]).filter((k) => {
        const p = pages.find((x) => x.key === k)!;
        return !q || p.title.toLowerCase().includes(q) || p.en.toLowerCase().includes(q);
      }),
    }))
    .filter((g) => g.keys.length > 0);
  // 侧栏即 Menu 组件本身（dogfooding）：分组 → type: 'group'，页面 → 叶子项
  const sidebarItems: MenuItem[] = visibleGroups.map((g) => ({
    key: `group-${g.label}`,
    type: 'group',
    label: groupLabel(g.label, lang),
    children: g.keys.map((k) => ({ key: k, label: pageTitle(pages.find((p) => p.key === k)!) })),
  }));

  // 首页是独立落地页，自带顶部导航，不带文档壳（侧栏）
  if (page === 'home') return <HomePage dark={dark} onToggleDark={toggleDark} />;

  return (
    <div className={'docs' + (navOpen ? ' docs--nav-open' : '')}>
      {navOpen && (
        <button
          type="button"
          className="docs__backdrop"
          aria-label="关闭导航菜单"
          onClick={() => setNavOpen(false)}
        />
      )}
      <aside className="docs__sidebar">
        <a className="docs__logo" href="#home">
          Reef UI <span className="docs__version">v{componentsPkg.version}</span>
        </a>
        <SearchInput value={query} onChange={setQuery} placeholder={t.search} />
        {/* flex:1 + minHeight:0：flex 列里滚动的前提是允许收缩到内容以下 */}
        <Scroll style={{ flex: 1, minHeight: 0 }}>
          <Menu
            className="docs__menu"
            items={sidebarItems}
            selectedKey={page}
            onChange={(key) => {
              location.hash = key;
              setNavOpen(false); // 移动端：选中页面后收起抽屉
            }}
          />
          {visibleGroups.length === 0 && <p className="docs__empty">{t.noMatch}</p>}
        </Scroll>
      </aside>
      <div className="docs__main">
        <header className="docs__topbar">
          <h2 className="docs__topbar-title">
            {activeGroup && page !== 'guide' ? (
              <Breadcrumb
                items={[
                  { title: groupLabel(activeGroup.label, lang), key: 'group' },
                  { title: pageTitle(active), key: 'page' },
                ]}
              />
            ) : (
              pageTitle(active)
            )}
          </h2>
          <div className="docs__topbar-actions">
            <button
              type="button"
              className="icon-btn docs__nav-toggle"
              aria-label="打开导航菜单"
              onClick={() => setNavOpen(true)}
            >
              <Icon name="menu" size={18} />
            </button>
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
            <button type="button" className="icon-btn" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} aria-label={t.langToggleAria}>
              <Icon name="languages" size={18} />
            </button>
          </div>
        </header>
        {/* key={page}：切页重挂载，触发内容淡入动画 */}
        <div className="docs__body">
          <main className="docs__content" key={page}>
            {active.node}
            {prev || next ? (
              <nav className="docs__pager" aria-label={t.pager}>
                {prev ? (
                  <a className="docs__pager-link" href={`#${prev.key}`}>
                    <span>{t.prev}</span>
                    <strong>{pageTitle(prev)}</strong>
                  </a>
                ) : (
                  <span />
                )}
                {next ? (
                  <a className="docs__pager-link docs__pager-link--next" href={`#${next.key}`}>
                    <span>{t.next}</span>
                    <strong>{pageTitle(next)}</strong>
                  </a>
                ) : null}
              </nav>
            ) : null}
          </main>
          <Toc pageKey={page} />
        </div>
      </div>
    </div>
  );
}
