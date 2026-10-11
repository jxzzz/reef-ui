/** 语言包结构：按组件分组；函数字段处理语序差异（如年月标题） */
export interface Locale {
  Breadcrumb: { nav: string };
  Select: { placeholder: string };
  DatePicker: {
    placeholder: string;
    startPlaceholder: string;
    endPlaceholder: string;
    prevYear: string;
    prevMonth: string;
    nextMonth: string;
    nextYear: string;
    calendar: string;
    /** 星期标签，从本语言的一周起点开始排列 */
    weekdays: string[];
    /** 一周起点：0 周日、1 周一 */
    weekStart: 0 | 1;
    /** 年月标题，函数处理各语言的语序差异 */
    yearMonth: (year: number, month: number) => string;
  };
  Table: { empty: string };
  Empty: { description: string };
  Spin: { loading: string };
  Pagination: { nav: string; prevPage: string; nextPage: string; page: (n: number) => string };
  Input: { clear: string };
  InputNumber: { increase: string; decrease: string };
  Tag: { close: string };
  Alert: { close: string };
  Modal: { close: string };
  Message: { close: string };
}
