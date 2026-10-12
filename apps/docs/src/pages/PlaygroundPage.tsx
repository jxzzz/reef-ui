// Playground：左侧可编辑代码（Prism 高亮夹层），右侧实时预览渲染结果。
// 注册到 App.tsx（主会话统一处理，此处仅留备忘）：
//   import { PlaygroundPage } from './pages/PlaygroundPage';
//   { key: 'playground', title: 'Playground 实时演练', group: '指南', node: <PlaygroundPage />, en: 'Playground' },
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
// React 整个命名空间注入给用户代码（hooks 都挂在上面）
import * as React from 'react';
import * as reef from '@reef-ui/components';
import { Button, Icon } from '@reef-ui/components';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import { transform } from 'sucrase';
import { useChrome, useLang, type Lang } from '../i18n';
import './playground.css';

/** 预置示例：约定不写 import，所有 reef 组件与 React hooks 直接可用 */
const SAMPLE: Record<Lang, string> = {
  zh: `// 约定：不写 import ——
// React（含 useState 等 hooks）与全部 reef 组件均已注入作用域，
// export default 一个组件即可。
export default function Demo() {
  const [on, setOn] = useState(true);
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Switch checked={on} onChange={setOn} />
      <Button variant={on ? 'primary' : 'outline'} onClick={() => setOn(!on)}>
        {on ? '已开启' : '已关闭'}
      </Button>
    </div>
  );
}`,
  en: `// Convention: no imports needed —
// React (incl. hooks) and every reef component are already in scope.
// Just export default a component.
export default function Demo() {
  const [on, setOn] = useState(true);
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Switch checked={on} onChange={setOn} />
      <Button variant={on ? 'primary' : 'outline'} onClick={() => setOn(!on)}>
        {on ? 'Enabled' : 'Disabled'}
      </Button>
    </div>
  );
}`,
};

// 注入作用域的裸名：reef 全部导出（组件直接可用）+ React hooks（useState 等直接可用）
const REEF_NAMES = Object.keys(reef);
const HOOK_NAMES = Object.keys(React).filter((k) => k.startsWith('use') && !REEF_NAMES.includes(k));

/** sucrase 转换 → new Function 执行 → 拿默认导出的组件 */
function compile(src: string, missingMsg: string): React.ComponentType {
  const { code } = transform(src, { transforms: ['typescript', 'jsx', 'imports'], production: true });
  // imports transform 把 export 编译成 CommonJS 赋值：无 import 的用户代码只需注入一个 exports 对象；
  // JSX 走 classic runtime（React.createElement），所以注入 React 即可。
  // 前缀用 var 解构：可重复声明（Icon 同时是入参名），用户代码自己的 const 不会被顶掉
  const prefix = `var { ${REEF_NAMES.join(', ')} } = reef;\nvar { ${HOOK_NAMES.join(', ')} } = React;\n`;
  const run = new Function('React', 'reef', 'Icon', 'exports', `${prefix}${code};return exports.default;`);
  const mod: { default?: unknown } = {};
  const result = run(React, reef, Icon, mod);
  if (typeof result !== 'function') throw new Error(missingMsg);
  return result as React.ComponentType;
}

/** 捕获用户组件渲染期错误：组件引用（resetKey）变化时恢复并重试 */
class PreviewBoundary extends Component<
  { resetKey: unknown; onError: (msg: string) => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(e: unknown) {
    this.props.onError(e instanceof Error ? e.message : String(e));
  }

  componentDidUpdate(prev: { resetKey: unknown }) {
    if (this.state.failed && prev.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function PlaygroundPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  const t = useChrome();
  const [code, setCode] = useState(() => SAMPLE[lang]);
  const [error, setError] = useState<string | null>(null); // 转换/执行错误
  const [renderError, setRenderError] = useState<string | null>(null); // 渲染期错误
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  const [copied, setCopied] = useState(false);
  const gutterRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  // 高亮层：与编辑夹层共用 Prism tsx 语法（与文档代码块同一套 token 配色）
  const highlighted = useMemo(() => {
    const grammar = Prism.languages.tsx ?? Prism.languages.jsx;
    return Prism.highlight(code, grammar, 'tsx');
  }, [code]);

  // 防抖 300ms：停止输入后再转换执行；失败时保留上一次成功渲染的 Comp
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const next = compile(code, zh ? '需要 export default 一个组件' : 'Need a component via export default');
        setComp(() => next);
        setError(null);
        setRenderError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
    }, 300);
    return () => clearTimeout(id);
  }, [code, zh]);

  const reset = () => setCode(SAMPLE[lang]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // textarea 是滚动源：行号列与高亮层跟随同一 scrollTop/scrollLeft
  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (gutterRef.current) gutterRef.current.scrollTop = scrollTop;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
  };

  const shownError = error ?? renderError;
  const lines = code.split('\n').length;

  return (
    <>
      <div className="reef-pg__head">
        <h2>{zh ? 'Playground 实时演练' : 'Playground'}</h2>
        <p>
          {zh
            ? '无需 import：React hooks 与全部 reef 组件已注入作用域，export default 一个组件即可实时预览。'
            : 'No imports needed: React hooks and every reef component are in scope — export default a component to preview it live.'}
        </p>
      </div>

      <div className="reef-pg">
        <section className="reef-pg__pane">
          <div className="reef-pg__toolbar">
            <Icon name="code" size={14} />
            <span className="reef-pg__hint">TSX</span>
            <span className="reef-pg__spacer" />
            <Button size="small" variant="ghost" icon={<Icon name="refresh" size={14} />} onClick={reset}>
              {zh ? '重置' : 'Reset'}
            </Button>
            <Button size="small" variant="ghost" icon={<Icon name="copy" size={14} />} onClick={copy}>
              {copied ? t.copied : t.copy}
            </Button>
          </div>
          <div className="reef-pg__editor">
            <div className="reef-pg__gutter" ref={gutterRef} aria-hidden="true">
              {Array.from({ length: lines }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <div className="reef-pg__stack">
              {/* 高亮层在下、textarea 在上：文字透明只留光标，透出下层的 Prism 着色 */}
              <pre className="reef-pg__highlight" ref={highlightRef} aria-hidden="true">
                <code dangerouslySetInnerHTML={{ __html: highlighted }} />
              </pre>
              <textarea
                className="reef-pg__code"
                value={code}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                aria-label={zh ? '示例代码编辑区' : 'Example code editor'}
                onChange={(e) => setCode(e.target.value)}
                onScroll={syncScroll}
              />
            </div>
          </div>
        </section>

        <section className="reef-pg__pane reef-pg__pane--preview">
          <div className="reef-pg__toolbar">
            <Icon name="eye" size={14} />
            <span className="reef-pg__hint">{zh ? '预览' : 'Preview'}</span>
          </div>
          {shownError ? (
            <div className="reef-pg__error" role="alert">
              {shownError}
            </div>
          ) : null}
          <div className="reef-pg__stage">
            <PreviewBoundary resetKey={Comp} onError={setRenderError}>
              {Comp ? <Comp /> : null}
            </PreviewBoundary>
          </div>
        </section>
      </div>
    </>
  );
}
