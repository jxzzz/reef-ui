import { useState } from 'react';
import { Button, Dropdown } from '@reef-ui/components';
import type { DropdownItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const actionsCode = {
  zh: `const actions = [
  { key: 'edit', label: '编辑' },
  { key: 'copy', label: '复制' },
  { key: 'd1', label: '', type: 'divider' },
  { key: 'delete', label: '删除', danger: true },
];`,
  en: `const actions = [
  { key: 'edit', label: 'Edit' },
  { key: 'copy', label: 'Copy' },
  { key: 'd1', label: '', type: 'divider' },
  { key: 'delete', label: 'Delete', danger: true },
];`,
};

const basicCode: Record<Lang, string> = {
  zh: `const [last, setLast] = useState('');
${actionsCode.zh}
<Dropdown items={actions} onItemClick={setLast}>
  <Button>操作</Button>
</Dropdown>
<span>最后操作：{last || '-'}</span>`,
  en: `const [last, setLast] = useState('');
${actionsCode.en}
<Dropdown items={actions} onItemClick={setLast}>
  <Button>Actions</Button>
</Dropdown>
<span>Last action: {last || '-'}</span>`,
};

const hoverCode: Record<Lang, string> = {
  zh: `${actionsCode.zh}
<Dropdown items={actions} trigger="hover">
  <Button>悬停展开</Button>
</Dropdown>`,
  en: `${actionsCode.en}
<Dropdown items={actions} trigger="hover">
  <Button>Hover me</Button>
</Dropdown>`,
};

export function DropdownPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [last, setLast] = useState('');

  const actions: DropdownItem[] = zh
    ? [
        { key: 'edit', label: '编辑' },
        { key: 'copy', label: '复制' },
        { key: 'd1', label: '', type: 'divider' },
        { key: 'delete', label: '删除', danger: true },
      ]
    : [
        { key: 'edit', label: 'Edit' },
        { key: 'copy', label: 'Copy' },
        { key: 'd1', label: '', type: 'divider' },
        { key: 'delete', label: 'Delete', danger: true },
      ];

  return (
    <>
      <ComponentHeader group="导航" title={zh ? 'Dropdown 下拉菜单' : 'Dropdown'}>
        {zh ? (
          <>
            点击或悬停触发器展开菜单列表。danger 项红色、divider 渲染分隔线；支持键盘操作
            （上下键移动高亮，Enter 激活，Esc 关闭）。
          </>
        ) : (
          <>
            Click or hover the trigger to expand a menu list. Danger items render in red and
            dividers render as separators; supports keyboard operation (arrow keys to move, Enter to
            activate, Esc to close).
          </>
        )}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <>
            <Dropdown items={actions} onItemClick={setLast}>
              <Button>操作</Button>
            </Dropdown>
            <span>最后操作：{last || '-'}</span>
          </>
        ) : (
          <>
            <Dropdown items={actions} onItemClick={setLast}>
              <Button>Actions</Button>
            </Dropdown>
            <span>Last action: {last || '-'}</span>
          </>
        )}
      </Demo>

      <Demo title={zh ? 'hover 触发' : 'Hover trigger'} code={zh ? hoverCode.zh : hoverCode.en}>
        {zh ? (
          <Dropdown items={actions} trigger="hover">
            <Button>悬停展开</Button>
          </Dropdown>
        ) : (
          <Dropdown items={actions} trigger="hover">
            <Button>Hover me</Button>
          </Dropdown>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', zh ? '菜单项数组' : 'Array of menu items', 'DropdownItem[]', '-'],
          [
            'onItemClick',
            zh ? '点击菜单项回调 (key)，disabled 项不触发' : 'Called when an item is clicked (key); disabled items never fire',
            '(key: string) => void',
            '-',
          ],
          ['trigger', zh ? '触发方式' : 'Trigger mode', "'click' | 'hover'", "'click'"],
          ['open', zh ? '是否展开（受控）' : 'Whether the menu is open (controlled)', 'boolean', '-'],
          ['defaultOpen', zh ? '默认是否展开（非受控）' : 'Open by default (uncontrolled)', 'boolean', 'false'],
          ['placement', zh ? '菜单对齐方向' : 'Menu alignment', "'bottom-start' | 'bottom-end'", "'bottom-start'"],
          ['disabled', zh ? '禁用整个下拉' : 'Disable the whole dropdown', 'boolean', 'false'],
        ]}
      />

      <TypeBlock
        code={`interface DropdownItem {
  key: string;
  label: string;
  disabled?: boolean;
  danger?: boolean;
  type?: 'item' | 'divider';
}`}
      />
      <p>
        {zh
          ? '支持受控与非受控两种用法；hover 触发模式不支持受控 open。children 为触发器内容，菜单项点击后自动关闭（受控时除外）。'
          : 'Supports both controlled and uncontrolled usage; hover trigger mode does not support controlled open. children is the trigger content; the menu closes automatically after an item is clicked (except when controlled).'}
      </p>
    </>
  );
}
