import { expect, test } from '@playwright/test';

// 覆盖视觉密度最高的组件页（一张图 = 该页全部示例），明/暗各一张。
// 基准图由 CI workflow_dispatch（update-baselines）重新生成，本地差异不作数。
const PAGES = [
  'button',
  'input',
  'select',
  'date-picker',
  'table',
  'modal',
  'tree',
  'cascader',
  'upload',
  'dropdown',
  'form',
  'tag',
  'alert',
  'slider',
] as const;

test.describe.configure({ mode: 'parallel' });

for (const key of PAGES) {
  test(`${key} / light`, async ({ page }) => {
    await page.goto(`/#${key}`);
    const content = page.locator('.docs__content');
    await expect(content).toBeVisible();
    await expect(content).toHaveScreenshot(`${key}.png`);
  });

  test(`${key} / dark`, async ({ page }) => {
    await page.goto(`/#${key}`);
    const content = page.locator('.docs__content');
    await expect(content).toBeVisible();
    await page.click('button[aria-label="切换到暗色模式"]');
    await expect(content).toHaveScreenshot(`${key}--dark.png`);
  });
}

test('home / landing', async ({ page }) => {
  await page.goto('/#home');
  await expect(page.locator('.landing')).toBeVisible();
  await expect(page).toHaveScreenshot('home.png', { fullPage: true });
});
