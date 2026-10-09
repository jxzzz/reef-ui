import { Text, Title } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const titleCode = `<Title level={1}>h1 一级标题</Title>
<Title level={2}>h2 二级标题</Title>
<Title level={3}>h3 三级标题</Title>
<Title level={4}>h4 四级标题</Title>`;

const textCode = `<Text>Primary 文本</Text>
<Text type="secondary">Secondary 文本</Text>
<Text type="success">Success 文本</Text>
<Text type="warning">Warning 文本</Text>
<Text type="danger">Danger 文本</Text>`;

export function TypographyPage() {
  return (
    <>
      <h2>Typography 排版</h2>
      <p>标题与文本组件，统一字号、行高和语义色。</p>

      <Demo title="标题" code={titleCode}>
        <div style={{ display: 'grid', gap: 8 }}>
          <Title level={1}>h1 一级标题</Title>
          <Title level={2}>h2 二级标题</Title>
          <Title level={3}>h3 三级标题</Title>
          <Title level={4}>h4 四级标题</Title>
        </div>
      </Demo>

      <Demo title="文本" code={textCode}>
        <div style={{ display: 'grid', gap: 8 }}>
          <Text>Primary 文本</Text>
          <Text type="secondary">Secondary 文本</Text>
          <Text type="success">Success 文本</Text>
          <Text type="warning">Warning 文本</Text>
          <Text type="danger">Danger 文本</Text>
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['Title.level', '标题层级，渲染为对应 h 标签', '1 | 2 | 3 | 4', '3'],
          ['Text.type', '文本语义色', "'primary' | 'secondary' | 'danger' | 'success' | 'warning'", "'primary'"],
        ]}
      />
      <p>两者均透传原生元素属性，支持 className、style、ref 等。</p>
    </>
  );
}
