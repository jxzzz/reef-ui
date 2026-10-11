import { useState } from 'react';
import { Button, Icon } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`,
  en: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`,
};

const sizeCode: Record<Lang, string> = {
  zh: `<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>`,
  en: `<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>`,
};

const loadingCode: Record<Lang, string> = {
  zh: `const [loading, setLoading] = useState(false);

<Button loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>
  提交
</Button>`,
  en: `const [loading, setLoading] = useState(false);

<Button loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1500); }}>
  Submit
</Button>`,
};

const iconCode: Record<Lang, string> = {
  zh: `<Button icon={<Icon name="search" />}>搜索</Button>
<Button variant="outline" icon={<Icon name="plus" />} aria-label="添加" />`,
  en: `<Button icon={<Icon name="search" />}>Search</Button>
<Button variant="outline" icon={<Icon name="plus" />} aria-label="Add" />`,
};

export function ButtonPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const [loading, setLoading] = useState(false);

  return (
    <>
      <ComponentHeader group="通用" title={zh ? 'Button 按钮' : 'Button'}>
        {zh ? '用于触发即时操作。支持 5 种类型、3 种尺寸、加载状态和图标。' : 'Triggers an immediate action. Supports 5 variants, 3 sizes, loading state, and icons.'}
      </ComponentHeader>

      <Demo title={zh ? '类型' : 'Variants'} code={zh ? basicCode.zh : basicCode.en}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </Demo>

      <Demo title={zh ? '尺寸' : 'Sizes'} code={zh ? sizeCode.zh : sizeCode.en}>
        <Button size="small">Small</Button>
        <Button size="medium">Medium</Button>
        <Button size="large">Large</Button>
      </Demo>

      <Demo title={zh ? '加载中' : 'Loading'} code={zh ? loadingCode.zh : loadingCode.en}>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 1500);
          }}
        >
          {zh ? '提交' : 'Submit'}
        </Button>
      </Demo>

      <Demo title={zh ? '图标' : 'Icon'} code={zh ? iconCode.zh : iconCode.en}>
        {zh ? (
          <>
            <Button icon={<Icon name="search" />}>搜索</Button>
            <Button variant="outline" icon={<Icon name="plus" />} aria-label="添加" />
          </>
        ) : (
          <>
            <Button icon={<Icon name="search" />}>Search</Button>
            <Button variant="outline" icon={<Icon name="plus" />} aria-label="Add" />
          </>
        )}
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['variant', zh ? '按钮类型' : 'Button variant', "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", "'primary'"],
          ['size', zh ? '按钮尺寸' : 'Button size', "'small' | 'medium' | 'large'", "'medium'"],
          ['loading', zh ? '加载状态，期间禁止点击并显示 spinner' : 'Loading state; clicks are disabled and a spinner is shown', 'boolean', 'false'],
          ['block', zh ? '宽度撑满父容器' : 'Fill the parent container’s width', 'boolean', 'false'],
          ['icon', zh ? '左侧图标' : 'Left icon', 'ReactNode', '-'],
        ]}
      />
      <p>{zh ? '其余属性透传原生 button 元素，支持 disabled、type、ref 等。' : 'All other props are passed through to the native button element, including disabled, type, ref, etc.'}</p>
    </>
  );
}
