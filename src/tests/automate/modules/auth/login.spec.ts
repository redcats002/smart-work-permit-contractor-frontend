import { expect, type Page, test } from '@playwright/test'

const LOGIN_URL = `/auth/login`

test.describe('Login', () => {
  // clear auth state — login tests must start unauthenticated
  test.use({ storageState: { cookies: [], origins: [] } })

  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.goto(LOGIN_URL)
  })

  test('show login form on load', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.getByLabel('อีเมล')).toBeVisible()
    await expect(page.getByLabel('รหัสผ่าน')).toBeVisible()
    await expect(page.getByRole('button', { name: 'ถัดไป' })).toBeVisible()
    await page.getByRole('button', { name: 'ถัดไป' }).click()
  })

  test('show validation error when submit empty form', async ({ page }: { page: Page }): Promise<void> => {
    await page.getByRole('button', { name: 'ถัดไป' }).click()
    await expect(page.locator('[name="email"]')).toBeVisible()
    await expect(page.locator('[name="password"]')).toBeVisible()
  })

  test('login success — show branch selection', async ({ page }: { page: Page }): Promise<void> => {
    await page.getByLabel('อีเมล').fill('systemuser@email.com')
    await page.getByLabel('รหัสผ่าน').fill('password123')
    await page.getByRole('button', { name: 'ถัดไป' }).click()

    // after login API, branch selection screen appears

    await expect(page.locator('[id="branch-1"]')).toBeVisible({ timeout: 10_000 })
    await page.locator('[id="branch-1"]').click()
  })

  test('login then select branch — redirect to home', async ({ page }: { page: Page }): Promise<void> => {
    await page.getByLabel('อีเมล').fill('systemuser@email.com')
    await page.getByLabel('รหัสผ่าน').fill('password123')
    await page.getByRole('button', { name: 'ถัดไป' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[id="branch-1"]')).toBeVisible({ timeout: 10_000 })
    await page.locator('[id="branch-1"]').click()
    await expect(page).toHaveURL(`/announcement?page=1&limit=3&search=&sortBy=&sortOrder=desc`, { timeout: 10_000 })
  })

  test('login fail — show error toast', async ({ page }: { page: Page }): Promise<void> => {
    await page.getByLabel('อีเมล').fill('wrong@example.com')
    await page.getByLabel('รหัสผ่าน').fill('wrongpassword')
    await page.getByRole('button', { name: 'ถัดไป' }).click()

    // toast error from API
    await expect(page.locator('[class*="toast"]').or(page.locator('[role="alert"]'))).toBeVisible({ timeout: 8_000 })
  })
})
