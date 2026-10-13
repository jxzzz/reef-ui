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

const checkableCode: Record<Lang, string> = {
  zh: `const [checkedKeys, setCheckedKeys] = useState(['fe']);
${orgDataCode.zh}
<Tree
  treeData={orgData}
  defaultExpandedKeys={['hq']}
  checkable
  checkedKeys={checkedKeys}
  onCheck={setCheckedKeys}
/>`,
  en: `const [checkedKeys, setCheckedKeys] = useState(['fe']);
${orgDataCode.en}
<Tree
  treeData={orgData}
  defaultExpandedKeys={['hq']}
  checkable
  checkedKeys={checkedKeys}
  onCheck={setCheckedKeys}
/>`,
};

const asyncCode: Record<Lang, string> = {
  zh: `const [asyncData, setAsyncData] = useState([
  { key: 'root', label: '根节点' },
]);
const loadData = (node) =>
  new Promise((resolve) => {
    setTimeout(() => {
      setAsyncData((prev) =>
        prev.map((n) =>
          n.key === node.key
            ? {
                ...n,
                children: [
                  { key: node.key + '-1', label: node.label + '子节点 1', isLeaf: true },
                  { key: node.key + '-2', label: node.label + '子节点 2', isLeaf: true },
                ],
              }
            : n,
        ),
      );
      resolve();
    }, 800);
  });

<Tree treeData={asyncData} loadData={loadData} />`,
  en: `const [asyncData, setAsyncData] = useState([
  { key: 'root', label: 'Root' },
]);
const loadData = (node) =>
  new Promise((resolve) => {
    setTimeout(() => {
      setAsyncData((prev) =>
        prev.map((n) =>
          n.key === node.key
            ? {
                ...n,
                children: [
                  { key: node.key + '-1', label: node.label + ' child 1', isLeaf: true },
                  { key: node.key + '-2', label: node.label + ' child 2', isLeaf: true },
                ],
              }
            : n,
        ),
      );
      resolve();
    }, 800);
  });

<Tree treeData={asyncData} loadData={loadData} />`,
};

export function TreePage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [expanded, setExpanded] = useState(['hq']);
  const [selected, setSelected] = useState('dev');
  const [checkedKeys, setCheckedKeys] = useState<string[]>(['fe']);
  const [asyncData, setAsyncData] = useState<TreeNode[]>([
    { key: 'root', label: zh ? '根节点' : 'Root' },
  ]);

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

  const loadData = (node: TreeNode) =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        setAsyncData((prev) =>
          prev.map((n) =>
            n.key === node.key
              ? {
                  ...n,
                  children: [
                    {
                      key: `${node.key}-1`,
                      label: zh ? `${node.label}子节点 1` : `${node.label} child 1`,
                      isLeaf: true,
                    },
                    {
                      key: `${node.key}-2`,
                      label: zh ? `${node.label}子节点 2` : `${node.label} child 2`,
                      isLeaf: true,
                    },
                  ],
                }
              : n,
          ),
        );
        resolve();
      }, 800);
    });

  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Tree 树形控件' : 'Tree'}>
        {zh ? (
          <>
            层级数据的展开/收起、单选、多选复选与异步加载。点击箭头展开子节点，点击文字选中节点；
            选中项与展开项均支持受控与非受控，disabled 节点不可选中；
            checkable 开启复选框级联勾选，loadData 按需异步加载子节点。
          </>
        ) : (
          <>
            Expand/collapse, single-select, checkboxes and async loading for hierarchical data.
            Click the arrow to expand children, click the label to select; selection and expansion
            support controlled and uncontrolled usage, disabled nodes cannot be selected;
            checkable enables cascading checkboxes, loadData loads children on demand.
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

      <Demo title={zh ? '多选复选' : 'Checkable'} code={zh ? checkableCode.zh : checkableCode.en}>
        <Tree
          treeData={orgData}
          defaultExpandedKeys={['hq']}
          checkable
          checkedKeys={checkedKeys}
          onCheck={setCheckedKeys}
        />
      </Demo>

      <Demo title={zh ? '异步加载' : 'Async loading'} code={zh ? asyncCode.zh : asyncCode.en}>
        <Tree treeData={asyncData} loadData={loadData} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['treeData', zh ? '树节点数据 { key, label, children?, disabled?, isLeaf? }' : 'Tree nodes { key, label, children?, disabled?, isLeaf? }', 'TreeNode[]', zh ? '必填' : 'Required'],
          ['value', zh ? '选中节点 key（受控，单选）' : 'Selected node key (controlled, single)', 'string', '-'],
          ['defaultValue', zh ? '默认选中 key（非受控）' : 'Initially selected key (uncontrolled)', 'string', '-'],
          ['onChange', zh ? '选中回调 (key)' : 'Called when a node is selected (key)', '(key: string) => void', '-'],
          ['defaultExpandedKeys', zh ? '初始展开的节点 key（非受控）' : 'Initially expanded keys (uncontrolled)', 'string[]', '[]'],
          ['expandedKeys', zh ? '展开的节点 key（受控）' : 'Expanded keys (controlled)', 'string[]', '-'],
          ['onExpandedKeysChange', zh ? '展开状态变化回调 (keys)' : 'Called when expansion changes (keys)', '(keys: string[]) => void', '-'],
          ['selectable', zh ? '节点是否可选中' : 'Whether nodes are selectable', 'boolean', 'true'],
          ['disabled', zh ? '禁用整棵树' : 'Disable the whole tree', 'boolean', 'false'],
          ['checkable', zh ? '节点前渲染复选框（多选）' : 'Render a checkbox before each node', 'boolean', 'false'],
          ['checkedKeys', zh ? '勾选的节点 key（受控）' : 'Checked keys (controlled)', 'string[]', '-'],
          ['defaultCheckedKeys', zh ? '初始勾选的节点 key（非受控）' : 'Initially checked keys (uncontrolled)', 'string[]', '[]'],
          ['onCheck', zh ? '勾选回调 (checkedKeys, { checked, node })' : 'Called when a node is checked (checkedKeys, { checked, node })', '(checkedKeys: string[], info: { checked: boolean; node: TreeNode }) => void', '-'],
          ['checkStrictly', zh ? '勾选时不级联父子节点' : 'Check nodes independently, no cascade', 'boolean', 'false'],
          ['loadData', zh ? '展开无子节点且非 isLeaf 的节点时异步加载，每个节点只触发一次' : 'Load children lazily when expanding a childless non-leaf node, fired once per node', '(node: TreeNode) => Promise<void>', '-'],
        ]}
      />

      <TypeBlock
        code={`interface TreeNode {
  key: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
  /** 显式声明为叶子节点：即使没有 children 也不会触发 loadData */
  isLeaf?: boolean;
}`}
      />
    </>
  );
}
