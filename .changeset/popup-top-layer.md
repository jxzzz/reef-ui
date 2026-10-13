---
'@reef-ui/components': minor
---

浮层改走浏览器顶层：Select、Dropdown、Cascader、TreeSelect、TimePicker、DatePicker、DateRangePicker、AutoComplete 的面板加 `popover` 属性进入 top layer，定位用 CSS anchor positioning（Chrome / Safari，含放不下自动上翻），Firefox 退回 JS 读 rect 写 inset 并跟随滚动更新。

此前这些面板是 `position: absolute`，放进 `overflow: hidden/auto` 的容器（Table、Card、Drawer、Scroll）会被裁掉，靠近视口底部会溢出屏幕；散落的 `z-index: 100` 也不再需要。顺带修掉一处：`searchable` 的 Select 搜索框此前落在文档流里撑高组件（`.reef-select__panel` 没有任何样式，浮起来的是里面的 `__list`），现在搜索框和列表一起进浮层。
