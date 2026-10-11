import { useEffect, useState } from 'react';
import { Breadcrumb, Icon, Menu, Scroll, type MenuItem } from '@reef-ui/components';
// 版本号直接取组件包 package.json，发版随 changeset 自动更新
import componentsPkg from '../../../packages/components/package.json';
import { SearchInput } from './docs-ui';
import { AlertPage } from './pages/AlertPage';
import { AvatarPage } from './pages/AvatarPage';
import { BadgePage } from './pages/BadgePage';
import { BreadcrumbPage } from './pages/BreadcrumbPage';
import { DatePickerPage } from './pages/DatePickerPage';
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
import { TypographyPage } from './pages/TypographyPage';

// 页面注册单一来源：hash key、侧栏分组、页面渲染都从这里派生。
// 新增页面只改这一处（import + 一行注册）。
// 侧栏分组顺序 = group 字段的首次出现顺序；group: null 的页面不进侧栏。
const pages = [
  // 首页是独立落地页（自带顶部导航，提前 return），node 永远不会渲染
  { key: 'home', title: '首页', group: null, node: null },
  { key: 'guide', title: '使用指南', group: '指南', node: <GuidePage /> },
  { key: 'icon', title: 'Icon 图标', group: '资源', node: <IconPage /> },
  { key: 'typography', title: 'Typography 排版', group: '资源', node: <TypographyPage /> },
  { key: 'button', title: 'Button 按钮', group: '通用', node: <ButtonPage /> },
  { key: 'divider', title: 'Divider 分割线', group: '通用', node: <DividerPage /> },
  { key: 'scroll', title: 'Scroll 滚动条', group: '通用', node: <ScrollPage /> },
  { key: 'checkbox', title: 'Checkbox 复选框', group: '数据录入', node: <CheckboxPage /> },
  { key: 'date-picker', title: 'DatePicker 日期选择', group: '数据录入', node: <DatePickerPage /> },
  { key: 'input-number', title: 'InputNumber 数字输入框', group: '数据录入', node: <InputNumberPage /> },
  { key: 'form', title: 'Form 表单', group: '数据录入', node: <FormPage /> },
  { key: 'input', title: 'Input 输入框', group: '数据录入', node: <InputPage /> },
  { key: 'radio', title: 'Radio 单选框', group: '数据录入', node: <RadioPage /> },
  { key: 'segmented', title: 'Segmented 分段控制器', group: '数据录入', node: <SegmentedPage /> },
  { key: 'select', title: 'Select 选择器', group: '数据录入', node: <SelectPage /> },
  { key: 'switch', title: 'Switch 开关', group: '数据录入', node: <SwitchPage /> },
  { key: 'avatar', title: 'Avatar 头像', group: '数据展示', node: <AvatarPage /> },
  { key: 'badge', title: 'Badge 徽标数', group: '数据展示', node: <BadgePage /> },
  { key: 'card', title: 'Card 卡片', group: '数据展示', node: <CardPage /> },
  { key: 'descriptions', title: 'Descriptions 描述列表', group: '数据展示', node: <DescriptionsPage /> },
  { key: 'empty', title: 'Empty 空状态', group: '数据展示', node: <EmptyPage /> },
  { key: 'table', title: 'Table 表格', group: '数据展示', node: <TablePage /> },
  { key: 'tag', title: 'Tag 标签', group: '数据展示', node: <TagPage /> },
  { key: 'timeline', title: 'Timeline 时间轴', group: '数据展示', node: <TimelinePage /> },
  { key: 'tooltip', title: 'Tooltip 文字提示', group: '数据展示', node: <TooltipPage /> },
  { key: 'alert', title: 'Alert 警告提示', group: '反馈', node: <AlertPage /> },
  { key: 'drawer', title: 'Drawer 抽屉', group: '反馈', node: <DrawerPage /> },
  { key: 'message', title: 'Message 全局提示', group: '反馈', node: <MessagePage /> },
  { key: 'menu', title: 'Menu 导航菜单', group: '导航', node: <MenuPage /> },
  { key: 'modal', title: 'Modal 对话框', group: '反馈', node: <ModalPage /> },
  { key: 'progress', title: 'Progress 进度条', group: '反馈', node: <ProgressPage /> },
  { key: 'result', title: 'Result 结果页', group: '反馈', node: <ResultPage /> },
  { key: 'skeleton', title: 'Skeleton 骨架屏', group: '反馈', node: <SkeletonPage /> },
  { key: 'spin', title: 'Spin 加载中', group: '反馈', node: <SpinPage /> },
  { key: 'breadcrumb', title: 'Breadcrumb 面包屑', group: '导航', node: <BreadcrumbPage /> },
  { key: 'pagination', title: 'Pagination 分页', group: '导航', node: <PaginationPage /> },
  { key: 'steps', title: 'Steps 步骤条', group: '导航', node: <StepsPage /> },
  { key: 'tabs', title: 'Tabs 标签页', group: '导航', node: <TabsPage /> },
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

  const active = pages.find((p) => p.key === page)!;
  // 面包屑：当前页所属分组（首页/指南不显示）
  const activeGroup = groups.find((g) => (g.keys as readonly string[]).includes(page));
  // 搜索过滤：按标题（含中文名）匹配，空结果组隐藏
  const q = query.trim().toLowerCase();
  const visibleGroups = groups
    .map((g) => ({ ...g, keys: (g.keys as readonly string[]).filter((k) => !q || pages.find((p) => p.key === k)!.title.toLowerCase().includes(q)) }))
    .filter((g) => g.keys.length > 0);
  // 侧栏即 Menu 组件本身（dogfooding）：分组 → type: 'group'，页面 → 叶子项
  const sidebarItems: MenuItem[] = visibleGroups.map((g) => ({
    key: `group-${g.label}`,
    type: 'group',
    label: g.label,
    children: g.keys.map((k) => ({ key: k, label: pages.find((p) => p.key === k)!.title })),
  }));

  // 首页是独立落地页，自带顶部导航，不带文档壳（侧栏）
  if (page === 'home') return <HomePage dark={dark} onToggleDark={toggleDark} />;

  return (
    <div className="docs">
      <aside className="docs__sidebar">
        <a className="docs__logo" href="#home">
          Reef UI <span className="docs__version">v{componentsPkg.version}</span>
        </a>
        <SearchInput value={query} onChange={setQuery} placeholder="搜索组件…" />
        {/* flex:1 + minHeight:0：flex 列里滚动的前提是允许收缩到内容以下 */}
        <Scroll style={{ flex: 1, minHeight: 0 }}>
          <Menu
            className="docs__menu"
            items={sidebarItems}
            selectedKey={page}
            onChange={(key) => {
              location.hash = key;
            }}
          />
          {visibleGroups.length === 0 && <p className="docs__empty">没有匹配的组件</p>}
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
