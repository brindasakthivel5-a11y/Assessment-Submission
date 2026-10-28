import { defineConfig, devices } from '@playwright/test';
import { config } from './src/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0, // no retries: a retry would hide flakiness we want to see
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  outputDir: 'reports/artifacts', // failure screenshots and traces land here
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
  ],
  use: {
    baseURL: config.baseUrl,
    testIdAttribute: 'data-test', // Sauce Demo uses data-test attributes
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
