import { expect, type Page, test } from '@playwright/test'
import { mockCrudResource } from '../../fixtures/mockApi'

const LIST_URL = '/setting/other/branch/list'
const CREATE_URL = '/setting/other/branch/create'

interface IBranchFixture {
  id: number
  name: string
  status: string
}

function makeBranchFixture (overrides: Partial<IBranchFixture> = {}): IBranchFixture {
  return { id: 1, name: 'Seed สาขา', status: 'ACTIVE', ...overrides }
}

async function fillBranchTimeSlot (page: Page): Promise<void> {
  await page.getByRole('button', { name: 'วัน/เวลา ทำการ' }).click()

  // Select Monday (จ) from Weekday component — exact match avoids partial Thai text overlap
  await page.locator('[aria-pressed]').filter({ hasText: /^จ$/ }).click()

  // Open the time range picker
  await page.locator('button').filter({ hasText: 'เลือกเวลา' }).click()
  await expect(page.getByText('เริ่ม')).toBeVisible()

  // Set start time to 01:00 by clicking hours-up once in the เริ่ม section
  await page.locator('.text-xs').filter({ hasText: 'เริ่ม' }).locator('button').first().click()

  // Set end time to 02:00 by clicking hours-up twice in the สิ้นสุด section
  const endHoursUp = page.locator('.text-xs').filter({ hasText: 'สิ้นสุด' }).locator('button').first()
  await endHoursUp.click()
  await endHoursUp.click()

  // Dismiss the popup
  await page.keyboard.press('Escape')
}

async function createBranch (page: Page, name: string, idNo: string): Promise<void> {
  await page.goto(CREATE_URL)
  await page.waitForLoadState('networkidle')

  await page.getByLabel('ชื่อสาขา').fill(name)
  await page.getByLabel('Branch Code').fill(idNo)
  await page.getByLabel('เลขประจำตัวผู้เสียภาษี').fill('1234567890123')

  // Open the date picker calendar (manual-input is disabled; must use the calendar icon button)
  await page.getByRole('combobox', { name: 'วันที่เปิดสาขา*' }).click()
  await page.locator('[data-pc-section="day"]').filter({ hasNot: page.locator('[data-p-disabled="true"]') }).first().click()

  await fillBranchTimeSlot(page)

  await page.getByRole('button', { name: 'ยืนยัน' }).click()
  await expect(page.locator('[role="dialog"]').last()).toBeVisible()
  await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

  await expect(page).toHaveURL(/branch\/list/, { timeout: 10_000 })
  await page.waitForLoadState('networkidle')
}

// bubbles: false prevents PrimeVue's document-level outside-click handler from firing
// in the same tick, which would immediately close the menu after opening it
async function openActionMenu (page: Page): Promise<void> {
  await page.getByTestId('action-menu-trigger').nth(2).click()
  await expect(page.locator('#overlay_menu')).toBeVisible({ timeout: 5_000 })
}

async function navigateToBranchDetail (page: Page, name: string): Promise<void> {
  await page.goto(LIST_URL)
  await page.waitForLoadState('load')
  await page.waitForLoadState('domcontentloaded')
  await expect(page.locator('tbody').getByText(name, { exact: true })).toBeVisible({ timeout: 10_000 })
  await page.locator('tbody tr').filter({ hasText: name }).getByRole('link').click()
  await expect(page).toHaveURL(/setting\/other\/branch\/([\s\S]*)/, { timeout: 5_000 })
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')
}

