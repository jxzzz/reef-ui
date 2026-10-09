import { Icon } from '@reef-ui/components';
import { ApiTable, Demo } from '../docs-ui';

const allCode = `<Icon name="check" />
<Icon name="close" />
<Icon name="plus" />
<Icon name="search" />`;

const sizeCode = `<Icon name="check" size={12} />
<Icon name="check" size={16} />
<Icon name="check" size={24} />
<Icon name="check" size={32} />`;

const colorCode = `<Icon name="close" size={24} style={{ color: 'var(--reef-color-danger)' }} />
<Icon name="check" size={24} style={{ color: 'var(--reef-color-success)' }} />`;

export function IconPage() {
  return (
    <>
      <h2>Icon 图标</h2>
      <p>内置 SVG 图标，颜色跟随文字颜色（currentColor），默认对屏幕阅读器隐藏。</p>

      <Demo title="全部图标" code={allCode}>
        <div style={{ display: 'flex', gap: 24, fontSize: 20 }}>
          <Icon name="check" size={20} />
          <Icon name="close" size={20} />
          <Icon name="plus" size={20} />
          <Icon name="search" size={20} />
        </div>
      </Demo>

      <Demo title="尺寸" code={sizeCode}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Icon name="check" size={12} />
          <Icon name="check" size={16} />
          <Icon name="check" size={24} />
          <Icon name="check" size={32} />
        </div>
      </Demo>

      <Demo title="颜色" code={colorCode}>
        <div style={{ display: 'flex', gap: 24 }}>
          <Icon name="close" size={24} style={{ color: 'var(--reef-color-danger)' }} />
          <Icon name="check" size={24} style={{ color: 'var(--reef-color-success)' }} />
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['name', '图标名称', "'check' | 'close' | 'plus' | 'search'", '-'],
          ['size', '像素尺寸', 'number', '16'],
          ['decorative', '装饰性图标，设为 false 时暴露给屏幕阅读器', 'boolean', 'true'],
        ]}
      />
      <p>其余属性透传原生 svg 元素，支持 style、className、ref 等。</p>
    </>
  );
}
