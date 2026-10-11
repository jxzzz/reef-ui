import { useState } from 'react';
import { ICON_NAMES, Icon, type IconName } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, SearchInput } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const sizeCode = `<Icon name="check" size={12} />
<Icon name="check" size={16} />
<Icon name="check" size={24} />
<Icon name="check" size={32} />`;

const colorCode = `<Icon name="close" size={24} style={{ color: 'var(--reef-color-danger)' }} />
<Icon name="check" size={24} style={{ color: 'var(--reef-color-success)' }} />`;

export function IconPage() {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState('');
  const { lang } = useLang();
  const zh = lang === 'zh';

  const names = ICON_NAMES.filter((n) => n.includes(query.trim().toLowerCase()));

  const copy = async (name: string) => {
    await navigator.clipboard.writeText(`<Icon name="${name}" />`);
    setCopied(name);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <>
      <ComponentHeader group="资源" title={zh ? 'Icon 图标' : 'Icon'}>
        {zh
          ? '内置 SVG 图标，颜色跟随文字颜色（currentColor），默认对屏幕阅读器隐藏。点击图标即可复制使用代码。'
          : 'Built-in SVG icons colored by the surrounding text (currentColor) and hidden from screen readers by default. Click an icon to copy its usage code.'}
      </ComponentHeader>

      <div className="icon-picker">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={zh ? `搜索 ${ICON_NAMES.length} 个图标…` : `Search ${ICON_NAMES.length} icons…`}
        />
        <div className="icon-grid">
          {names.map((name) => (
            <button
              key={name}
              type="button"
              className="icon-cell"
              title={copied === name ? (zh ? '已复制' : 'Copied') : `<Icon name="${name}" />`}
              onClick={() => copy(name)}
            >
              <Icon name={name as IconName} size={20} />
              <span>{copied === name ? (zh ? '已复制' : 'Copied') : name}</span>
            </button>
          ))}
        </div>
        {names.length === 0 && <p className="docs__empty">{zh ? '没有匹配的图标' : 'No matching icons'}</p>}
      </div>

      <Demo title={zh ? '尺寸' : 'Sizes'} code={sizeCode}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Icon name="check" size={12} />
          <Icon name="check" size={16} />
          <Icon name="check" size={24} />
          <Icon name="check" size={32} />
        </div>
      </Demo>

      <Demo title={zh ? '颜色' : 'Colors'} code={colorCode}>
        <div style={{ display: 'flex', gap: 24 }}>
          <Icon name="close" size={24} style={{ color: 'var(--reef-color-danger)' }} />
          <Icon name="check" size={24} style={{ color: 'var(--reef-color-success)' }} />
        </div>
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['name', (zh ? '图标名称，共 ' : 'Icon name; ') + ICON_NAMES.length + (zh ? ' 个，见上方图标库' : ' in total, see the library above'), 'IconName', zh ? '必填' : 'Required'],
          ['size', zh ? '像素尺寸' : 'Size in pixels', 'number', '16'],
          ['decorative', zh ? '装饰性图标，设为 false 时暴露给屏幕阅读器' : 'Decorative icon; set to false to expose it to screen readers', 'boolean', 'true'],
        ]}
      />
      <p>
        {zh
          ? '其余属性透传原生 svg 元素，支持 style、className、ref 等。'
          : 'All other props are passed through to the native svg element, including style, className, ref, and more.'}
      </p>
    </>
  );
}
