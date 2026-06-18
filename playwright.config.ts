import { existsSync, mkdirSync } from 'fs'
import { defineConfig, devices } from '@playwright/test'

const AUTH_FILE = 'src/tests/automate/.auth/user.json'
mkdirSync('src/tests/automate/.auth', { recursive: true })

export default defineConfig({
  testDir: './src/tests/automate',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 4,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8090',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
    // headless: false
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/fixtures/auth.setup.ts'
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(existsSync(AUTH_FILE) ? { storageState: AUTH_FILE } : {})
      },
      dependencies: ['setup']
    }
  ],
  webServer: {
    // dedicated port for the test run so it never collides with another
    // project's dev server that may already be bound to the default 8080
    command: 'bun run dev -- --port 8090 --strictPort',
    url: 'http://localhost:8090',
    reuseExistingServer: !process.env.CI
  }
})
