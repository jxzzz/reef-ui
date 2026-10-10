import { useState } from 'react';
import { ICON_NAMES, Icon, type IconName } from '@reef-ui/components';
import { ApiTable, Demo, SearchInput } from '../docs-ui';

const sizeCode = `<Icon name="check" size={12} />
<Icon name="check" size={16} />
<Icon name="check" size={24} />
<Icon name="check" size={32} />`;

const colorCode = `<Icon name="close" size={24} style={{ color: 'var(--reef-color-danger)' }} />
<Icon name="check" size={24} style={{ color: 'var(--reef-color-success)' }} />`;

export function IconPage() {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState('');

  const names = ICON_NAMES.filter((n) => n.includes(query.trim().toLowerCase()));

  const copy = async (name: string) => {
    await navigator.clipboard.writeText(`<Icon name="${name}" />`);
    setCopied(name);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <>
      <h2>Icon 图标</h2>
      <p>内置 SVG 图标，颜色跟随文字颜色（currentColor），默认对屏幕阅读器隐藏。点击图标即可复制使用代码。</p>

      <div className="icon-picker">
        <SearchInput value={query} onChange={setQuery} placeholder={`搜索 ${ICON_NAMES.length} 个图标…`} />
        <div className="icon-grid">
          {names.map((name) => (
            <button
              key={name}
              type="button"
              className="icon-cell"
              title={copied === name ? '已复制' : `<Icon name="${name}" />`}
              onClick={() => copy(name)}
            >
              <Icon name={name as IconName} size={20} />
              <span>{copied === name ? '已复制' : name}</span>
            </button>
          ))}
        </div>
        {names.length === 0 && <p className="docs__empty">没有匹配的图标</p>}
      </div>

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
          ['name', '图标名称，共 ' + ICON_NAMES.length + ' 个，见上方图标库', 'IconName', '必填'],
          ['size', '像素尺寸', 'number', '16'],
          ['decorative', '装饰性图标，设为 false 时暴露给屏幕阅读器', 'boolean', 'true'],
        ]}
      />
      <p>其余属性透传原生 svg 元素，支持 style、className、ref 等。</p>
    </>
  );
}
