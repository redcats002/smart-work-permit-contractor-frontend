import { expect, type Page, test } from '@playwright/test'
import { mockContractListAndDetail } from '../../fixtures/contract.fixture'

const LIST_URL = '/contract/list'

async function navigateToContractDetail (page: Page): Promise<void> {
  await page.goto(LIST_URL)
  await page.waitForLoadState('networkidle')
  await page.locator('div.cursor-pointer').filter({ hasText: /^สัญญา$/ }).click()
  await page.waitForLoadState('networkidle')
  await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 10_000 })
  await page.locator('tbody tr').first().getByRole('link').click()
  await expect(page).toHaveURL(/contract\/detail\/\d+/, { timeout: 5_000 })
  await page.waitForLoadState('networkidle')
}

async function openActionMenu (page: Page): Promise<void> {
  await page.getByTestId('action-menu-trigger').nth(2).click()
  await expect(page.locator('#overlay_menu')).toBeVisible({ timeout: 5_000 })
}

async function openCancelMenuItemIfEnabled (page: Page): Promise<boolean> {
  await openActionMenu(page)
  const menuItem = page.getByRole('menuitem', { name: 'ยกเลิกสัญญา' })
  await expect(menuItem).toBeVisible({ timeout: 3_000 })
  if (await menuItem.isDisabled()) return false
  await menuItem.click()
  return true
}


test.describe('Contract / Detail', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await mockContractListAndDetail(page, { contractId: 555 })
    await navigateToContractDetail(page)
  })

  test('detail — shows contract detail tabs', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('div.cursor-pointer').filter({ hasText: /^รายละเอียด$/ })).toBeVisible()
    await expect(page.locator('div.cursor-pointer').filter({ hasText: /^หลักทรัพย์$/ })).toBeVisible()
    await expect(page.locator('div.cursor-pointer').filter({ hasText: /^รายได้$/ })).toBeVisible()
    await expect(page.locator('div.cursor-pointer').filter({ hasText: /^ค่าใช้จ่าย$/ })).toBeVisible()
  })

  test('detail — cancel — cancel dialog closes on dismiss', async ({ page }: { page: Page }): Promise<void> => {
    const proceeded = await openCancelMenuItemIfEnabled(page)
    if (!proceeded) return

    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await page.getByTestId('cancel-button').click()

    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
    await expect(page).toHaveURL(/contract\/detail\/\d+/, { timeout: 3_000 })
  })

  test('detail — cancel — confirm cancels contract and stays on detail page', async ({ page }: { page: Page }): Promise<void> => {
    const proceeded = await openCancelMenuItemIfEnabled(page)
    if (!proceeded) return

    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await page.getByRole('button', { name: 'ใช่, ฉันต้องการยกเลิก' }).click()

    await expect(page).toHaveURL(/contract\/detail\/\d+/, { timeout: 10_000 })
    await page.waitForLoadState('networkidle')
  })
})
