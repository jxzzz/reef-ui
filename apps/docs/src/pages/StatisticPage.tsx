import { Statistic } from '@reef-ui/components';
import { ApiTable, ComponentHeader, Demo, TypeBlock } from '../docs-ui';
import { useLang, type Lang } from '../i18n';

const basicCode: Record<Lang, string> = {
  zh: `<Statistic title="销售额" value={12345.67} precision={2} prefix="¥" suffix="元" />`,
  en: `<Statistic title="Sales" value={12345.67} precision={2} prefix="¥" suffix="CNY" />`,
};

const numberCode: Record<Lang, string> = {
  zh: `<Statistic title="活跃用户" value={9876543} />
<Statistic title="退款" value={-1234.5} precision={1} separator={false} />`,
  en: `<Statistic title="Active users" value={9876543} />
<Statistic title="Refunds" value={-1234.5} precision={1} separator={false} />`,
};

const loadingCode: Record<Lang, string> = {
  zh: `<Statistic title="销售额" value={12345.67} precision={2} loading />`,
  en: `<Statistic title="Sales" value={12345.67} precision={2} loading />`,
};

export function StatisticPage() {
  const { lang } = useLang();
  const zh = lang === 'zh';
  return (
    <>
      <ComponentHeader group="数据展示" title={zh ? 'Statistic 数值统计' : 'Statistic'}>
        {zh
          ? '展示单个数值，支持精度、千分位分组、前后缀与加载占位。'
          : 'Displays a single value with precision, thousands grouping, prefix/suffix and a loading placeholder.'}
      </ComponentHeader>

      <Demo title={zh ? '基础用法' : 'Basic usage'} code={zh ? basicCode.zh : basicCode.en}>
        <Statistic title="销售额" value={12345.67} precision={2} prefix="¥" suffix="元" />
      </Demo>

      <Demo title={zh ? '精度与分组' : 'Precision and grouping'} code={zh ? numberCode.zh : numberCode.en}>
        <div style={{ display: 'flex', gap: 48 }}>
          <Statistic title="活跃用户" value={9876543} />
          <Statistic title="退款" value={-1234.5} precision={1} separator={false} />
        </div>
      </Demo>

      <Demo title={zh ? '加载中' : 'Loading'} code={zh ? loadingCode.zh : loadingCode.en}>
        <Statistic title="销售额" value={12345.67} precision={2} loading />
      </Demo>

      <h3>API</h3>
      <ApiTable
        rows={[
          ['title', zh ? '标题' : 'Title', 'ReactNode', '—'],
          ['value', zh ? '数值；字符串原样展示' : 'Value; strings render as-is', 'string | number', zh ? '必填' : 'Required'],
          ['precision', zh ? '小数位数（仅数字）' : 'Decimal places (numbers only)', 'number', '—'],
          ['prefix', zh ? '数值前缀' : 'Prefix before the value', 'ReactNode', '—'],
          ['suffix', zh ? '数值后缀' : 'Suffix after the value', 'ReactNode', '—'],
          ['separator', zh ? '千分位逗号分组（仅数字）' : 'Thousands separator (numbers only)', 'boolean', 'true'],
          ['loading', zh ? '加载中，显示占位符' : 'Loading, shows a placeholder', 'boolean', 'false'],
        ]}
      />

      <TypeBlock
        code={`interface StatisticProps {
  title?: ReactNode;
  value: string | number;
  precision?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  separator?: boolean;
  loading?: boolean;
}`}
      />
    </>
  );
}
