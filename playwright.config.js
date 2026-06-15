// @ts-check
const { defineConfig } = require('@playwright/test');

/**
 * Playwright configuration for Mie Ayam Lariska Web E2E tests.
 *
 * Configures test execution with:
 * - Parallel test execution
 * - HTML reporter for test results
 * - Local development server integration
 * - Mobile-first viewport testing (iPhone SE, Pixel 5)
 *
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npx serve . -l 3000',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...require('@playwright/test').devices['Pixel 5'],
      },
    },
  ],
});
