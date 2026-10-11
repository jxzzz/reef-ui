import { Steps, type StepsItem } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `const stepsItems: StepsItem[] = [
  { key: 'info', title: '填写信息', description: '基本信息' },
  { key: 'confirm', title: '确认订单' },
  { key: 'pay', title: '支付' },
];
<Steps defaultCurrent={1} items={stepsItems} />`,
  en: `const stepsItems: StepsItem[] = [
  { key: 'info', title: 'Fill in information', description: 'Basic info' },
  { key: 'confirm', title: 'Confirm order' },
  { key: 'pay', title: 'Pay' },
];
<Steps defaultCurrent={1} items={stepsItems} />`,
};

const clickableCode = `<Steps
  defaultCurrent={0}
  onChange={(index) => console.log(index)}
  items={stepsItems}
/>`;

export function StepsPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const stepsItems: StepsItem[] = zh
    ? [
        { key: 'info', title: '填写信息', description: '基本信息' },
        { key: 'confirm', title: '确认订单' },
        { key: 'pay', title: '支付' },
      ]
    : [
        { key: 'info', title: 'Fill in information', description: 'Basic info' },
        { key: 'confirm', title: 'Confirm order' },
        { key: 'pay', title: 'Pay' },
      ];
  return (
    <>
      <ComponentHeader group="导航" title={zh ? 'Steps 步骤条' : 'Steps'}>
        {zh
          ? '引导用户按流程完成任务的导航，提供 onChange 时可点击跳转。'
          : 'Navigation that guides users through a task workflow; steps become clickable when onChange is provided.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Steps defaultCurrent={1} items={stepsItems} />
      </Demo>

      <Demo title={zh ? '可点击' : 'Clickable'} code={clickableCode}>
        <Steps defaultCurrent={0} onChange={(index) => console.log(index)} items={stepsItems} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', zh ? '步骤配置 { key, title, description? }' : 'Step configuration { key, title, description? }', 'StepsItem[]', zh ? '必填' : 'Required'],
          ['current / defaultCurrent', zh ? '当前步骤索引（从 0 开始）' : 'Current step index (0-based)', 'number', '0'],
          ['onChange', zh ? '点击步骤回调（提供后可点击）' : 'Called when a step is clicked (steps become clickable when provided)', '(index: number) => void', '—'],
        ]}
      />

      <TypeBlock
        code={`interface StepsItem {
  key: string;
  title: ReactNode;
  description?: ReactNode;
}`}
      />
    </>
  );
}
