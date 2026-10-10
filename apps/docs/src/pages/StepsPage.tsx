import { Steps } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Steps
  defaultCurrent={1}
  items={[
    { key: 'info', title: '填写信息', description: '基本信息' },
    { key: 'confirm', title: '确认订单' },
    { key: 'pay', title: '支付' },
  ]}
/>`;

const clickableCode = `<Steps
  defaultCurrent={0}
  onChange={(index) => console.log(index)}
  items={[/* 同上 */]}
/>`;

const stepsItems = [
  { key: 'info', title: '填写信息', description: '基本信息' },
  { key: 'confirm', title: '确认订单' },
  { key: 'pay', title: '支付' },
];

export function StepsPage() {
  return (
    <>
      <h2>Steps 步骤条</h2>
      <p>引导用户按流程完成任务的导航，提供 onChange 时可点击跳转。</p>

      <Demo title="基础用法" code={basicCode}>
        <Steps defaultCurrent={1} items={stepsItems} />
      </Demo>

      <Demo title="可点击" code={clickableCode}>
        <Steps defaultCurrent={0} onChange={() => {}} items={stepsItems} />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['items', '步骤配置', 'StepsItem[]', '必填'],
          ['current / defaultCurrent', '当前步骤索引（从 0 开始）', 'number', '0'],
          ['onChange', '点击步骤回调（提供后可点击）', '(index: number) => void', '—'],
        ]}
      />
    </>
  );
}
