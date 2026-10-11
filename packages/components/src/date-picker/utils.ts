const pad = (n: number) => String(n).padStart(2, '0');

/** YYYY-MM-DD（本地时区构造，避免 Date(str) 的 UTC 解析坑） */
export function formatDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseDate(s: string | null): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  // Date 构造会进位（如 2026-13-01 → 2027-01），往返不一致即非法
  return Number.isNaN(d.getTime()) || formatDate(d) !== s ? null : d;
}

/** 周一为一周起点 */
export function startOfWeek(d: Date): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  r.setDate(r.getDate() - ((r.getDay() + 6) % 7));
  return r;
}

/** 当月网格 6 行 42 格（含前后月补位） */
export function monthGrid(year: number, month: number): Date[] {
  const start = startOfWeek(new Date(year, month, 1));
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/** a、b 是否同一天（忽略时分秒） */
export function isSameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && formatDate(a) === formatDate(b);
}

/** 面板某天的高亮状态：两个端点里任意命中 selected，落在两点之间 in-range */
export function dayState(d: Date, start: Date | null, end: Date | null): 'selected' | 'in-range' | '' {
  if (isSameDay(d, start) || isSameDay(d, end)) return 'selected';
  if (start && end) {
    const t = formatDate(d);
    const [lo, hi] = [formatDate(start), formatDate(end)].sort();
    if (t > lo && t < hi) return 'in-range';
  }
  return '';
}
