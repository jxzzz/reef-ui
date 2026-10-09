import { Checkbox } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const basicCode = `<Checkbox defaultChecked>选中</Checkbox>
<Checkbox>未选中</Checkbox>
<Checkbox disabled>禁用</Checkbox>`;

const indeterminateCode = `const [all, setAll] = useState(false);

<Checkbox indeterminate={!all}>全选</Checkbox>`;

export function CheckboxPage() {
  return (
    <>
      <h2>Checkbox 复选框</h2>
      <p>在一组选项中选择一个或多个。支持半选态，常用于父级全选场景。</p>

      <Demo title="基础用法" code={basicCode}>
        <Checkbox defaultChecked>选中</Checkbox>
        <Checkbox>未选中</Checkbox>
        <Checkbox disabled>禁用</Checkbox>
      </Demo>

      <Demo title="半选态" code={indeterminateCode}>
        <Checkbox indeterminate>全选</Checkbox>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['indeterminate', '半选态样式，仅控制样式', 'boolean', 'false'],
          ['block', '标签占满整行', 'boolean', 'false'],
        ]}
      />
      <p>其余属性透传原生 checkbox，支持 checked、defaultChecked、disabled、onChange、ref 等。</p>
    </>
  );
}
