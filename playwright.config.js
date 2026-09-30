// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,

  // Fail the build on CI if test.only is accidentally left in
  forbidOnly: !!process.env.CI,

  // Retry failed tests twice on CI, zero locally
  retries: process.env.CI ? 2 : 0,

  // Limit parallelism on CI to avoid resource contention
  workers: process.env.CI ? 2 : undefined,

  // Multi-format reporting: HTML for humans, JSON for CI pipelines
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: 'https://www.saucedemo.com',

    // Capture screenshot on every failure
    screenshot: 'only-on-failure',

    // Record video and keep only on failure — great for debugging flakies
    video: 'retain-on-failure',

    // Capture trace on first retry; open with `npx playwright show-trace`
    trace: 'on-first-retry',

    // Generous timeouts so the suite is stable on slower CI runners
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // ── Desktop browsers ───────────────────────────────────────────────────
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // ── Mobile viewports ───────────────────────────────────────────────────
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  // All test artifacts go here (auto-created)
  outputDir: 'test-results/',
});
