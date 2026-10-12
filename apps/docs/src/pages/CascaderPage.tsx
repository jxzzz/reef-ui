import { useState } from 'react';
import { Cascader } from '@reef-ui/components';
import type { CascaderOption } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const regionOptionsCode = {
  zh: `const regionOptions = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '滨江区', value: 'binjiang' },
        ],
      },
    ],
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      {
        label: '南京',
        value: 'nanjing',
        children: [{ label: '玄武区', value: 'xuanwu' }],
      },
    ],
  },
];`,
  en: `const regionOptions = [
  {
    label: 'Zhejiang',
    value: 'zhejiang',
    children: [
      {
        label: 'Hangzhou',
        value: 'hangzhou',
        children: [
          { label: 'Xihu', value: 'xihu' },
          { label: 'Binjiang', value: 'binjiang' },
        ],
      },
    ],
  },
  {
    label: 'Jiangsu',
    value: 'jiangsu',
    children: [
      {
        label: 'Nanjing',
        value: 'nanjing',
        children: [{ label: 'Xuanwu', value: 'xuanwu' }],
      },
    ],
  },
];`,
};

const basicCode: Record<Lang, string> = {
  zh: `${regionOptionsCode.zh}
const [region, setRegion] = useState<string[]>([]);
<Cascader options={regionOptions} value={region} onChange={setRegion} />
<span>当前值：{region.join(' / ') || '-'}</span>`,
  en: `${regionOptionsCode.en}
const [region, setRegion] = useState<string[]>([]);
<Cascader options={regionOptions} value={region} onChange={setRegion} />
<span>Current: {region.join(' / ') || '-'}</span>`,
};

const disabledCode: Record<Lang, string> = {
  zh: `${regionOptionsCode.zh}
const disabledOptions = [
  ...regionOptions,
  { label: '台湾', value: 'taiwan', disabled: true, children: [{ label: '台北', value: 'taipei' }] },
];
<Cascader options={disabledOptions} placeholder="带禁用项" />`,
  en: `${regionOptionsCode.en}
const disabledOptions = [
  ...regionOptions,
  { label: 'Taiwan', value: 'taiwan', disabled: true, children: [{ label: 'Taipei', value: 'taipei' }] },
];
<Cascader options={disabledOptions} placeholder="With disabled option" />`,
};

export function CascaderPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [region, setRegion] = useState<string[]>([]);

  const regionOptions: CascaderOption[] = zh
    ? [
        {
          label: '浙江',
          value: 'zhejiang',
          children: [
            {
              label: '杭州',
              value: 'hangzhou',
              children: [
                { label: '西湖区', value: 'xihu' },
                { label: '滨江区', value: 'binjiang' },
              ],
            },
          ],
        },
        {
          label: '江苏',
          value: 'jiangsu',
          children: [
            {
              label: '南京',
              value: 'nanjing',
              children: [{ label: '玄武区', value: 'xuanwu' }],
            },
          ],
        },
      ]
    : [
        {
          label: 'Zhejiang',
          value: 'zhejiang',
          children: [
            {
              label: 'Hangzhou',
              value: 'hangzhou',
              children: [
                { label: 'Xihu', value: 'xihu' },
                { label: 'Binjiang', value: 'binjiang' },
              ],
            },
          ],
        },
        {
          label: 'Jiangsu',
          value: 'jiangsu',
          children: [
            {
              label: 'Nanjing',
              value: 'nanjing',
              children: [{ label: 'Xuanwu', value: 'xuanwu' }],
            },
          ],
        },
      ];

  const disabledOptions: CascaderOption[] = [
    ...regionOptions,
    zh
      ? { label: '台湾', value: 'taiwan', disabled: true, children: [{ label: '台北', value: 'taipei' }] }
      : { label: 'Taiwan', value: 'taiwan', disabled: true, children: [{ label: 'Taipei', value: 'taipei' }] },
  ];

  return (
    <>
      <ComponentHeader group="数据录入" title={zh ? 'Cascader 级联选择' : 'Cascader'}>
        {zh ? (
          <>
            级联选择省市区等有层级关系的数据。面板为多列并排，点选有子级的项展开下一列，
            点到叶子完成选择并抛出完整路径；支持键盘操作（Enter / 空格打开，上下键移动，
            Enter 选中，Esc 关闭）。
          </>
        ) : (
          <>
            Select from hierarchical data such as region pickers. The panel shows columns side by
            side: clicking an option with children expands the next column, and clicking a leaf
            finishes the selection with the full path. Supports keyboard operation (Enter / Space
            to open, arrow keys to move, Enter to select, Esc to close).
          </>
        )}
      </ComponentHeader>

      <Demo title={zh ? '省市区三级行政区划' : 'Province / city / district'} code={zh ? basicCode.zh : basicCode.en}>
        <Cascader options={regionOptions} value={region} onChange={setRegion} />
        <span>
          {zh ? `当前值：${region.join(' / ') || '-'}` : `Current: ${region.join(' / ') || '-'}`}
        </span>
      </Demo>

      <Demo title={zh ? '带 disabled 选项' : 'With disabled option'} code={zh ? disabledCode.zh : disabledCode.en}>
        <Cascader options={disabledOptions} placeholder={zh ? '带禁用项' : 'With disabled option'} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['options', zh ? '选项数组 { label, value, children?, disabled? }' : 'Array of options { label, value, children?, disabled? }', 'CascaderOption[]', '-'],
          ['value', zh ? '选中路径（受控）' : 'Selected path (controlled)', 'string[]', '-'],
          ['defaultValue', zh ? '默认路径（非受控）' : 'Default path (uncontrolled)', 'string[]', '-'],
          ['onChange', zh ? '选中叶子回调 (path)' : 'Called when a leaf is selected (path)', '(path: string[]) => void', '-'],
          ['placeholder', zh ? '占位文字' : 'Placeholder text', 'string', zh ? '"请选择"（随语言包）' : '"Select" (locale)'],
          ['size', zh ? '尺寸' : 'Size', "'small' | 'medium' | 'large'", "'medium'"],
          ['block', zh ? '宽度撑满父容器' : 'Fill the parent container width', 'boolean', 'false'],
          ['disabled', zh ? '禁用整只选择器' : 'Disable the whole cascader', 'boolean', 'false'],
        ]}
      />

      <TypeBlock
        code={`interface CascaderOption {
  label: string;
  value: string;
  children?: CascaderOption[];
  disabled?: boolean;
}`}
      />
      <p>
        {zh
          ? '支持受控与非受控两种用法；disabled 选项不可展开也不可选中。'
          : 'Supports both controlled and uncontrolled usage; disabled options can be neither expanded nor selected.'}
      </p>
    </>
  );
}