async function deleteCreatedBranch (page: Page, name: string): Promise<void> {
  await navigateToBranchDetail(page, name)
  await openActionMenu(page)
  await page.locator('#overlay_menu').getByRole('menuitem', { name: 'ลบ' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()
  await page.getByTestId('confirm-button').click()
  await expect(page).toHaveURL(/branch\/list/, { timeout: 10_000 })
  await page.waitForLoadState('networkidle')
}

test.describe('Setting / Branch', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await mockCrudResource<IBranchFixture>({
      page,
      basePath: '/api/v1/management/branch',
      seed: [makeBranchFixture({ id: 1 })],
      buildCreated: (body: Record<string, unknown>, id: number): IBranchFixture => makeBranchFixture({ id, ...body })
    })
    await page.goto(LIST_URL)
    await page.waitForLoadState('networkidle')
  })

  test('list — show table', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
  })

  test('list — create button navigates to create page', async ({ page }: { page: Page }): Promise<void> => {
    await page.getByRole('link', { name: 'เพิ่มสาขาใหม่' }).click()
    await expect(page).toHaveURL(/branch\/create/, { timeout: 5_000 })
  })

  test.describe('Setting / Create / Branch', () => {
    test('create — cancel returns to list', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(CREATE_URL)
      await page.waitForLoadState('networkidle')

      await page.getByRole('button', { name: 'ยกเลิก' }).click()
      await expect(page).toHaveURL(/branch\/list/, { timeout: 5_000 })
    })

    test('create — submit button disabled without time slot', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(CREATE_URL)
      await page.waitForLoadState('networkidle')

      await page.getByLabel('ชื่อสาขา').fill('Test สาขา')
      await page.getByLabel('Branch Code').fill('00001')
      await page.getByLabel('เลขประจำตัวผู้เสียภาษี').fill('1234567890123')

      await expect(page.getByRole('button', { name: 'ยืนยัน' }).first()).toBeDisabled()
    })

    test('create — add new branch', async ({ page }: { page: Page }): Promise<void> => {
      const name = `Test สาขา ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      const idNo = String(Math.floor(10000 + Math.random() * 90000))
      await createBranch(page, name, idNo)
      await expect(page.locator('tbody').getByText(name, { exact: true })).toBeVisible({ timeout: 10_000 })

      await deleteCreatedBranch(page, name)
    })
  })

  test.describe('Setting / Update / Branch', () => {
    test('update — edit branch from detail page', async ({ page }: { page: Page }): Promise<void> => {
      const name = `Test สาขา For Update ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      const idNo = String(Math.floor(10000 + Math.random() * 90000))
      const updatedName = `Updated ${name}`
      await createBranch(page, name, idNo)
      await navigateToBranchDetail(page, name)

      await openActionMenu(page)
      await page.locator('#overlay_menu').getByRole('menuitem', { name: 'แก้ไข' }).click()

      await expect(page).toHaveURL(/setting\/other\/branch\/edit\/([\s\S]*)/, { timeout: 5_000 })
      await page.waitForLoadState('networkidle')

      const nameInput = page.getByLabel('ชื่อสาขา')
      await nameInput.clear()
      await nameInput.fill(updatedName)

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await page.waitForLoadState('networkidle')
      await page.waitForLoadState('domcontentloaded')
      await page.waitForLoadState('load')

      await expect(page.locator('[role="dialog"]').last()).toBeVisible({ timeout: 5_000 })
      await expect(page.getByRole('dialog').getByTestId('confirm-button')).toBeVisible({ timeout: 5_000 })
      await page.getByRole('dialog').getByTestId('confirm-button').click()

      await expect(page).toHaveURL(/setting\/other\/branch\/([\s\S]*)/, { timeout: 10_000 })
      await expect(page.getByText(updatedName)).toBeVisible({ timeout: 10_000 })

      await deleteCreatedBranch(page, updatedName)
    })
  })

  test.describe.serial('Setting / Delete / Branch', () => {
    let deleteName: string
    let deleteIdNo: string

    test.beforeAll(async (): Promise<void> => {
      deleteName = `Test สาขา For Delete ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      deleteIdNo = String(Math.floor(10000 + Math.random() * 90000))
    })

    test('delete — cancel stays on detail page', async ({ page }: { page: Page }): Promise<void> => {
      await createBranch(page, deleteName, deleteIdNo)
      await navigateToBranchDetail(page, deleteName)

      await openActionMenu(page)
      await page.locator('#overlay_menu').getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('cancel-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(page).toHaveURL(/branch\/([\s\S]*)/, { timeout: 3_000 })
    })

    test('delete — confirm redirects to list and removes row', async ({ page }: { page: Page }): Promise<void> => {
      // each test gets a fresh mocked store (see outer beforeEach), so this test
      // creates its own row rather than relying on the previous test's row surviving
      await createBranch(page, deleteName, deleteIdNo)
      await page.goto(LIST_URL)
      await page.waitForLoadState('networkidle')
      const countBefore = await page.locator('tbody tr').count()

      await navigateToBranchDetail(page, deleteName)

      await openActionMenu(page)
      await page.locator('#overlay_menu').getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('confirm-button').click()

      await expect(page).toHaveURL(/branch\/list/, { timeout: 10_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.locator('tbody tr')).toHaveCount(countBefore - 1)
    })
  })
})
