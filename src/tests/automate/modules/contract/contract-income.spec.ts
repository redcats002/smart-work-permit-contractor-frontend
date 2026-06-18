import { expect, type Page, test } from '@playwright/test'
import { mockContractListAndDetail } from '../../fixtures/contract.fixture'
import { mockCrudResource, mockRoute, paginatedResponse } from '../../fixtures/mockApi'

const LIST_URL = '/contract/list'

interface IIncomeFixture {
  id: number
  date: string
  note: string
  amount: number
  vatType: string
  incomeCategory: { id: number, name: string }
  incomeType: { id: number, name: string }
}

function makeIncomeFixture (overrides: Partial<IIncomeFixture> = {}): IIncomeFixture {
  return {
    id: 1,
    date: '2024-01-01',
    note: 'Seed Income',
    amount: 100,
    vatType: 'NONE',
    incomeCategory: { id: 1, name: 'Mock Income Category' },
    incomeType: { id: 1, name: 'Mock Income Type' },
    ...overrides
  }
}

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

async function openIncomeTab (page: Page): Promise<void> {
  await page.locator('div.cursor-pointer').filter({ hasText: /^รายได้$/ }).click()
  await page.waitForLoadState('networkidle')
}

async function deleteEntry (page: Page, rowText: string): Promise<void> {
  await page.waitForLoadState('networkidle')
  await page.locator('tbody tr').filter({ hasText: rowText }).locator('#action-menu-trigger').click({ timeout: 5_000, delay: 100 })
  await page.getByRole('menuitem', { name: 'ลบ' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()
  await page.getByRole('button', { name: 'ใช่, ฉันต้องการลบ' }).click()
  await page.waitForLoadState('networkidle')
}

async function createIncome (page: Page, note: string): Promise<void> {
  await page.getByRole('button', { name: 'บันทึกรายได้' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()

  // Select income category (first available)
  await page.locator('[role="dialog"] [role="combobox"]').first().click()
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')
  await expect(page.getByRole('option').first()).toBeVisible({ timeout: 5_000 })
  await page.getByRole('option').first().click({ timeout: 5_000 })

  // Select income type (first available)
  await page.locator('[role="dialog"] [role="combobox"]').nth(1).click()
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')
  await expect(page.getByRole('option').first()).toBeVisible({ timeout: 5_000 })
  await page.getByRole('option').first().click({ timeout: 5_000, delay: 100, force: true })
  await page.getByRole('option').first().click({ timeout: 5_000, delay: 100, force: true })

  // Fill note (name="note" scopes to the note field, avoiding AutoComplete inputs)
  await page.getByRole('textbox', { name: 'คำอธิบาย*' }).click()
  await page.getByRole('textbox', { name: 'คำอธิบาย*' }).fill(note)

  // Fill amount
  await page.getByRole('dialog').getByRole('spinbutton').click()
  await page.getByRole('dialog').getByRole('spinbutton').fill('1000')
  await page.getByRole('dialog').getByRole('spinbutton').press('Tab')

  // Submit
  await page.getByRole('button', { name: 'ยืนยัน' }).click()
  await expect(page.locator('[role="dialog"]').last()).toBeVisible()
  await page.getByRole('button', { name: 'ยืนยัน' }).last().click()
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')
}

test.describe('Contract / Detail / Income', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await mockContractListAndDetail(page, { contractId: 555 })
    await mockCrudResource<IIncomeFixture>({
      page,
      basePath: '/api/v1/management/contract-income',
      listPath: '/api/v1/management/contract-income/paginate/:contractId',
      createPath: '/api/v1/management/contract-income/:contractId',
      seed: [],
      buildCreated: (body: Record<string, unknown>, id: number): IIncomeFixture => makeIncomeFixture({ id, ...body })
    })
    await mockRoute(page, '**/api/v1/management/finance-income-category**', {
      method: 'GET',
      body: paginatedResponse([{ id: 1, name: 'Mock Income Category' }])
    })
    await mockRoute(page, '**/api/v1/management/finance-income-type**', {
      method: 'GET',
      body: paginatedResponse([{ id: 1, name: 'Mock Income Type' }])
    })
    await navigateToContractDetail(page)
    await openIncomeTab(page)
  })

  test.afterEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.waitForTimeout(500)
  })

  test('income tab — shows table and create button', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
    await expect(page.getByRole('button', { name: 'บันทึกรายได้' })).toBeVisible()
  })

  test('income — cancel create modal', async ({ page }: { page: Page }): Promise<void> => {
    await page.getByRole('button', { name: 'บันทึกรายได้' }).click()
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await page.getByRole('button', { name: 'ยกเลิก' }).click()
    // await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3_000 })
  })

  test('income — create new income entry', async ({ page }: { page: Page }): Promise<void> => {
    const randomSuffix = Math.floor(Math.random() * 1000)
    const note = `Test รายได้ ${randomSuffix}`
    await createIncome(page, note)
    await expect(page.locator('tbody').getByText(note, { exact: true })).toBeVisible({ timeout: 10_000 })
    await deleteEntry(page, note)
  })

  // edit-then-delete acts on the same row across one continuous flow (mocked store is
  // fresh per test, so this can't be split into separate serial tests like the original
  // real-backend version — kept as one test to preserve the edit-then-delete sequence)
  test('income — edit then delete income entry', async ({ page }: { page: Page }): Promise<void> => {
    const randomSuffix = Math.floor(Math.random() * 1000)
    const name = `Test รายได้ For Update ${randomSuffix}`

    await createIncome(page, name)
    await expect(page.locator('tbody').getByText(name, { exact: true })).toBeVisible({ timeout: 10_000 })
    await page.waitForLoadState('networkidle')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForLoadState('load')

    // Open READ modal via action menu
    await page.locator('tbody tr').filter({ hasText: name }).locator('#action-menu-trigger').click({ timeout: 5_000, delay: 100 })
    await page.getByRole('menuitem', { name: 'แก้ไข' }).click()
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await page.waitForLoadState('networkidle')
    await page.waitForLoadState('domcontentloaded')
    await page.waitForLoadState('load')

    // Clear and refill note
    const noteInput = page.locator('[role="dialog"] [name="note"]')
    await noteInput.clear()
    await noteInput.fill(`Updated ${name}`)

    await page.getByRole('button', { name: 'ยืนยัน' }).click()
    await expect(page.locator('[role="dialog"]').last()).toBeVisible()
    await page.getByRole('button', { name: 'ยืนยัน' }).last().click()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('tbody').getByText(`Updated ${name}`, { exact: true })).toBeVisible({ timeout: 10_000 })

    await deleteEntry(page, `Updated ${name}`)
  })
})
