import { createContext, useContext, type ReactNode } from 'react';
import { zhCN } from './zhCN';
import type { Locale } from './types';

const LocaleContext = createContext<Locale>(zhCN);

/** 语言包 Provider：包裹应用后所有组件的内置文案与 aria-label 跟随切换（缺省中文） */
export function LocaleProvider({ locale = zhCN, children }: { locale?: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}
