import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Icon, Input } from '@reef-ui/components';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
// prism-tsx 依赖 typescript 语法，须先引入
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import { groupLabel, useChrome, useLang } from './i18n';

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
export function CodeBlock({
  code,
  lang = 'tsx',
  defaultExpanded = false,
}: {
  code: string;
  /** 代码语言，决定语法高亮与标题栏标签 */
  lang?: 'tsx' | 'bash';
  defaultExpanded?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const t = useChrome();

  const html = useMemo(
    // 语法包未注册时回退 jsx，避免 Prism.highlight 抛错
    () => Prism.highlight(code, Prism.languages[lang] ?? Prism.languages.jsx, lang),
    [code, lang],
  );

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="code-block">
      {/* 顶部标题栏：语言标签 + 展开/复制，先于代码区渲染 */}
      <div className="code-block__actions">
        <span className="code-block__lang">{lang.toUpperCase()}</span>
        <button className="code-block__btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? t.collapse : t.expand}
        </button>
        <button className="code-block__btn" onClick={copy}>
          {copied ? t.copied : t.copy}
        </button>
      </div>
      {/* grid 0fr→1fr 过渡实现平滑的高度展开/收起，组件保持挂载 */}
      <div className={expanded ? 'code-block__reveal code-block__reveal--open' : 'code-block__reveal'}>
        <div className="code-block__clip">
          <pre>
            {/* Prism 输出的是本组件自己生成的高亮 span，非用户内容 */}
            <code dangerouslySetInnerHTML={{ __html: html }} />
          </pre>
        </div>
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

/** 组件 API 表格：[属性, 说明, 类型, 默认值]，表头随语言切换 */
export function ApiTable({ rows }: { rows: Array<[string, string, string, string]> }) {
  const t = useChrome();
  return (
    <table className="api">
      <thead>
        <tr>
          <th>{t.prop}</th>
          <th>{t.desc}</th>
          <th>{t.type}</th>
          <th>{t.def}</th>
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

/** 类型定义块：API 表下方直接展示导出自定义类型的 TS 定义（默认展开） */
export function TypeBlock({ code }: { code: string }) {
  const t = useChrome();
  return (
    <section className="type-block">
      <h3 className="demo__title">{t.typeDef}</h3>
      <CodeBlock code={code} defaultExpanded />
    </section>
  );
}

/** 组件页头部：分组眉题（经 groupLabel 双语化）+ 标题 + 导语 */
export function ComponentHeader({ group, title, children }: { group: string; title: string; children?: ReactNode }) {
  const { lang } = useLang();
  return (
    <>
      <p className="docs__eyebrow">{groupLabel(group, lang)}</p>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </>
  );
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** 右侧「本页目录」：从当前页 DOM 提取 h2/h3，滚动高亮当前小节 */
export function Toc({ pageKey }: { pageKey: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState('');
  const t = useChrome();

  useEffect(() => {
    // 切页先清空上一页的目录，否则短页面会残留上一页的条目
    setItems([]);
    setActive('');
    const content = document.querySelector('.docs__content');
    if (!content) return;
    // 内容不足一屏时没有滚动空间，目录没有意义（也点不动），直接不渲染
    if (document.documentElement.scrollHeight <= window.innerHeight + 80) return;
    const heads = Array.from(content.querySelectorAll('h2, h3')) as HTMLHeadingElement[];
    // 首个 h2 是页面标题本身，不进目录
    const outline = heads.filter((h, i) => !(i === 0 && h.tagName === 'H2'));
    outline.forEach((h, i) => {
      if (!h.id) h.id = `sec-${pageKey}-${i}`;
    });
    setItems(outline.map((h) => ({ id: h.id, text: h.textContent ?? '', level: h.tagName === 'H2' ? 2 : 3 })));

    // 滚动高亮：取视口 96px 线以上最近的标题；页底时后面的标题到不了线，直接点亮最后一项
    const onScroll = () => {
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
        setActive(outline[outline.length - 1]?.id ?? '');
        return;
      }
      let current = '';
      for (const h of outline) {
        if (h.getBoundingClientRect().top < 96) current = h.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pageKey]);

  if (items.length === 0) return null;
  return (
    <nav className="docs__toc" aria-label={t.toc}>
      <div className="docs__toc-inner">
        <p className="docs__toc-label">{t.toc}</p>
        <ul>
          {items.map((item) => (
            <li key={item.id} className={item.level === 3 ? 'docs__toc-sub' : undefined}>
              <a
                href={`#${item.id}`}
                className={item.id === active ? 'active' : undefined}
                onClick={(e) => {
                  // hash 被页面路由占用，目录跳转用滚动；先点亮目标，滚动动画中高亮不回跳
                  e.preventDefault();
                  setActive(item.id);
                  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  document.getElementById(item.id)?.scrollIntoView({
                    behavior: reduce ? 'auto' : 'smooth',
                    block: 'start',
                  });
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
