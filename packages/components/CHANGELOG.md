# @reef-ui/components

## 0.8.0

### Minor Changes

- 4bfdadf: 受控组件接入 Form：Select、DatePicker、DateRangePicker、TimePicker、Cascader、TreeSelect、Transfer、Rate、Segmented、Switch、AutoComplete 新增 `name`，内部渲染隐藏 input，使值进入 FormData 并参与 FormItem 的 `rules` 校验。

  此前这些组件没有原生表单元素，包在 `<FormItem rules>` 里校验的是面板中的搜索框（或读不到值而恒判未填）。多值字段（多选 Select、日期区间、Cascader 路径、Transfer）在 `Form.onFinish` 中为数组。

- 8f02b32: Form 新增校验规则与提交回调：`FormItem` 的 `rules` 支持 `required` / `min` / `max` / `pattern` / `validator`（可异步）/ `trigger`，change、blur 即时校验，提交时统一校验，失败的控件描红；`Form` 新增 `onFinish`（校验通过，参数为表单值）和 `onFinishFailed`（参数为 name 到错误信息的映射）。导出 `FormRule` 类型。
- 767797f: 浮层改走浏览器顶层：Select、Dropdown、Cascader、TreeSelect、TimePicker、DatePicker、DateRangePicker、AutoComplete 的面板加 `popover` 属性进入 top layer，定位用 CSS anchor positioning（Chrome / Safari，含放不下自动上翻），Firefox 退回 JS 读 rect 写 inset 并跟随滚动更新。

  此前这些面板是 `position: absolute`，放进 `overflow: hidden/auto` 的容器（Table、Card、Drawer、Scroll）会被裁掉，靠近视口底部会溢出屏幕；散落的 `z-index: 100` 也不再需要。顺带修掉一处：`searchable` 的 Select 搜索框此前落在文档流里撑高组件（`.reef-select__panel` 没有任何样式，浮起来的是里面的 `__list`），现在搜索框和列表一起进浮层。

- 8f02b32: Tree 新增勾选与异步加载：`checkable` / `checkedKeys` / `defaultCheckedKeys` / `onCheck` / `checkStrictly` 支持父子级联与半选；`loadData` 在展开无 `children` 的节点时异步加载子节点（每个节点只触发一次），`TreeNode.isLeaf` 可显式声明叶子。
- 8f02b32: Upload 新增 HTTP 上传：传 `action` 后经 XMLHttpRequest 上传，配套 `beforeUpload` / `onProgress` / `onSuccess` / `onError` / `headers` / `name` / `withCredentials`，导出 `UploadStatus` 类型。不传 `action` 时行为不变，仍只收集文件列表。

## 0.7.0

### Minor Changes

- 89612a2: 新增 Statistic 数值统计、Popover 弹出卡片、Notification 通知提醒、Carousel 走马灯、Transfer 穿梭框、AutoComplete 自动完成、TreeSelect 树选择、Anchor 锚点 8 个组件

## 0.6.0

### Minor Changes

- 7c18acc: 新增 Space 间距、Collapse 折叠面板组件；Select 支持多选（multiple）与搜索（searchable）

## 0.5.0

### Minor Changes

- 52ef8de: 新增 4 个组件：Tree 树形控件、Cascader 级联选择、Upload 上传、Dropdown 下拉菜单

## 0.4.1

### Patch Changes

- 3e3357a: 无障碍修复：Checkbox 半选态写入原生 indeterminate 属性（读屏器正确朗读「混合」态）；Modal/Drawer/Popconfirm 标题为 ReactNode 时补 aria-labelledby 可访问名称；Popconfirm 关闭后焦点还原到触发器；Menu 子菜单展开按钮补 aria-haspopup；统一各组件 focus-visible 焦点外圈并补齐 Pagination/DatePicker/InputNumber 缺失的键盘焦点样式

## 0.4.0

### Minor Changes

- 760e76d: 新增四个组件：Popconfirm 气泡确认框、Slider 滑动输入条、Rate 评分、TimePicker 时间选择器；语言包新增对应词条（Popconfirm/Rate/TimePicker）

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
