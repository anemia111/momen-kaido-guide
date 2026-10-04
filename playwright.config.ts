import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.TEST_URL ?? 'http://127.0.0.1:4173/momen-kaido-guide/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    ...[375, 390, 393, 430].map((width) => ({
      name: `webkit-${width}`,
      use: {
        browserName: 'webkit' as const,
        viewport: { width, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    })),
    ...[768, 1440].map((width) => ({
      name: `chromium-${width}`,
      use: { browserName: 'chromium' as const, viewport: { width, height: 1000 } },
    })),
  ],
  webServer: process.env.TEST_URL
    ? undefined
    : {
        command: 'npm run preview -- --host 127.0.0.1 --port 4173',
        url: 'http://127.0.0.1:4173/momen-kaido-guide/',
        reuseExistingServer: !process.env.CI,
      },
})
