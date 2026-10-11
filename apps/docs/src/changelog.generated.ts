// 由 scripts/gen-changelog.mjs 从 git 历史生成，勿手改
export interface ChangelogEntry {
  version: string;
  date: string;
  items: Array<{ type: string; text: string }>;
}

export const changelog: ChangelogEntry[] = [
  {
    "version": "未发布",
    "date": "开发中",
    "items": [
      {
        "type": "新增",
        "text": "[components] 新增 Popconfirm/Slider/Rate/TimePicker 组件"
      },
      {
        "type": "修复",
        "text": "[components] 修复 checkbox 暗色模式对勾常显与 divider 虚线过淡"
      }
    ]
  },
  {
    "version": "0.3.0",
    "date": "2026-10-11",
    "items": [
      {
        "type": "修复",
        "text": "[components] 修复 steps.css 注释前缺少空行的 stylelint 报错"
      },
      {
        "type": "修复",
        "text": "[docs] 移除未使用的 Lang 类型导入"
      },
      {
        "type": "新增",
        "text": "[components] Icon 新增 languages 图标"
      },
      {
        "type": "修复",
        "text": "[components] Steps 长英文标题不再换行"
      },
      {
        "type": "新增",
        "text": "[components] 新增 LocaleProvider 国际化"
      },
      {
        "type": "修复",
        "text": "更新记录在浅克隆部署环境不再被空历史覆盖"
      },
      {
        "type": "新增",
        "text": "Menu 导航菜单组件"
      },
      {
        "type": "修复",
        "text": "Table 撑满父容器，DatePicker 输入框宽度给足"
      }
    ]
  },
  {
    "version": "0.2.0",
    "date": "2026-10-11",
    "items": [
      {
        "type": "新增",
        "text": "DatePicker / DateRangePicker and InputNumber"
      },
      {
        "type": "新增",
        "text": "Table component — columns config, render, sorting"
      },
      {
        "type": "修复",
        "text": "Select choice crashed when no ref passed; add Form/Select tests"
      }
    ]
  },
  {
    "version": "0.1.2",
    "date": "2026-10-10",
    "items": [
      {
        "type": "修复",
        "text": "add repository metadata to core and icons (required for provenance verification)"
      }
    ]
  },
  {
    "version": "0.1.0",
    "date": "2026-10-10",
    "items": [
      {
        "type": "新增",
        "text": "[Scroll] 显隐过渡样式与文档站页面"
      },
      {
        "type": "新增",
        "text": "[Scroll] 滑块拖拽，Pointer Events 换算 scrollTop"
      },
      {
        "type": "新增",
        "text": "[Scroll] 组件骨架，隐藏原生滚动条的覆盖式容器"
      },
      {
        "type": "新增",
        "text": "[Scroll] calcThumb 滑块几何纯函数"
      },
      {
        "type": "新增",
        "text": "Progress 新增 circle 圆环变体"
      },
      {
        "type": "修复",
        "text": "Progress 轨道增加 min-width，防止 flex 收缩上下文塌缩"
      },
      {
        "type": "修复",
        "text": "Input wrapper 增加 flex-shrink: 0，防止被 flex 容器压缩高度"
      },
      {
        "type": "修复",
        "text": "侧栏/图标页搜索框样式作用到 Input wrapper，修复错乱"
      },
      {
        "type": "新增",
        "text": "Input 支持 clearable 与 prefix/suffix"
      },
      {
        "type": "新增",
        "text": "图标库扩至 57 个，IconPage 改为点击复制的网格总览"
      },
      {
        "type": "修复",
        "text": "Segmented select 参数收窄为 string，修复 tsc 构建"
      },
      {
        "type": "修复",
        "text": "导出与样式字母序、DrawerPage 代码串补 footer"
      },
      {
        "type": "修复",
        "text": "Segmented 方向键导航与 roving tabindex"
      },
      {
        "type": "修复",
        "text": "Drawer 左侧滑入动画方向 + 叠层时 Esc 只关最上层"
      },
      {
        "type": "修复",
        "text": "Drawer 焦点管理（初始聚焦、焦点圈、关闭还原），对齐 Modal"
      },
      {
        "type": "修复",
        "text": "批次 3 审查遗留项（Progress NaN、Steps role、示例一致性、shadow token）"
      },
      {
        "type": "修复",
        "text": "reset Avatar fallback state when src changes"
      },
      {
        "type": "修复",
        "text": "resolve all stylelint baseline errors"
      },
      {
        "type": "新增",
        "text": "[docs] collapsible code blocks with animated expand"
      },
      {
        "type": "新增",
        "text": "replace landing middle sections with reef sea scene and polish entries"
      },
      {
        "type": "新增",
        "text": "add component showcase wall to landing page"
      },
      {
        "type": "修复",
        "text": "rename sidebar guide group to avoid duplicate label"
      },
      {
        "type": "新增",
        "text": "add reef-themed favicon to docs"
      },
      {
        "type": "新增",
        "text": "merge theme tokens into components style.css, add GitHub link"
      },
      {
        "type": "新增",
        "text": "Reef UI v0.1 monorepo skeleton with docs site"
      },
      {
        "type": "新增",
        "text": "首批组件：Message；Drawer；Segmented；Descriptions；Result；Timeline；Skeleton；Divider；Spin；Empty；Progress；Steps；Breadcrumb；Card；Avatar；Badge；Pagination；Tabs；Modal；Tooltip；Alert；Tag；Radio and RadioGroup；Select；Input, Switch, Checkbox and Form"
      }
    ]
  }
];
