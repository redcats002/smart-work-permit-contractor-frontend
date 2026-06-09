import { expect, type Page, test } from '@playwright/test'

const URL = '/setting/financial/finance-income-category/list'

async function openCategoryCreateModal (page: Page): Promise<void> {
  const categoryTable = page.locator('table').first()
  await categoryTable.locator('thead').getByRole('button').click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()
}

async function createCategory (page: Page, name: string): Promise<void> {
  await openCategoryCreateModal(page)
  await page.getByLabel('หมวดหมู่รายได้').fill(name)
  await page.getByRole('button', { name: 'ยืนยัน' }).click()
  await expect(page.locator('[role="dialog"]').last()).toBeVisible()
  await page.getByRole('button', { name: 'ยืนยัน' }).last().click()
  await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
  await page.waitForLoadState('networkidle')
}

async function selectCategoryRow (page: Page, name: string): Promise<void> {
  await page.locator('table').first().locator('tbody').getByText(name, { exact: true }).click()
  await page.waitForLoadState('networkidle')
}

test.describe('Setting / Income Category', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.goto(URL)
    await page.waitForLoadState('networkidle')
  })

  test('list — show two tables', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table').first()).toBeVisible()
    await expect(page.locator('table').nth(1)).toBeVisible()
  })

  test.describe('Setting / Create / Income Category', () => {
    test('create category — cancel closes modal', async ({ page }: { page: Page }): Promise<void> => {
      await openCategoryCreateModal(page)

      await page.getByRole('button', { name: 'ยกเลิก' }).click()
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3_000 })
    })

    test('create category — add new income category', async ({ page }: { page: Page }): Promise<void> => {
      await createCategory(page, 'Test หมวดหมู่รายได้')
      await expect(page.locator('table').first().locator('tbody').getByText('Test หมวดหมู่รายได้', { exact: true })).toBeVisible({ timeout: 10_000 })
    })

    test('create type — add new income type (requires selecting a category first)', async ({ page }: { page: Page }): Promise<void> => {
      await createCategory(page, 'Test หมวดหมู่รายได้ For Type')
      await selectCategoryRow(page, 'Test หมวดหมู่รายได้ For Type')

      const typeTable = page.locator('table').nth(1)
      await typeTable.locator('thead').getByRole('button').click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      await page.getByLabel('ประเภทรายได้').fill('Test ประเภทรายได้')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await page.waitForLoadState('networkidle')
      await expect(typeTable.locator('tbody').getByText('Test ประเภทรายได้', { exact: true })).toBeVisible({ timeout: 10_000 })
    })
  })

  test.describe('Setting / Update / Income Category', () => {
    test('update — edit income category', async ({ page }: { page: Page }): Promise<void> => {
      await createCategory(page, 'Test หมวดหมู่รายได้ For Update')

      const categoryTable = page.locator('table').first()
      await categoryTable.locator('tbody').getByText('Test หมวดหมู่รายได้ For Update', { exact: true }).locator('..').locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'แก้ไข' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      const nameInput = page.getByLabel('หมวดหมู่รายได้')
      await nameInput.clear()
      await nameInput.fill('Updated Test หมวดหมู่รายได้ For Update')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(categoryTable.locator('tbody').getByText('Updated Test หมวดหมู่รายได้ For Update', { exact: true })).toBeVisible({ timeout: 10_000 })
    })
  })

  test.describe.serial('Setting / Delete / Income Category', () => {
    test('delete category — cancel keeps row count', async ({ page }: { page: Page }): Promise<void> => {
      await createCategory(page, 'Test หมวดหมู่รายได้ For Delete')

      const categoryTable = page.locator('table').first()
      const rows = categoryTable.locator('tbody tr')
      const countBefore = await rows.count()

      await categoryTable.locator('tbody').getByText('Test หมวดหมู่รายได้ For Delete', { exact: true }).locator('..').locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('cancel-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(rows).toHaveCount(countBefore)
    })

    test('delete category — confirm removes row', async ({ page }: { page: Page }): Promise<void> => {
      const categoryTable = page.locator('table').first()
      const rows = categoryTable.locator('tbody tr')
      const countBefore = await rows.count()

      await categoryTable.locator('tbody').getByText('Test หมวดหมู่รายได้ For Delete', { exact: true }).locator('..').locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('confirm-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(rows).toHaveCount(countBefore - 1)
    })
  })
})
