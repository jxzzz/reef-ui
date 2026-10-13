---
'@reef-ui/components': minor
---

Tree 新增勾选与异步加载：`checkable` / `checkedKeys` / `defaultCheckedKeys` / `onCheck` / `checkStrictly` 支持父子级联与半选；`loadData` 在展开无 `children` 的节点时异步加载子节点（每个节点只触发一次），`TreeNode.isLeaf` 可显式声明叶子。
