---
"@reef-ui/components": minor
---

新增国际化支持：添加 `LocaleProvider` 与 `useLocale`，内置 `zhCN`（默认）和 `enUS` 两种语言包。Placeholder、空数据、加载中、aria-label 等文案随 locale 切换；DatePicker / DateRangePicker 支持按语言设置一周起点（zhCN 周一开始，enUS 周日开始）。所有现有用法默认仍为中文，无需改动。
