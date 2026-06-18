import { expect, type Page, test } from '@playwright/test'
import { mockContractListAndDetail } from '../../fixtures/contract.fixture'
import { mockCrudResource, mockRoute, paginatedResponse } from '../../fixtures/mockApi'

const LIST_URL = '/contract/list'

interface IContactHistoryFixture {
  id: number
  contactAt: string
  topic: string
  note: string
  employee: { id: number, firstName: string, lastName: string }
}

function makeContactHistoryFixture (overrides: Partial<IContactHistoryFixture> = {}): IContactHistoryFixture {
  return {
    id: 1,
    contactAt: '2024-01-01',
    topic: 'OTHER',
    note: 'Seed Contact',
    employee: { id: 1, firstName: 'Mock', lastName: 'Employee' },
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

async function openContactHistoryTab (page: Page): Promise<void> {
  await page.locator('div.cursor-pointer').filter({ hasText: /^ประวัติการติดต่อ$/ }).click()
  await page.waitForLoadState('networkidle')
}

async function createContactHistory (page: Page, note: string): Promise<void> {
  await page.getByRole('button', { name: 'บันทึกการติดต่อ' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()

  // Select today's date from the datepicker (manual input is disabled)
  await page.locator('[role="dialog"] input[readonly]').first().click()
  await expect(page.locator('[data-p-today="true"]').first()).toBeVisible({ timeout: 3_000 })
  await page.locator('[data-p-today="true"]').first().click()

  // Select topic (first available)
  await page.locator('[role="dialog"] [role="combobox"]').nth(1).click()
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')
  await expect(page.getByRole('option').first()).toBeVisible({ timeout: 5_000 })
  await page.getByRole('option').first().click({ timeout: 5_000 })
  await page.waitForLoadState('networkidle')

  // Fill note (textarea)
  await page.locator('[role="dialog"] textarea[name="note"]').click()
  await page.locator('[role="dialog"] textarea[name="note"]').fill(note)

  // Submit
  await page.getByRole('button', { name: 'ยืนยัน' }).click()
  await expect(page.locator('[role="dialog"]').last()).toBeVisible()
  await page.getByRole('button', { name: 'ยืนยัน' }).last().click()
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')
}

test.describe('Contract / Detail / Contact History', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await mockContractListAndDetail(page, { contractId: 555 })
    await mockCrudResource<IContactHistoryFixture>({
      page,
      basePath: '/api/v1/management/contract-contact-history',
      listPath: '/api/v1/management/contract-contact-history/paginate/:contractId',
      createPath: '/api/v1/management/contract-contact-history/:contractId',
      supportsUpdate: false,
      supportsDelete: false,
      seed: [],
      buildCreated: (body: Record<string, unknown>, id: number): IContactHistoryFixture => makeContactHistoryFixture({ id, ...body })
    })
    await mockRoute(page, '**/api/v1/management/contract-loan-purpose**', {
      method: 'GET',
      body: paginatedResponse([{ id: 1, name: 'Mock Topic' }])
    })
    await navigateToContractDetail(page)
    await openContactHistoryTab(page)
  })

  test.afterEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.waitForTimeout(500)
  })

  test('contact history tab — shows table and create button', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
    await expect(page.getByRole('button', { name: 'บันทึกการติดต่อ' })).toBeVisible()
  })

  test('contact history — cancel create modal', async ({ page }: { page: Page }): Promise<void> => {
    await page.getByRole('button', { name: 'บันทึกการติดต่อ' }).click()
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await page.getByRole('button', { name: 'ยกเลิก' }).click()
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3_000 })
  })

  test('contact history — create new entry', async ({ page }: { page: Page }): Promise<void> => {
    const randomSuffix = Math.floor(Math.random() * 1000)
    const note = `Test ประวัติการติดต่อ ${randomSuffix}`
    await createContactHistory(page, note)
    await expect(page.locator('tbody').getByText(note, { exact: true })).toBeVisible({ timeout: 10_000 })
    // Contact history table has no delete/edit actions — no cleanup available via UI
  })
})
