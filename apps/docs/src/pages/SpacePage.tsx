import { Button, Space } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Space>
  <Button>开始</Button>
  <Button>暂停</Button>
  <Button>停止</Button>
</Space>
<Space size={32}>
  <Button>自定义间距</Button>
  <Button>32px</Button>
</Space>`,
  en: `<Space>
  <Button>Start</Button>
  <Button>Pause</Button>
  <Button>Stop</Button>
</Space>
<Space size={32}>
  <Button>Custom gap</Button>
  <Button>32px</Button>
</Space>`,
};

const verticalWrapCode: Record<Lang, string> = {
  zh: `<Space direction="vertical" size="large">
  <Button>第一步</Button>
  <Button>第二步</Button>
  <Button>第三步</Button>
</Space>
<Space wrap>
  <Button>礁石</Button>
  <Button>海浪</Button>
  <Button>珊瑚</Button>
  <Button>灯塔</Button>
  <Button>贝壳</Button>
  <Button>海星</Button>
  <Button>水母</Button>
  <Button>海鸥</Button>
</Space>`,
  en: `<Space direction="vertical" size="large">
  <Button>Step 1</Button>
  <Button>Step 2</Button>
  <Button>Step 3</Button>
</Space>
<Space wrap>
  <Button>Rock</Button>
  <Button>Wave</Button>
  <Button>Coral</Button>
  <Button>Lighthouse</Button>
  <Button>Shell</Button>
  <Button>Starfish</Button>
  <Button>Jellyfish</Button>
  <Button>Seagull</Button>
</Space>`,
};

export function SpacePage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="通用" title={zh ? 'Space 间距' : 'Space'}>
        {zh ? '用 flex gap 布置子元素之间的间距，支持水平与垂直方向。' : 'Lays out children with flex gap, horizontally or vertically.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        {zh ? (
          <>
            <Space>
              <Button>开始</Button>
              <Button>暂停</Button>
              <Button>停止</Button>
            </Space>
            <Space size={32}>
              <Button>自定义间距</Button>
              <Button>32px</Button>
            </Space>
          </>
        ) : (
          <>
            <Space>
              <Button>Start</Button>
              <Button>Pause</Button>
              <Button>Stop</Button>
            </Space>
            <Space size={32}>
              <Button>Custom gap</Button>
              <Button>32px</Button>
            </Space>
          </>
        )}
      </Demo>

      <Demo title={zh ? '垂直与换行' : 'Vertical and wrap'} code={zh ? verticalWrapCode.zh : verticalWrapCode.en}>
        {zh ? (
          <>
            <Space direction="vertical" size="large">
              <Button>第一步</Button>
              <Button>第二步</Button>
              <Button>第三步</Button>
            </Space>
            <Space wrap>
              <Button>礁石</Button>
              <Button>海浪</Button>
              <Button>珊瑚</Button>
              <Button>灯塔</Button>
              <Button>贝壳</Button>
              <Button>海星</Button>
              <Button>水母</Button>
              <Button>海鸥</Button>
            </Space>
          </>
        ) : (
          <>
            <Space direction="vertical" size="large">
              <Button>Step 1</Button>
              <Button>Step 2</Button>
              <Button>Step 3</Button>
            </Space>
            <Space wrap>
              <Button>Rock</Button>
              <Button>Wave</Button>
              <Button>Coral</Button>
              <Button>Lighthouse</Button>
              <Button>Shell</Button>
              <Button>Starfish</Button>
              <Button>Jellyfish</Button>
              <Button>Seagull</Button>
            </Space>
          </>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['direction', zh ? '排列方向' : 'Layout direction', "'vertical' | 'horizontal'", "'horizontal'"],
          ['size', zh ? '间距尺寸，数字为自定义 px' : 'Gap size; number is custom px', "'small' | 'medium' | 'large' | number", "'medium'"],
          ['wrap', zh ? '是否自动换行' : 'Whether to wrap', 'boolean', 'false'],
          ['align', zh ? '交叉轴对齐方式，不设置走 stretch' : 'Cross-axis alignment; unset means stretch', "'start' | 'center' | 'end' | 'baseline'", '—'],
        ]}
      />
    </>
  );
}
