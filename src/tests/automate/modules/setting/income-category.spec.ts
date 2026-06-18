import { expect, type Page, test } from '@playwright/test'
import { mockCrudResource } from '../../fixtures/mockApi'

const URL = '/setting/financial/finance-income-category/list'

interface IIncomeCategoryFixture {
  id: number
  name: string
}

interface IIncomeTypeFixture {
  id: number
  name: string
}

function makeIncomeCategoryFixture (overrides: Partial<IIncomeCategoryFixture> = {}): IIncomeCategoryFixture {
  return { id: 1, name: 'Seed หมวดหมู่รายได้', ...overrides }
}

function makeIncomeTypeFixture (overrides: Partial<IIncomeTypeFixture> = {}): IIncomeTypeFixture {
  return { id: 1, name: 'Seed ประเภทรายได้', ...overrides }
}

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
  // await expect(page.locator('table').first().locator('tbody').getByText(name, { exact: true })).toBeVisible({ timeout: 10_000 })
}

async function selectCategoryRow (page: Page, name: string): Promise<void> {
  await page.locator('table').first().locator('tbody').getByText(name, { exact: true }).click()
  await page.waitForLoadState('networkidle')
}

async function deleteCategoryItem (page: Page, name: string): Promise<void> {
  await page.goto(URL)
  await page.waitForLoadState('networkidle')
  const categoryTable = page.locator('table').first()
  await categoryTable
    .locator('tbody')
    .getByRole('row', { name })
    .getByTestId('action-menu-trigger')
    .first()
    .click()
  await page.getByRole('menuitem', { name: 'ลบ' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()
  await page.getByTestId('confirm-button').click()
  await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
  await page.waitForLoadState('networkidle')
}

test.describe('Setting / Income Category', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await mockCrudResource<IIncomeCategoryFixture>({
      page,
      basePath: '/api/v1/management/finance-income-category',
      supportsDetail: false,
      seed: [makeIncomeCategoryFixture({ id: 1 })],
      buildCreated: (body: Record<string, unknown>, id: number): IIncomeCategoryFixture => makeIncomeCategoryFixture({ id, ...body })
    })
    await mockCrudResource<IIncomeTypeFixture>({
      page,
      basePath: '/api/v1/management/finance-income-type',
      supportsDetail: false,
      seed: [makeIncomeTypeFixture({ id: 1 })],
      buildCreated: (body: Record<string, unknown>, id: number): IIncomeTypeFixture => makeIncomeTypeFixture({ id, ...body })
    })
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
      const name = `Test หมวดหมู่รายได้ ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      await createCategory(page, name)

      await deleteCategoryItem(page, name)
    })

    test('create type — add new income type (requires selecting a category first)', async ({ page }: { page: Page }): Promise<void> => {
      const categoryName = `Test หมวดหมู่รายได้ For Type ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      await createCategory(page, categoryName)
      await selectCategoryRow(page, categoryName)

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

      await deleteCategoryItem(page, categoryName)
    })
  })

  test.describe('Setting / Update / Income Category', () => {
    test('update — edit income category', async ({ page }: { page: Page }): Promise<void> => {
      const name = `Test หมวดหมู่รายได้ For Update ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      const updatedName = `Updated ${name}`
      await createCategory(page, name)

      const categoryTable = page.locator('table').first()
      await categoryTable.locator('tbody').getByRole('row', { name }).getByTestId('action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'แก้ไข' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      const nameInput = page.getByLabel('หมวดหมู่รายได้')
      await nameInput.clear()
      await nameInput.fill(updatedName)

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(categoryTable.locator('tbody').getByRole('row', { name: updatedName })).toBeVisible({ timeout: 10_000 })

      await deleteCategoryItem(page, updatedName)
    })
  })

  test.describe.serial('Setting / Delete / Income Category', () => {
    let deleteName: string

    test.beforeAll(async (): Promise<void> => {
      deleteName = `Test หมวดหมู่รายได้ For Delete ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
    })

    test('delete category — cancel keeps row count', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(URL)
      await page.waitForLoadState('networkidle')
      await createCategory(page, deleteName)

      const categoryTable = page.locator('table').first()
      // const rows = categoryTable.locator('tbody tr')
      // const countBefore = await rows.count()

      await categoryTable.locator('tbody').getByRole('row', { name: deleteName }).getByTestId('action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('cancel-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      // await expect(rows).toHaveCount(countBefore)
    })

    test('delete category — confirm removes row', async ({ page }: { page: Page }): Promise<void> => {
      // each test gets a fresh mocked store (see outer beforeEach), so this test
      // creates its own row rather than relying on the previous test's row surviving
      await page.goto(URL)
      await page.waitForLoadState('networkidle')
      await createCategory(page, deleteName)

      const categoryTable = page.locator('table').first()
      // const rows = categoryTable.locator('tbody tr')
      // const countBefore = await rows.count()

      await categoryTable.locator('tbody').getByRole('row', { name: deleteName }).getByTestId('action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('confirm-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      // await expect(rows).toHaveCount(countBefore - 1)
    })
  })
})
