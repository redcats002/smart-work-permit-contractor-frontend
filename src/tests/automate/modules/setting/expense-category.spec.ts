import { expect, type Page, test } from '@playwright/test'

const URL = '/setting/financial/finance-expense-category/list'

async function openCategoryCreateModal (page: Page): Promise<void> {
  const categoryTable = page.locator('table').first()
  await categoryTable.locator('thead').getByRole('button').click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()
}

async function createCategory (page: Page, name: string): Promise<void> {
  await openCategoryCreateModal(page)
  await page.getByLabel('หมวดหมู่ค่าใช้จ่าย').fill(name)
  // Select ภายนอก from ExternalInternalExpenseSelection (PrimeVue Select combobox)
  await page.locator('[role="dialog"] [role="combobox"]').click()
  await page.getByRole('option', { name: 'ภายนอก' }).click()
  await page.getByRole('button', { name: 'ยืนยัน' }).click()
  await expect(page.locator('[role="dialog"]').last()).toBeVisible()
  await page.getByRole('button', { name: 'ยืนยัน' }).last().click()
  await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
  await page.waitForLoadState('networkidle')
  // await expect(page.locator('table').first().locator('tbody').getByRole('cell', { name, exact: true })).toBeVisible({ timeout: 10_000 })
}

async function selectCategoryRow (page: Page, name: string): Promise<void> {
  await page.locator('table').first().locator('tbody').getByRole('cell', { name, exact: true }).click()
  await page.waitForLoadState('networkidle')
}

async function deleteCategoryItem (page: Page, name: string): Promise<void> {
  await page.goto(URL)
  await page.waitForLoadState('networkidle')
  const categoryTable = page.locator('table').first()
  await categoryTable.locator('tbody').getByRole('cell', { name, exact: true }).locator('..').locator('#action-menu-trigger').first().click()
  await page.getByRole('menuitem', { name: 'ลบ' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()
  await page.getByTestId('confirm-button').click()
  await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
  await page.waitForLoadState('networkidle')
}

test.describe('Setting / Expense Category', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.goto(URL)
    await page.waitForLoadState('networkidle')
  })

  test('list — show two tables', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table').first()).toBeVisible()
    await expect(page.locator('table').nth(1)).toBeVisible()
  })

  test.describe('Setting / Create / Expense Category', () => {
    test('create category — cancel closes modal', async ({ page }: { page: Page }): Promise<void> => {
      await openCategoryCreateModal(page)

      await page.getByRole('button', { name: 'ยกเลิก' }).click()
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3_000 })
    })

    test('create category — add new expense category', async ({ page }: { page: Page }): Promise<void> => {
      const name = `Test หมวดหมู่ค่าใช้จ่าย ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      await createCategory(page, name)

      await deleteCategoryItem(page, name)
    })

    test('create type — add new expense type (requires selecting a category first)', async ({ page }: { page: Page }): Promise<void> => {
      const categoryName = `Test หมวดหมู่ค่าใช้จ่าย For Type ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      await createCategory(page, categoryName)
      await selectCategoryRow(page, categoryName)

      const typeTable = page.locator('table').nth(1)
      await typeTable.locator('thead').getByRole('button').click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      await page.getByLabel('ประเภทค่าใช้จ่าย').fill('Test ประเภทค่าใช้จ่าย')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await page.waitForLoadState('networkidle')
      await expect(typeTable.locator('tbody').getByRole('cell', { name: 'Test ประเภทค่าใช้จ่าย', exact: true })).toBeVisible({ timeout: 10_000 })

      await deleteCategoryItem(page, categoryName)
    })
  })

  test.describe('Setting / Update / Expense Category', () => {
    test('update — edit expense category', async ({ page }: { page: Page }): Promise<void> => {
      const name = `Test หมวดหมู่ค่าใช้จ่าย For Update ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      const updatedName = `Updated ${name}`
      await createCategory(page, name)

      const categoryTable = page.locator('table').first()
      await categoryTable.locator('tbody').getByRole('cell', { name, exact: true }).locator('..').locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'แก้ไข' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      const nameInput = page.getByLabel('หมวดหมู่ค่าใช้จ่าย')
      await nameInput.clear()
      await nameInput.fill(updatedName)

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(categoryTable.locator('tbody').getByRole('cell', { name: updatedName, exact: true })).toBeVisible({ timeout: 10_000 })

      await deleteCategoryItem(page, updatedName)
    })
  })

  test.describe.serial('Setting / Delete / Expense Category', () => {
    let deleteName: string

    test.beforeAll(async (): Promise<void> => {
      deleteName = `Test หมวดหมู่ค่าใช้จ่าย For Delete ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
    })

    test('delete category — cancel keeps row count', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(URL)
      await page.waitForLoadState('networkidle')
      await createCategory(page, deleteName)

      const categoryTable = page.locator('table').first()

      await categoryTable.locator('tbody').getByRole('cell', { name: deleteName, exact: true }).locator('..').locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('cancel-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
    })

    test('delete category — confirm removes row', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(URL)
      await page.waitForLoadState('networkidle')

      const categoryTable = page.locator('table').first()

      await categoryTable.locator('tbody').getByRole('cell', { name: deleteName, exact: true }).locator('..').locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('confirm-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
    })
  })
})
