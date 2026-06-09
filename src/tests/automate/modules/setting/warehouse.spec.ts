import { expect, type Page, test } from '@playwright/test'

const LIST_URL = '/setting/other/warehouse/list'
const CREATE_URL = '/setting/other/warehouse/create'

async function createWarehouse (page: Page, name: string, prefix: string): Promise<void> {
  await page.goto(CREATE_URL)
  await page.waitForLoadState('networkidle')

  await page.getByLabel('ชื่อคลัง').fill(name)
  await page.getByLabel('ตัวย่อคลัง').fill(prefix)

  await page.getByRole('button', { name: 'ยืนยัน' }).click()
  await expect(page.locator('[role="dialog"]').last()).toBeVisible()
  await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

  await expect(page).toHaveURL(/warehouse\/list/, { timeout: 10_000 })
  await page.waitForLoadState('networkidle')
}

async function navigateToWarehouseDetail (page: Page, name: string): Promise<void> {
  await page.goto(LIST_URL)
  await page.waitForLoadState('networkidle')
  await expect(page.locator('tbody').getByText(name, { exact: true })).toBeVisible({ timeout: 10_000 })
  await page.locator('tbody tr').filter({ hasText: name }).getByRole('link').click()
  await expect(page).toHaveURL(/warehouse\/\d+/, { timeout: 5_000 })
  await page.waitForLoadState('networkidle')
}

test.describe('Setting / Warehouse', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.goto(LIST_URL)
    await page.waitForLoadState('networkidle')
  })

  test('list — show table', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
  })

  test('list — create button navigates to create page', async ({ page }: { page: Page }): Promise<void> => {
    await page.getByRole('link', { name: 'เพิ่มคลังใหม่' }).click()
    await expect(page).toHaveURL(/warehouse\/create/, { timeout: 5_000 })
  })

  test.describe('Setting / Create / Warehouse', () => {
    test('create — cancel returns to list', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(CREATE_URL)
      await page.waitForLoadState('networkidle')

      await page.getByRole('button', { name: 'ยกเลิก' }).click()
      await expect(page).toHaveURL(/warehouse\/list/, { timeout: 5_000 })
    })

    test('create — add new warehouse', async ({ page }: { page: Page }): Promise<void> => {
      await createWarehouse(page, 'Test คลัง', 'TST')
      await expect(page.locator('tbody').getByText('Test คลัง', { exact: true })).toBeVisible({ timeout: 10_000 })
    })
  })

  test.describe('Setting / Update / Warehouse', () => {
    test('update — edit warehouse from detail page', async ({ page }: { page: Page }): Promise<void> => {
      await createWarehouse(page, 'Test คลัง For Update', 'TFU')
      await navigateToWarehouseDetail(page, 'Test คลัง For Update')

      await page.locator('#action-menu-trigger').click()
      await page.getByRole('menuitem', { name: 'แก้ไข' }).click()

      await expect(page).toHaveURL(/warehouse\/\d+\/edit/, { timeout: 5_000 })
      await page.waitForLoadState('networkidle')

      const nameInput = page.getByLabel('ชื่อคลัง')
      await nameInput.clear()
      await nameInput.fill('Updated Test คลัง For Update')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      // Edit redirects back to detail page, not list
      await expect(page).toHaveURL(/warehouse\/\d+/, { timeout: 10_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.getByText('Updated Test คลัง For Update', { exact: true })).toBeVisible({ timeout: 10_000 })
    })
  })

  test.describe.serial('Setting / Delete / Warehouse', () => {
    test('delete — cancel stays on detail page', async ({ page }: { page: Page }): Promise<void> => {
      await createWarehouse(page, 'Test คลัง For Delete', 'TFD')
      await navigateToWarehouseDetail(page, 'Test คลัง For Delete')

      await page.locator('#action-menu-trigger').click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('cancel-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(page).toHaveURL(/warehouse\/\d+/, { timeout: 3_000 })
    })

    test('delete — confirm redirects to list and removes row', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(LIST_URL)
      await page.waitForLoadState('networkidle')
      const countBefore = await page.locator('tbody tr').count()

      await navigateToWarehouseDetail(page, 'Test คลัง For Delete')

      await page.locator('#action-menu-trigger').click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('confirm-button').click()

      await expect(page).toHaveURL(/warehouse\/list/, { timeout: 10_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.locator('tbody tr')).toHaveCount(countBefore - 1)
    })
  })
})
