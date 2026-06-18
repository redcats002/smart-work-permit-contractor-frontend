import { expect, type Page, test } from '@playwright/test'
import { mockContractListAndDetail } from '../../fixtures/contract.fixture'
import { mockCrudResource, mockRoute, paginatedResponse } from '../../fixtures/mockApi'

const LIST_URL = '/contract/list'

interface IDocumentFixture {
  id: number
  date: string
  note: string
  documentType: string
  location: { id: number, name: string }
}

function makeDocumentFixture (overrides: Partial<IDocumentFixture> = {}): IDocumentFixture {
  return {
    id: 1,
    date: '2024-01-01',
    note: 'Seed Document',
    documentType: 'OTHER',
    location: { id: 1, name: 'Mock Warehouse' },
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

async function openDocumentTab (page: Page): Promise<void> {
  await page.locator('div.cursor-pointer').filter({ hasText: /^รายการเอกสาร$/ }).click()
  await page.waitForLoadState('networkidle')
}

async function createDocument (page: Page, note: string): Promise<void> {
  await page.getByRole('button', { name: 'บันทึกเอกสาร' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()

  // Select document type (static dropdown, first available)
  await page.locator('[role="dialog"] [role="combobox"]').first().click()
  await expect(page.getByRole('option').first()).toBeVisible({ timeout: 5_000 })
  await page.getByRole('option').first().click({ timeout: 5_000 })

  // Select warehouse/location (API dropdown, first available)
  await page.locator('[role="dialog"] [role="combobox"]').nth(1).click()
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')
  await expect(page.getByRole('option').first()).toBeVisible({ timeout: 5_000 })
  await page.getByRole('option').first().click({ timeout: 5_000 })
  await page.waitForLoadState('networkidle')

  // Fill note
  await page.getByRole('textbox', { name: 'คำอธิบาย*' }).click()
  await page.getByRole('textbox', { name: 'คำอธิบาย*' }).fill(note)

  // Submit
  await page.getByRole('button', { name: 'ยืนยัน' }).click()
  await expect(page.locator('[role="dialog"]').last()).toBeVisible()
  await page.getByRole('button', { name: 'ยืนยัน' }).last().click()
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')
}

async function deleteEntry (page: Page, rowText: string): Promise<void> {
  await page.waitForLoadState('networkidle')
  await page.locator('tbody tr').filter({ hasText: rowText }).locator('#action-menu-trigger').click({ timeout: 5_000, delay: 100 })
  await page.getByRole('menuitem', { name: 'ลบ' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()
  await page.getByRole('button', { name: 'ใช่, ฉันต้องการลบ' }).click()
  await page.waitForLoadState('networkidle')
}

test.describe('Contract / Detail / Document', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await mockContractListAndDetail(page, { contractId: 555 })
    await mockCrudResource<IDocumentFixture>({
      page,
      basePath: '/api/v1/management/contract-document',
      listPath: '/api/v1/management/contract-document/paginate/:contractId',
      createPath: '/api/v1/management/contract-document/:contractId',
      seed: [],
      buildCreated: (body: Record<string, unknown>, id: number): IDocumentFixture => makeDocumentFixture({ id, ...body })
    })
    await mockRoute(page, '**/api/v1/management/warehouse**', {
      method: 'GET',
      body: paginatedResponse([{ id: 1, name: 'Mock Warehouse', status: 'ACTIVE' }])
    })
    await navigateToContractDetail(page)
    await openDocumentTab(page)
  })

  test.afterEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.waitForTimeout(500)
  })

  test('document tab — shows table and create button', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
    await expect(page.getByRole('button', { name: 'บันทึกเอกสาร' })).toBeVisible()
  })

  test('document — cancel create modal', async ({ page }: { page: Page }): Promise<void> => {
    await page.getByRole('button', { name: 'บันทึกเอกสาร' }).click()
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await page.getByRole('button', { name: 'ยกเลิก' }).click()
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3_000 })
  })

  test('document — create new document entry', async ({ page }: { page: Page }): Promise<void> => {
    const randomSuffix = Math.floor(Math.random() * 1000)
    const note = `Test เอกสาร ${randomSuffix}`
    await createDocument(page, note)
    await expect(page.locator('tbody').getByText(note, { exact: true })).toBeVisible({ timeout: 10_000 })
    await deleteEntry(page, note)
  })

  // edit-then-delete acts on the same row across one continuous flow (mocked store is
  // fresh per test, so this can't be split into separate serial tests like the original
  // real-backend version — kept as one test to preserve the edit-then-delete sequence)
  test('document — edit then delete document entry', async ({ page }: { page: Page }): Promise<void> => {
    const randomSuffix = Math.floor(Math.random() * 1000)
    const name = `Test เอกสาร For Update ${randomSuffix}`

    await createDocument(page, name)
    await expect(page.locator('tbody').getByText(name, { exact: true })).toBeVisible({ timeout: 10_000 })
    await page.waitForLoadState('networkidle')

    await page.locator('tbody tr').filter({ hasText: name }).locator('#action-menu-trigger').click({ timeout: 5_000, delay: 100 })
    await page.getByRole('menuitem', { name: 'แก้ไข' }).click()
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await page.waitForLoadState('networkidle')

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
