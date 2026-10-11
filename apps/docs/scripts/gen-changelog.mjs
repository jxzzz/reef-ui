// 从 git 提交历史生成 src/changelog.generated.ts（docs 构建前自动运行）
// 规则：只取 packages/ 路径下 feat/fix 提交；版本边界 = @reef-ui/components@* 标签 +
// `version ... x.y.z` 提交；docs 类提交跳过。生成文件随仓库提交，tsc/vite dev 无需先跑脚本。
// ponytail: 提交主题即 changelog 文案，不做改写；混合提交里夹带的组件修复会被 docs 过滤误伤，发布前人工兜底
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SEMVER = /\d+\.\d+\.\d+/;
const TYPE = { feat: '新增', fix: '修复' };
const COMPONENT_ADD = /^(?:add|新增)\s+(.+?)\s+components?$/i;

// git pathspec 相对 cwd，统一以仓库根目录执行
const ROOT = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
const git = (cmd) => execSync(cmd, { encoding: 'utf8', cwd: ROOT }).trim();

// 标签 → { 哈希 → 版本 }（annotated tag 用 peeled 对象）
const tagBoundary = {};
for (const line of git(
  "git for-each-ref 'refs/tags/@reef-ui/components@*' --format='%(refname:short)|%(*objectname)|%(objectname)'"
).split('\n')) {
  if (!line) continue;
  const [ref, peeled, direct] = line.split('|');
  tagBoundary[peeled || direct] = ref.split('@').pop();
}

const entries = [];
let unreleased = null;
let current = null;

// 全量 log：tag 指向的提交可能不碰 packages/，路径过滤会把边界吃掉；噪音由 type/docs 过滤兜住
for (const line of git(
  "git log --no-merges --date=short --format='%H%x09%ad%x09%s'"
).split('\n')) {
  if (!line) continue;
  const [hash, date, subject] = line.split('\t');
  const m = subject.match(/^(\w+)(?:\(([^)]*)\))?: (.+)$/);
  if (!m) continue;
  const [, type, scope, text] = m;

  // 版本边界：先建组，边界之后的（更老的）提交归入该版本
  let boundary = tagBoundary[hash];
  if (!boundary && /version\b/i.test(text) && SEMVER.test(text)) boundary = text.match(SEMVER)[0];
  if (boundary) {
    current = { version: boundary, date, items: [] };
    if (!entries.some((e) => e.version === boundary)) entries.push(current);
    continue;
  }
  if (!TYPE[type]) continue;
  if (/^(docs\b|文档站)/i.test(text)) continue;

  const bucket = current ?? (unreleased ??= { version: '未发布', date: '开发中', items: [] });
  bucket.items.push({ type: TYPE[type], text: (scope ? `[${scope}] ` : '') + text.trim() });
}

// 首个版本把 "add X component" 提交收拢成一条
if (unreleased && unreleased.items.length > 0) entries.unshift(unreleased);
for (const e of entries) {
  const adds = [];
  const rest = [];
  for (const item of e.items) {
    const am = item.text.match(COMPONENT_ADD);
    if (am) adds.push(am[1]);
    else rest.push(item);
  }
  if (adds.length >= 3) rest.push({ type: '新增', text: `首批组件：${adds.join('；')}` });
  else for (const [i, name] of adds.reverse().entries()) rest.push({ type: '新增', text: `新增 ${name} 组件` });
  e.items = rest;
}

const out = `// 由 scripts/gen-changelog.mjs 从 git 历史生成，勿手改
export interface ChangelogEntry {
  version: string;
  date: string;
  items: Array<{ type: string; text: string }>;
}

export const changelog: ChangelogEntry[] = ${JSON.stringify(entries.filter((e) => e.items.length > 0), null, 2)};
`;
writeFileSync(fileURLToPath(new URL('../src/changelog.generated.ts', import.meta.url)), out);
console.log(`changelog.generated.ts: ${entries.filter((e) => e.items.length).length} versions`);
