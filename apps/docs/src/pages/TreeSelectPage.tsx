import { useState } from 'react';
import { TreeSelect, Tag } from '@reef-ui/components';
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
<TreeSelect treeData={orgData} placeholder="请选择部门" />
<TreeSelect treeData={orgData} defaultValue="fe" allowClear />
<TreeSelect treeData={orgData} disabled />`,
  en: `${orgDataCode.en}
<TreeSelect treeData={orgData} placeholder="Select a department" />
<TreeSelect treeData={orgData} defaultValue="fe" allowClear />
<TreeSelect treeData={orgData} disabled />`,
};

const multipleCode: Record<Lang, string> = {
  zh: `${orgDataCode.zh}
const [teams, setTeams] = useState<string[]>([]);
<TreeSelect
  treeData={orgData}
  multiple
  value={teams}
  onChange={(v) => setTeams(v as string[])}
  placeholder="多选团队"
/>
<Tag color="brand">{teams.length} 项</Tag>`,
  en: `${orgDataCode.en}
const [teams, setTeams] = useState<string[]>([]);
<TreeSelect
  treeData={orgData}
  multiple
  value={teams}
  onChange={(v) => setTeams(v as string[])}
  placeholder="Multi select"
/>
<Tag color="brand">{teams.length} selected</Tag>`,
};

const searchableCode: Record<Lang, string> = {
  zh: `${orgDataCode.zh}
<TreeSelect treeData={orgData} searchable placeholder="搜索并选择" />`,
  en: `${orgDataCode.en}
<TreeSelect treeData={orgData} searchable placeholder="Search and select" />`,
};

const controlledCode: Record<Lang, string> = {
  zh: `const [dept, setDept] = useState('');
${orgDataCode.zh}
<TreeSelect treeData={orgData} value={dept} onChange={(v) => setDept(v as string)} placeholder="受控选择" />
<span>当前值：{dept || '-'}</span>`,
  en: `const [dept, setDept] = useState('');
${orgDataCode.en}
<TreeSelect treeData={orgData} value={dept} onChange={(v) => setDept(v as string)} placeholder="Controlled" />
<span>Current value: {dept || '-'}</span>`,
};

export function TreeSelectPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [dept, setDept] = useState('');
  const [teams, setTeams] = useState<string[]>([]);

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
      <ComponentHeader group="数据录入" title={zh ? 'TreeSelect 树选择' : 'TreeSelect'}>
        {zh ? (
          <>
            选择器形态的树形控件：点击触发器展开树形面板，选中节点后回显到触发器。
            支持多选（标签回显、面板不关闭）、可搜索（按 label 过滤并自动展开命中路径）、
            可清空与禁用。
          </>
        ) : (
          <>
            A tree control in select form: click the trigger to open a tree panel, and the
            selected node echoes back into the trigger. Supports multiple selection (tag echo,
            panel stays open), search (filters by label and auto-expands matched paths),
            clearable and disabled.
          </>
        )}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <>
            <TreeSelect treeData={orgData} placeholder="请选择部门" />
            <TreeSelect treeData={orgData} defaultValue="fe" allowClear />
            <TreeSelect treeData={orgData} disabled />
          </>
        ) : (
          <>
            <TreeSelect treeData={orgData} placeholder="Select a department" />
            <TreeSelect treeData={orgData} defaultValue="fe" allowClear />
            <TreeSelect treeData={orgData} disabled />
          </>
        )}
      </Demo>

      <Demo title={zh ? '多选' : 'Multiple'} code={zh ? multipleCode.zh : multipleCode.en}>
        {zh ? (
          <>
            <TreeSelect
              treeData={orgData}
              multiple
              value={teams}
              onChange={(v) => setTeams(v as string[])}
              placeholder="多选团队"
            />
            <Tag color="brand">{teams.length} 项</Tag>
          </>
        ) : (
          <>
            <TreeSelect
              treeData={orgData}
              multiple
              value={teams}
              onChange={(v) => setTeams(v as string[])}
              placeholder="Multi select"
            />
            <Tag color="brand">{teams.length} selected</Tag>
          </>
        )}
      </Demo>

      <Demo title={zh ? '可搜索' : 'Searchable'} code={zh ? searchableCode.zh : searchableCode.en}>
        <TreeSelect treeData={orgData} searchable placeholder={zh ? '搜索并选择' : 'Search and select'} />
      </Demo>

      <Demo title={zh ? '受控' : 'Controlled'} code={zh ? controlledCode.zh : controlledCode.en}>
        {zh ? (
          <>
            <TreeSelect treeData={orgData} value={dept} onChange={(v) => setDept(v as string)} placeholder="受控选择" />
            <span>当前值：{dept || '-'}</span>
          </>
        ) : (
          <>
            <TreeSelect treeData={orgData} value={dept} onChange={(v) => setDept(v as string)} placeholder="Controlled" />
            <span>Current value: {dept || '-'}</span>
          </>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['treeData', zh ? '树节点数据，复用 Tree 的 TreeNode 结构' : 'Tree node data, reuses the Tree TreeNode shape', 'TreeNode[]', '-'],
          ['value', zh ? '当前值（受控）；多选时为 string[]' : 'Current value (controlled); string[] when multiple', 'string | string[]', '-'],
          ['defaultValue', zh ? '默认值（非受控）；多选时为 string[]' : 'Default value (uncontrolled); string[] when multiple', 'string | string[]', '-'],
          ['onChange', zh ? '选中回调 (value)；多选时参数为 string[]，单选清空时为空字符串' : 'Called on selection (value); string[] when multiple, empty string when single is cleared', '(value: string | string[]) => void', '-'],
          ['placeholder', zh ? '占位文字' : 'Placeholder text', 'string', zh ? '"请选择"' : '"请选择"'],
          ['multiple', zh ? '多选模式：面板点选不关闭，触发器内以可关闭标签渲染已选项' : 'Multiple mode: panel stays open, selected items render as closable tags', 'boolean', 'false'],
          ['searchable', zh ? '可搜索：面板顶部渲染搜索框，按 label 大小写不敏感过滤并自动展开命中路径' : 'Searchable: search input atop the panel, filters by label case-insensitively and auto-expands matched paths', 'boolean', 'false'],
          ['disabled', zh ? '禁用整只树选择' : 'Disable the whole tree select', 'boolean', 'false'],
          ['allowClear', zh ? '有值时触发器内显示 × 清空按钮' : 'Show a × clear button in the trigger when a value is set', 'boolean', 'false'],
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
      <p>
        {zh
          ? '面板内复用 Tree 组件；支持受控与非受控两种用法。多选模式下面板内不回显选中高亮，选中态由触发器标签呈现。'
          : 'The panel reuses the Tree component; both controlled and uncontrolled usage are supported. In multiple mode the panel does not echo selection state — it is shown by the trigger tags.'}
      </p>
    </>
  );
}
