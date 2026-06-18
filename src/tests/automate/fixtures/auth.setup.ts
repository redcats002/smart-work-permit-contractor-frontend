import { type Page, test as setup } from '@playwright/test'
import { actionResponse, mockRoute, paginatedResponse } from './mockApi'

const AUTH_FILE = 'src/tests/automate/.auth/user.json'

setup('authenticate', async ({ page }: { page: Page }): Promise<void> => {
  await mockRoute(page, '**/api/v1/auth/public/login', {
    method: 'POST',
    body: actionResponse({
      user: {
        id: '1',
        name: 'System User',
        firstName: 'System',
        lastName: 'User',
        email: 'systemuser@email.com'
      },
      token: 'mock-access-token'
    })
  })
  await mockRoute(page, '**/api/v1/auth/active-branches', {
    method: 'GET',
    body: paginatedResponse([{ id: '1', name: 'Mock Branch', logo: '', status: 'ACTIVE' }])
  })
  await mockRoute(page, '**/api/v1/auth/select-active-branch', {
    method: 'POST',
    body: actionResponse({ activeOrganizationId: '1' })
  })
  await mockRoute(page, '**/api/v1/management/announcement**', {
    method: 'GET',
    body: paginatedResponse([])
  })

  await page.goto('http://localhost:8090/auth/login')

  await page.getByLabel('อีเมล').fill('systemuser@email.com')
  await page.getByLabel('รหัสผ่าน').fill('password123')
  await page.getByRole('button', { name: 'ถัดไป' }).click()

  const firstBranch = page.locator('[id^="branch-"]').first()
  await firstBranch.waitFor({ timeout: 10_000 })
  await firstBranch.click()

  await page.waitForURL('**/announcement**', { timeout: 10_000 })

  await page.context().storageState({ path: AUTH_FILE })
})
