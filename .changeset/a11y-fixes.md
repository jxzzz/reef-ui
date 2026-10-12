---
'@reef-ui/components': patch
---

无障碍修复：Checkbox 半选态写入原生 indeterminate 属性（读屏器正确朗读「混合」态）；Modal/Drawer/Popconfirm 标题为 ReactNode 时补 aria-labelledby 可访问名称；Popconfirm 关闭后焦点还原到触发器；Menu 子菜单展开按钮补 aria-haspopup；统一各组件 focus-visible 焦点外圈并补齐 Pagination/DatePicker/InputNumber 缺失的键盘焦点样式
