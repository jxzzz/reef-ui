---
'@reef-ui/components': minor
---

Form 新增校验规则与提交回调：`FormItem` 的 `rules` 支持 `required` / `min` / `max` / `pattern` / `validator`（可异步）/ `trigger`，change、blur 即时校验，提交时统一校验，失败的控件描红；`Form` 新增 `onFinish`（校验通过，参数为表单值）和 `onFinishFailed`（参数为 name 到错误信息的映射）。导出 `FormRule` 类型。
