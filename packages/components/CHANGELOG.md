# @reef-ui/components

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
