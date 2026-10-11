import { createContext, useContext, useState, type ReactNode } from 'react';

export type Lang = 'zh' | 'en';

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'zh',
  setLang: () => {},
});

const STORAGE_KEY = 'reef-docs-lang';

function initialLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // 私密窗口等场景下存不了就只保留会话内状态
    }
  };
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

// 侧栏分组名的双语映射（分组是闭集，页面 group 字段仍写中文，渲染时按语言取）
const groups: Record<string, { zh: string; en: string }> = {
  指南: { zh: '指南', en: 'Guide' },
  资源: { zh: '资源', en: 'Resources' },
  通用: { zh: '通用', en: 'General' },
  数据录入: { zh: '数据录入', en: 'Data Entry' },
  数据展示: { zh: '数据展示', en: 'Data Display' },
  反馈: { zh: '反馈', en: 'Feedback' },
  导航: { zh: '导航', en: 'Navigation' },
};

export function groupLabel(zhGroup: string, lang: Lang): string {
  return groups[zhGroup]?.[lang] ?? zhGroup;
}

/** 文档站界面固定文案（组件页里的内容文案在各页面文件内自行双语） */
const chrome = {
  zh: {
    search: '搜索组件…',
    noMatch: '没有匹配的组件',
    toc: '本页目录',
    pager: '组件翻页',
    prev: '← 上一个',
    next: '下一个 →',
    prop: '属性',
    desc: '说明',
    type: '类型',
    def: '默认值',
    typeDef: '类型定义',
    expand: '展开代码',
    collapse: '收起代码',
    copied: '已复制',
    copy: '复制',
    required: '必填',
    none: '—',
    langToggleAria: 'Switch to English',
  },
  en: {
    search: 'Search components…',
    noMatch: 'No matching components',
    toc: 'On this page',
    pager: 'Component pager',
    prev: '← Previous',
    next: 'Next →',
    prop: 'Prop',
    desc: 'Description',
    type: 'Type',
    def: 'Default',
    typeDef: 'Type Definition',
    expand: 'Expand code',
    collapse: 'Collapse code',
    copied: 'Copied',
    copy: 'Copy',
    required: 'Required',
    none: '—',
    langToggleAria: '切换到中文',
  },
};

export type Chrome = (typeof chrome)['zh'];

export function useChrome(): Chrome {
  const { lang } = useLang();
  return chrome[lang];
}
