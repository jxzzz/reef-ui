---
'@reef-ui/components': minor
---

受控组件接入 Form：Select、DatePicker、DateRangePicker、TimePicker、Cascader、TreeSelect、Transfer、Rate、Segmented、Switch、AutoComplete 新增 `name`，内部渲染隐藏 input，使值进入 FormData 并参与 FormItem 的 `rules` 校验。

此前这些组件没有原生表单元素，包在 `<FormItem rules>` 里校验的是面板中的搜索框（或读不到值而恒判未填）。多值字段（多选 Select、日期区间、Cascader 路径、Transfer）在 `Form.onFinish` 中为数组。
