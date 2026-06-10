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

// bubbles: false prevents PrimeVue's document-level outside-click handler from firing
// in the same tick, which would immediately close the menu after opening it
async function openActionMenu (page: Page): Promise<void> {
  await page.getByTestId('action-menu-trigger').last().click()
  await expect(page.locator('#overlay_menu')).toBeVisible()
}

async function navigateToWarehouseDetail (page: Page, name: string): Promise<void> {
  await page.goto(LIST_URL)
  await page.waitForLoadState('networkidle')
  await expect(page.locator('tbody').getByText(name, { exact: true })).toBeVisible({ timeout: 10_000 })
  await page.locator('tbody tr').filter({ hasText: name }).getByRole('link').click()
  await expect(page).toHaveURL(/warehouse\/\d+/, { timeout: 5_000 })
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')
}

async function deleteCreatedWarehouse (page: Page, name: string): Promise<void> {
  await navigateToWarehouseDetail(page, name)
  await openActionMenu(page)
  await page.locator('#overlay_menu').getByRole('menuitem', { name: 'ลบ' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()
  await page.getByTestId('confirm-button').click()
  await expect(page).toHaveURL(/warehouse\/list/, { timeout: 10_000 })
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
      const name = `Test คลัง ${Math.random().toString(36).slice(2, 6).toUpperCase()}`
      const prefix = Math.random().toString(36).slice(2, 5).toUpperCase()
      await createWarehouse(page, name, prefix)
      await expect(page.locator('tbody').getByText(name, { exact: true })).toBeVisible({ timeout: 10_000 })

      await deleteCreatedWarehouse(page, name)
    })
  })

  test.describe('Setting / Update / Warehouse', () => {
    test('update — edit warehouse from detail page', async ({ page }: { page: Page }): Promise<void> => {
      const name = `Test คลัง For Update ${Math.random().toString(36).slice(2, 6).toUpperCase()}`
      const prefix = Math.random().toString(36).slice(2, 5).toUpperCase()
      const updatedName = `Updated ${name}`
      await createWarehouse(page, name, prefix)
      await navigateToWarehouseDetail(page, name)

      await openActionMenu(page)
      await page.locator('#overlay_menu').getByRole('menuitem', { name: 'แก้ไข' }).click()

      await expect(page).toHaveURL(/warehouse\/edit\/\d+/, { timeout: 5_000 })
      await page.waitForLoadState('networkidle')

      const nameInput = page.getByLabel('ชื่อคลัง')
      await nameInput.clear()
      await nameInput.fill(updatedName)

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page).toHaveURL(/warehouse\/\d+/, { timeout: 10_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.getByText(updatedName, { exact: true })).toBeVisible({ timeout: 10_000 })

      await deleteCreatedWarehouse(page, updatedName)
    })
  })

  test.describe.serial('Setting / Delete / Warehouse', () => {
    let deleteName: string
    let deletePrefix: string

    test.beforeAll(async (): Promise<void> => {
      deleteName = `Test คลัง For Delete ${Math.random().toString(36).slice(2, 6).toUpperCase()}`
      deletePrefix = Math.random().toString(36).slice(2, 5).toUpperCase()
    })

    test('delete — cancel stays on detail page', async ({ page }: { page: Page }): Promise<void> => {
      await createWarehouse(page, deleteName, deletePrefix)
      await navigateToWarehouseDetail(page, deleteName)

      await openActionMenu(page)
      await page.locator('#overlay_menu').getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('cancel-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(page).toHaveURL(/warehouse\/\d+/, { timeout: 3_000 })
    })

    test('delete — confirm redirects to list and removes row', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(LIST_URL)
      await page.waitForLoadState('networkidle')
      const countBefore = await page.locator('tbody tr').count()

      await navigateToWarehouseDetail(page, deleteName)

      await openActionMenu(page)
      await page.locator('#overlay_menu').getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('confirm-button').click()

      await expect(page).toHaveURL(/warehouse\/list/, { timeout: 10_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.locator('tbody tr')).toHaveCount(countBefore - 1)
    })
  })
})
