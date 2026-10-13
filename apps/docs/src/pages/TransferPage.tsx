import { useState } from 'react';
import { Transfer, type TransferItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const dataSource: TransferItem[] = [
  { key: 'apple', title: '苹果' },
  { key: 'banana', title: '香蕉' },
  { key: 'cherry', title: '樱桃', disabled: true },
  { key: 'grape', title: '葡萄' },
];

const basicCode: Record<Lang, string> = {
  zh: `const [target, setTarget] = useState<string[]>([]);

<Transfer
  dataSource={dataSource}
  targetKeys={target}
  onChange={(keys) => setTarget(keys)}
/>`,
  en: `const [target, setTarget] = useState<string[]>([]);

<Transfer
  dataSource={dataSource}
  targetKeys={target}
  onChange={(keys) => setTarget(keys)}
/>`,
};

const searchCode: Record<Lang, string> = {
  zh: `<Transfer dataSource={dataSource} searchable />`,
  en: `<Transfer dataSource={dataSource} searchable />`,
};

const titleCode: Record<Lang, string> = {
  zh: `<Transfer
  dataSource={dataSource}
  titles={['备选', '已选']}
  defaultTargetKeys={['apple']}
/>`,
  en: `<Transfer
  dataSource={dataSource}
  titles={['Candidates', 'Selected']}
  defaultTargetKeys={['apple']}
/>`,
};

export function TransferPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [target, setTarget] = useState<string[]>([]);
  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Transfer 穿梭框' : 'Transfer'}>
        {zh
          ? '以列表方式在两组数据间移动元素，常用于将菜单、权限等候选项移入已选集合。'
          : 'Moves items between two lists in columns, commonly used to move candidate items such as menus and permissions into a selected set.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Transfer dataSource={dataSource} targetKeys={target} onChange={setTarget} />
      </Demo>

      <Demo title={zh ? '可搜索' : 'Searchable'} code={zh ? searchCode.zh : searchCode.en}>
        <Transfer dataSource={dataSource} searchable />
      </Demo>

      <Demo title={zh ? '自定义标题与默认已选' : 'Custom titles and default target'} code={zh ? titleCode.zh : titleCode.en}>
        <Transfer
          dataSource={dataSource}
          titles={zh ? ['备选', '已选'] : ['Candidates', 'Selected']}
          defaultTargetKeys={['apple']}
        />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['dataSource', zh ? '数据源' : 'Data source', 'TransferItem[]', zh ? '必填' : 'Required'],
          ['targetKeys', zh ? '受控：已选（右侧）key 列表' : 'Controlled keys on the right panel', 'string[]', '[]'],
          ['defaultTargetKeys', zh ? '非受控：初始已选 key 列表' : 'Uncontrolled initial right-panel keys', 'string[]', '[]'],
          ['onChange', zh ? '移动回调，direction 为移动方向' : 'Fired after moving; direction indicates the move', '(targetKeys, direction, movedKeys) => void', '—'],
          ['titles', zh ? '面板标题 [左, 右]' : 'Panel titles [left, right]', '[ReactNode, ReactNode]', zh ? "['未选择', '已选择']" : "['Unselected', 'Selected']"],
          ['searchable', zh ? '显示搜索框，按 title 过滤' : 'Show per-list search input filtering by title', 'boolean', 'false'],
          ['disabled', zh ? '整体禁用' : 'Disable the whole component', 'boolean', 'false'],
        ]}
      />

      <TypeBlock
        code={`interface TransferItem {
  key: string;
  title: React.ReactNode;
  disabled?: boolean;
}

interface TransferProps {
  dataSource: TransferItem[];
  targetKeys?: string[];
  defaultTargetKeys?: string[];
  onChange?: (targetKeys: string[], direction: 'left' | 'right', movedKeys: string[]) => void;
  titles?: [React.ReactNode, React.ReactNode];
  searchable?: boolean;
  disabled?: boolean;
}`}
      />
    </>
  );
}
