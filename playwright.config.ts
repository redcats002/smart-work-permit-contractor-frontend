import { existsSync, mkdirSync } from 'fs'
import { defineConfig, devices } from '@playwright/test'

const AUTH_FILE = 'src/tests/automate/.auth/user.json'
mkdirSync('src/tests/automate/.auth', { recursive: true })

export default defineConfig({
  testDir: './src/tests/automate',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8080',
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
    command: 'bun run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI
  }
})
