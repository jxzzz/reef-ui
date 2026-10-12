import { useState } from 'react';
import { Tree } from '@reef-ui/components';
import type { TreeNode } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const orgDataCode = {
  zh: `const orgData = [
  {
    key: 'hq',
    label: '总部',
    children: [
      {
        key: 'dev',
        label: '研发部',
        children: [
          { key: 'fe', label: '前端组' },
          { key: 'be', label: '后端组' },
        ],
      },
      { key: 'hr', label: '人事部' },
    ],
  },
  { key: 'sh', label: '上海分部' },
];`,
  en: `const orgData = [
  {
    key: 'hq',
    label: 'HQ',
    children: [
      {
        key: 'dev',
        label: 'R&D',
        children: [
          { key: 'fe', label: 'Frontend' },
          { key: 'be', label: 'Backend' },
        ],
      },
      { key: 'hr', label: 'HR' },
    ],
  },
  { key: 'sh', label: 'Shanghai Branch' },
];`,
};

const basicCode: Record<Lang, string> = {
  zh: `${orgDataCode.zh}
<Tree treeData={orgData} defaultExpandedKeys={['hq']} defaultValue="fe" />`,
  en: `${orgDataCode.en}
<Tree treeData={orgData} defaultExpandedKeys={['hq']} defaultValue="fe" />`,
};

const controlledCode: Record<Lang, string> = {
  zh: `const [expanded, setExpanded] = useState(['hq']);
const [selected, setSelected] = useState('dev');
${orgDataCode.zh}
<Tree
  treeData={orgData}
  expandedKeys={expanded}
  onExpandedKeysChange={setExpanded}
  value={selected}
  onChange={setSelected}
/>
<span>当前选中：{selected}</span>`,
  en: `const [expanded, setExpanded] = useState(['hq']);
const [selected, setSelected] = useState('dev');
${orgDataCode.en}
<Tree
  treeData={orgData}
  expandedKeys={expanded}
  onExpandedKeysChange={setExpanded}
  value={selected}
  onChange={setSelected}
/>
<span>Selected: {selected}</span>`,
};

export function TreePage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [expanded, setExpanded] = useState(['hq']);
  const [selected, setSelected] = useState('dev');

  const orgData: TreeNode[] = zh
    ? [
        {
          key: 'hq',
          label: '总部',
          children: [
            {
              key: 'dev',
              label: '研发部',
              children: [
                { key: 'fe', label: '前端组' },
                { key: 'be', label: '后端组' },
              ],
            },
            { key: 'hr', label: '人事部' },
          ],
        },
        { key: 'sh', label: '上海分部' },
      ]
    : [
        {
          key: 'hq',
          label: 'HQ',
          children: [
            {
              key: 'dev',
              label: 'R&D',
              children: [
                { key: 'fe', label: 'Frontend' },
                { key: 'be', label: 'Backend' },
              ],
            },
            { key: 'hr', label: 'HR' },
          ],
        },
        { key: 'sh', label: 'Shanghai Branch' },
      ];

  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Tree 树形控件' : 'Tree'}>
        {zh ? (
          <>
            层级数据的展开/收起与单选。点击箭头展开子节点，点击文字选中节点；
            选中项与展开项均支持受控与非受控，disabled 节点不可选中。
          </>
        ) : (
          <>
            Expand/collapse and single-select for hierarchical data. Click the arrow to expand
            children, click the label to select; both selection and expansion support controlled and
            uncontrolled usage, disabled nodes cannot be selected.
          </>
        )}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Tree treeData={orgData} defaultExpandedKeys={['hq']} defaultValue="fe" />
      </Demo>

      <Demo title={zh ? '受控展开与选中' : 'Controlled expansion and selection'} code={zh ? controlledCode.zh : controlledCode.en}>
        <Tree
          treeData={orgData}
          expandedKeys={expanded}
          onExpandedKeysChange={setExpanded}
          value={selected}
          onChange={setSelected}
        />
        <span>{zh ? `当前选中：${selected}` : `Selected: ${selected}`}</span>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['treeData', zh ? '树节点数据 { key, label, children?, disabled? }' : 'Tree nodes { key, label, children?, disabled? }', 'TreeNode[]', zh ? '必填' : 'Required'],
          ['value', zh ? '选中节点 key（受控，单选）' : 'Selected node key (controlled, single)', 'string', '-'],
          ['defaultValue', zh ? '默认选中 key（非受控）' : 'Initially selected key (uncontrolled)', 'string', '-'],
          ['onChange', zh ? '选中回调 (key)' : 'Called when a node is selected (key)', '(key: string) => void', '-'],
          ['defaultExpandedKeys', zh ? '初始展开的节点 key（非受控）' : 'Initially expanded keys (uncontrolled)', 'string[]', '[]'],
          ['expandedKeys', zh ? '展开的节点 key（受控）' : 'Expanded keys (controlled)', 'string[]', '-'],
          ['onExpandedKeysChange', zh ? '展开状态变化回调 (keys)' : 'Called when expansion changes (keys)', '(keys: string[]) => void', '-'],
          ['selectable', zh ? '节点是否可选中' : 'Whether nodes are selectable', 'boolean', 'true'],
          ['disabled', zh ? '禁用整棵树' : 'Disable the whole tree', 'boolean', 'false'],
        ]}
      />

      <TypeBlock
        code={`interface TreeNode {
  key: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
}`}
      />
    </>
  );
}
