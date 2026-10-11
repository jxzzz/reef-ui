import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import { CalendarPanel } from '../date-picker/CalendarPanel';
import { Empty } from '../empty/Empty';
import { enUS, LocaleProvider, zhCN, type Locale } from './';

afterEach(cleanup);

const weekdayHeads = (container: HTMLElement) =>
  [...container.querySelectorAll('.reef-datepicker__weekday')].map((el) => el.textContent);

describe('LocaleProvider', () => {
  test('默认 locale 为 zhCN', () => {
    render(<Empty />);
    expect(screen.getByText('暂无数据')).toBeTruthy();
  });

  test('enUS 下 Empty 显示英文文案', () => {
    render(
      <LocaleProvider locale={enUS}>
        <Empty />
      </LocaleProvider>,
    );
    expect(screen.getByText('No data')).toBeTruthy();
  });

  test('enUS 下星期从周日开始，面板标题为英文月份', () => {
    const { container } = render(
      <LocaleProvider locale={enUS}>
        <CalendarPanel value={[null, null]} onPick={() => {}} />
      </LocaleProvider>,
    );
    const heads = weekdayHeads(container);
    expect(heads[0]).toBe('Su');
    expect(heads[6]).toBe('Sa');
    expect(container.querySelector('.reef-datepicker__month')?.textContent).toMatch(/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/);
  });

  test('zhCN 星期从周一开始，标题为中文年月', () => {
    const { container } = render(<CalendarPanel value={[null, null]} onPick={() => {}} />);
    const heads = weekdayHeads(container);
    expect(heads[0]).toBe('一');
    expect(heads[6]).toBe('日');
    expect(container.querySelector('.reef-datepicker__month')?.textContent).toMatch(/^\d{4}年\d+月$/);
  });

  test('自定义 locale 生效', () => {
    const custom: Locale = { ...zhCN, Empty: { description: '什么都没有' } };
    render(
      <LocaleProvider locale={custom}>
        <Empty />
      </LocaleProvider>,
    );
    expect(screen.getByText('什么都没有')).toBeTruthy();
  });
});
