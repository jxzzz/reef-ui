import { useState, type ReactNode } from 'react';

/** 可复制的代码块 */
export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="code-block">
      <button className="code-block__copy" onClick={copy}>
        {copied ? '已复制' : '复制'}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
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
