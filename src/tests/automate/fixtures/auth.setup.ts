import { type Page, test as setup } from '@playwright/test'

const AUTH_FILE = 'src/tests/automate/.auth/user.json'

setup('authenticate', async ({ page }: { page: Page }): Promise<void> => {
  await page.goto('http://localhost:8080/auth/login')

  await page.getByLabel('อีเมล').fill('systemuser@email.com')
  await page.getByLabel('รหัสผ่าน').fill('password123')
  await page.getByRole('button', { name: 'ถัดไป' }).click()

  const firstBranch = page.locator('[id^="branch-"]').first()
  await firstBranch.waitFor({ timeout: 10_000 })
  await firstBranch.click()

  await page.waitForURL('**/announcement**', { timeout: 10_000 })

  await page.context().storageState({ path: AUTH_FILE })
})
