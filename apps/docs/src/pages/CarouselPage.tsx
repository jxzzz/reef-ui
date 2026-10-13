import { useState } from 'react';
import { Carousel } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Carousel>
  <div>幻灯片一</div>
  <div>幻灯片二</div>
  <div>幻灯片三</div>
</Carousel>`,
  en: `<Carousel>
  <div>Slide one</div>
  <div>Slide two</div>
  <div>Slide three</div>
</Carousel>`,
};

const autoplayCode: Record<Lang, string> = {
  zh: `<Carousel autoplay interval={3000} arrows>
  <div>幻灯片一</div>
  <div>幻灯片二</div>
  <div>幻灯片三</div>
</Carousel>`,
  en: `<Carousel autoplay interval={3000} arrows>
  <div>Slide one</div>
  <div>Slide two</div>
  <div>Slide three</div>
</Carousel>`,
};

function Slide({ text, color }: { text: string; color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 160,
        borderRadius: 8,
        background: color,
        color: '#fff',
        fontSize: 18,
      }}
    >
      {text}
    </div>
  );
}

export function CarouselPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [index, setIndex] = useState(0);

  const slides = [
    <Slide key="1" text={zh ? '幻灯片一' : 'Slide one'} color="#2563eb" />,
    <Slide key="2" text={zh ? '幻灯片二' : 'Slide two'} color="#16a34a" />,
    <Slide key="3" text={zh ? '幻灯片三' : 'Slide three'} color="#f59e0b" />,
  ];

  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Carousel 走马灯' : 'Carousel'}>
        {zh
          ? '轮播展示一组内容，支持自动播放、指示点与左右箭头切换。'
          : 'Rotates content in sequence, with autoplay, dots, and arrow navigation.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Carousel>{slides}</Carousel>
      </Demo>

      <Demo title={zh ? '自动播放与箭头' : 'Autoplay and arrows'} code={zh ? autoplayCode.zh : autoplayCode.en}>
        <Carousel autoplay interval={3000} arrows>
          {slides}
        </Carousel>
      </Demo>

      <Demo
        title={zh ? '受控模式' : 'Controlled'}
        code={
          zh
            ? `const [index, setIndex] = useState(0);
<Carousel activeIndex={index} onChange={setIndex}>...</Carousel>`
            : `const [index, setIndex] = useState(0);
<Carousel activeIndex={index} onChange={setIndex}>...</Carousel>`
        }
      >
        <p>
          {zh ? '当前：' : 'Current: '}
          {index + 1}
        </p>
        <Carousel activeIndex={index} onChange={setIndex}>
          {slides}
        </Carousel>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['children', zh ? '幻灯片内容，每个子元素一张' : 'Slides, one per child', 'ReactNode', zh ? '必填' : 'Required'],
          ['autoplay', zh ? '自动播放' : 'Autoplay', 'boolean', 'false'],
          ['interval', zh ? '自动播放间隔（毫秒）' : 'Autoplay interval (ms)', 'number', '3000'],
          ['arrows', zh ? '显示左右箭头' : 'Show prev/next arrows', 'boolean', 'false'],
          ['dots', zh ? '显示指示点' : 'Show dots', 'boolean', 'true'],
          ['activeIndex / defaultActiveIndex', zh ? '当前索引' : 'Current index', 'number', '0'],
          ['onChange', zh ? '切换回调' : 'Callback on change', '(index: number) => void', '—'],
          ['pauseOnHover', zh ? '悬停时暂停自动播放' : 'Pause autoplay on hover', 'boolean', 'true'],
        ]}
      />

      <TypeBlock
        code={`interface CarouselProps {
  children: ReactNode;
  autoplay?: boolean;
  interval?: number;
  arrows?: boolean;
  dots?: boolean;
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?: (index: number) => void;
  pauseOnHover?: boolean;
}`}
      />
    </>
  );
}
