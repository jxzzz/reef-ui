import { defineConfig, devices } from '@playwright/test';

// 视觉回归：基准截图存 e2e/*.spec.ts-snapshots/，由 CI 的 update-baselines 任务统一重新生成，
// 保证截图环境（字体/渲染）与检查环境一致。
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  expect: {
    toHaveScreenshot: { animations: 'disabled' },
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://localhost:4173',
  },
  webServer: {
    command: 'pnpm exec vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
