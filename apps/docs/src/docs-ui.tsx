import { useMemo, useState, type ReactNode } from 'react';
import { Icon, Input } from '@reef-ui/components';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';

/** 搜索输入框：基于库内 Input（prefix 图标 + clearable），Esc 清空 */
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
    <Input
      block
      clearable
      className="search-input"
      placeholder={placeholder}
      value={value}
      prefix={<Icon name="search" size={14} />}
      onChange={(e) => onChange(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onChange('');
      }}
    />
  );
}

/** 可复制、可折叠（默认收起）的代码块：操作栏在下方，代码展开时追加在操作栏之后 */
export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const html = useMemo(() => Prism.highlight(code, Prism.languages.jsx, 'jsx'), [code]);

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
            {/* Prism 输出的是本组件自己生成的高亮 span，非用户内容 */}
            <code dangerouslySetInnerHTML={{ __html: html }} />
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
