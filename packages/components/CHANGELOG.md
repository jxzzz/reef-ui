# @reef-ui/components

## 0.3.0

### Minor Changes

- b9f35db: 新增国际化支持：添加 `LocaleProvider` 与 `useLocale`，内置 `zhCN`（默认）和 `enUS` 两种语言包。Placeholder、空数据、加载中、aria-label 等文案随 locale 切换；DatePicker / DateRangePicker 支持按语言设置一周起点（zhCN 周一开始，enUS 周日开始）。所有现有用法默认仍为中文，无需改动。

### Patch Changes

- 94a6aef: 修复尺寸：Table 外层容器在 flex 布局下收缩为内容宽度，现在默认撑满父容器；DatePicker 输入框给足日期字符串宽度（140px），DateRangePicker 双输入由 92px 放宽到 112px。
- 7443138: 修复尺寸：Steps 步骤条在英文等长标题下被强制均分宽度导致标题换行，现改为按内容分配宽度（连接线吸收剩余空间），标题保持单行。

## 0.2.0

### Minor Changes

- 新增 Table（列配置 / render 自定义单元格 / 点击表头排序）、DatePicker 与 DateRangePicker（单选与范围共用一套日历面板，值统一为 YYYY-MM-DD 字符串）、InputNumber（± 步进、失焦钳位、空值回传 null）。

  修复：Select 不传 ref 时点击选项抛错（`ref.current` 空引用）。

## 0.1.2

### Patch Changes

- 为所有包添加 README(npm 包页面展示)
- Updated dependencies
  - @reef-ui/theme@0.1.2
  - @reef-ui/utils@0.1.2

## 0.1.1

### Patch Changes

- 首次通过 Trusted Publishing(OIDC)发布,验证自动化发版流程
- Updated dependencies
  - @reef-ui/theme@0.1.1
  - @reef-ui/utils@0.1.1
