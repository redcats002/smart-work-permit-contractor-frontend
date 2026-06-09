import { expect, type Page, test } from '@playwright/test'

const LIST_URL = '/setting/other/branch/list'
const CREATE_URL = '/setting/other/branch/create'

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
  const dateField = page.locator('label').filter({ hasText: 'วันที่เปิดสาขา' }).locator('..')
  await dateField.getByRole('button').click()
  // Click the first available (non-disabled) date in the calendar grid
  await page.locator('[data-pc-section="day"]').filter({ hasNot: page.locator('[data-p-disabled="true"]') }).first().click()

  await fillBranchTimeSlot(page)

  await page.getByRole('button', { name: 'ยืนยัน' }).click()
  await expect(page.locator('[role="dialog"]').last()).toBeVisible()
  await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

  await expect(page).toHaveURL(/branch\/list/, { timeout: 10_000 })
  await page.waitForLoadState('networkidle')
}

async function navigateToBranchDetail (page: Page, name: string): Promise<void> {
  await page.goto(LIST_URL)
  await page.waitForLoadState('networkidle')
  await expect(page.locator('tbody').getByText(name, { exact: true })).toBeVisible({ timeout: 10_000 })
  await page.locator('tbody tr').filter({ hasText: name }).getByRole('link').click()
  await expect(page).toHaveURL(/branch\/\d+/, { timeout: 5_000 })
  await page.waitForLoadState('networkidle')
}

test.describe('Setting / Branch', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
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
      await createBranch(page, 'Test สาขา', '00099')
      await expect(page.locator('tbody').getByText('Test สาขา', { exact: true })).toBeVisible({ timeout: 10_000 })
    })
  })

  test.describe('Setting / Update / Branch', () => {
    test('update — edit branch from detail page', async ({ page }: { page: Page }): Promise<void> => {
      await createBranch(page, 'Test สาขา For Update', '00098')
      await navigateToBranchDetail(page, 'Test สาขา For Update')

      await page.locator('#action-menu-trigger').click()
      await page.getByRole('menuitem', { name: 'แก้ไข' }).click()

      await expect(page).toHaveURL(/branch\/\d+\/edit/, { timeout: 5_000 })
      await page.waitForLoadState('networkidle')

      const nameInput = page.getByLabel('ชื่อสาขา')
      await nameInput.clear()
      await nameInput.fill('Updated Test สาขา For Update')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      // Edit redirects back to detail page
      await expect(page).toHaveURL(/branch\/\d+/, { timeout: 10_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.getByText('Updated Test สาขา For Update', { exact: true })).toBeVisible({ timeout: 10_000 })
    })
  })

  test.describe.serial('Setting / Delete / Branch', () => {
    test('delete — cancel stays on detail page', async ({ page }: { page: Page }): Promise<void> => {
      await createBranch(page, 'Test สาขา For Delete', '00097')
      await navigateToBranchDetail(page, 'Test สาขา For Delete')

      await page.locator('#action-menu-trigger').click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('cancel-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(page).toHaveURL(/branch\/\d+/, { timeout: 3_000 })
    })

    test('delete — confirm redirects to list and removes row', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(LIST_URL)
      await page.waitForLoadState('networkidle')
      const countBefore = await page.locator('tbody tr').count()

      await navigateToBranchDetail(page, 'Test สาขา For Delete')

      await page.locator('#action-menu-trigger').click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('confirm-button').click()

      await expect(page).toHaveURL(/branch\/list/, { timeout: 10_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.locator('tbody tr')).toHaveCount(countBefore - 1)
    })
  })
})
