import { useState, type ReactNode } from 'react';
import { Icon } from '@reef-ui/components';

/** 搜索输入框：放大镜前缀、清空按钮、Esc 清空 */
export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="search-input">
      <Icon name="search" size={14} className="search-input__icon" />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onChange('');
        }}
      />
      {value && (
        <button type="button" className="search-input__clear" aria-label="清空" onClick={() => onChange('')}>
          <Icon name="close" size={10} />
        </button>
      )}
    </div>
  );
}

/** 可复制、可折叠（默认收起）的代码块：操作栏在下方，代码展开时追加在操作栏之后 */
export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="code-block">
      {/* grid 0fr→1fr 过渡实现平滑的高度展开/收起，组件保持挂载 */}
      <div className={expanded ? 'code-block__reveal code-block__reveal--open' : 'code-block__reveal'}>
        <div className="code-block__clip">
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      </div>
      <div className="code-block__actions">
        <button className="code-block__btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? '收起代码' : '展开代码'}
        </button>
        <button className="code-block__btn" onClick={copy}>
          {copied ? '已复制' : '复制'}
        </button>
      </div>
    </div>
  );
}

/** demo 容器：标题 + live 预览 + 源码 */
export function Demo({ title, code, children }: { title: string; code: string; children: ReactNode }) {
  return (
    <section className="demo">
      <h3 className="demo__title">{title}</h3>
      <div className="demo__preview">{children}</div>
      <CodeBlock code={code} />
    </section>
  );
}

/** 组件 API 表格：[属性, 说明, 类型, 默认值] */
export function ApiTable({ rows }: { rows: Array<[string, string, string, string]> }) {
  return (
    <table className="api">
      <thead>
        <tr>
          <th>属性</th>
          <th>说明</th>
          <th>类型</th>
          <th>默认值</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, desc, type, def]) => (
          <tr key={name}>
            <td>
              <code>{name}</code>
            </td>
            <td>{desc}</td>
            <td>
              <code>{type}</code>
            </td>
            <td>{def}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
