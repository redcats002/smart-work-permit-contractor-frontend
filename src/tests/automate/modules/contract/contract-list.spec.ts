import { expect, type Page, test } from '@playwright/test'
import { mockContractListAndDetail } from '../../fixtures/contract.fixture'

const LIST_URL = '/contract/list'

async function switchToContractTab (page: Page): Promise<void> {
  await page.locator('div.cursor-pointer').filter({ hasText: /^สัญญา$/ }).click()
  await page.waitForLoadState('networkidle')
}

test.describe('Contract / List', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await mockContractListAndDetail(page, { contractId: 555 })
    await page.goto(LIST_URL)
    await page.waitForLoadState('networkidle')
  })

  test('list — ประเมินหลักทรัพย์ tab shows table', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
  })

  test('list — สัญญา tab shows table', async ({ page }: { page: Page }): Promise<void> => {
    await switchToContractTab(page)
    await expect(page.locator('table')).toBeVisible()
  })

  test('list — create button navigates to pre-contract create', async ({ page }: { page: Page }): Promise<void> => {
    await page.getByRole('link', { name: 'สร้างสัญญาใหม่' }).click()
    await expect(page).toHaveURL(/pre-contract\/create/, { timeout: 5_000 })
  })
})
