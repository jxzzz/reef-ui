import { Text, Title } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const titleCode: Record<Lang, string> = {
  zh: `<Title level={1}>h1 一级标题</Title>
<Title level={2}>h2 二级标题</Title>
<Title level={3}>h3 三级标题</Title>
<Title level={4}>h4 四级标题</Title>`,
  en: `<Title level={1}>h1 heading</Title>
<Title level={2}>h2 heading</Title>
<Title level={3}>h3 heading</Title>
<Title level={4}>h4 heading</Title>`,
};

const textCode: Record<Lang, string> = {
  zh: `<Text>Primary 文本</Text>
<Text type="secondary">Secondary 文本</Text>
<Text type="success">Success 文本</Text>
<Text type="warning">Warning 文本</Text>
<Text type="danger">Danger 文本</Text>`,
  en: `<Text>Primary text</Text>
<Text type="secondary">Secondary text</Text>
<Text type="success">Success text</Text>
<Text type="warning">Warning text</Text>
<Text type="danger">Danger text</Text>`,
};

export function TypographyPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="资源" title={zh ? 'Typography 排版' : 'Typography'}>
        {zh ? '标题与文本组件，统一字号、行高和语义色。' : 'Heading and text components that unify font size, line height, and semantic colors.'}
      </ComponentHeader>

      <Demo title={zh ? '标题' : 'Heading'} code={zh ? titleCode.zh : titleCode.en}>
        {zh ? (
          <div style={{ display: 'grid', gap: 8 }}>
            <Title level={1}>h1 一级标题</Title>
            <Title level={2}>h2 二级标题</Title>
            <Title level={3}>h3 三级标题</Title>
            <Title level={4}>h4 四级标题</Title>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            <Title level={1}>h1 heading</Title>
            <Title level={2}>h2 heading</Title>
            <Title level={3}>h3 heading</Title>
            <Title level={4}>h4 heading</Title>
          </div>
        )}
      </Demo>

      <Demo title={zh ? '文本' : 'Text'} code={zh ? textCode.zh : textCode.en}>
        {zh ? (
          <div style={{ display: 'grid', gap: 8 }}>
            <Text>Primary 文本</Text>
            <Text type="secondary">Secondary 文本</Text>
            <Text type="success">Success 文本</Text>
            <Text type="warning">Warning 文本</Text>
            <Text type="danger">Danger 文本</Text>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            <Text>Primary text</Text>
            <Text type="secondary">Secondary text</Text>
            <Text type="success">Success text</Text>
            <Text type="warning">Warning text</Text>
            <Text type="danger">Danger text</Text>
          </div>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['Title.level', zh ? '标题层级，渲染为对应 h 标签' : 'Heading level, rendered as the matching h tag', '1 | 2 | 3 | 4', '3'],
          ['Text.type', zh ? '文本语义色' : 'Semantic text color', "'primary' | 'secondary' | 'danger' | 'success' | 'warning'", "'primary'"],
        ]}
      />
      <p>{zh ? '两者均透传原生元素属性，支持 className、style、ref 等。' : 'Both pass through native element props, supporting className, style, ref, and more.'}</p>
    </>
  );
}
