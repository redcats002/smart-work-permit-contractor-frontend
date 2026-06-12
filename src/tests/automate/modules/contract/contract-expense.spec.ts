import { expect, type Page, test } from '@playwright/test'

const LIST_URL = '/contract/list'

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

async function openExpenseTab (page: Page): Promise<void> {
  await page.locator('div.cursor-pointer').filter({ hasText: /^ค่าใช้จ่าย$/ }).click()
  await page.waitForLoadState('networkidle')
}

async function createExpense (page: Page, note: string): Promise<void> {
  await page.getByRole('button', { name: 'บันทึกค่าใช้จ่าย' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()

  // Select expense category (first available)
  await page.locator('[role="dialog"] [role="combobox"]').first().click()
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')
  await expect(page.getByRole('option').first()).toBeVisible({ timeout: 5_000 })
  await page.getByRole('option').first().click({ timeout: 5_000 })
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')

  // Select expense type (first available — depends on selected category)
  await page.locator('[role="dialog"] [role="combobox"]').nth(1).click()
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')
  await expect(page.getByRole('option').first()).toBeVisible({ timeout: 5_000 })
  await page.getByRole('option').first().click({ timeout: 5_000, delay: 100, force: true })
  await page.getByRole('option').first().click({ timeout: 5_000, delay: 100, force: true })
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('load')

  // Fill note
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

async function deleteEntry (page: Page, rowText: string): Promise<void> {
  await page.waitForLoadState('networkidle')
  await page.locator('tbody tr').filter({ hasText: rowText }).locator('#action-menu-trigger').click({ timeout: 5_000, delay: 100 })
  await page.getByRole('menuitem', { name: 'ลบ' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()
  await page.getByRole('button', { name: 'ใช่, ฉันต้องการลบ' }).click()
  await page.waitForLoadState('networkidle')
}

test.describe('Contract / Detail / Expense', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await navigateToContractDetail(page)
    await openExpenseTab(page)
  })

  test.afterEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.waitForTimeout(500)
  })

  test('expense tab — shows table and create button', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
    await expect(page.getByRole('button', { name: 'บันทึกค่าใช้จ่าย' })).toBeVisible()
  })

  test('expense — cancel create modal', async ({ page }: { page: Page }): Promise<void> => {
    await page.getByRole('button', { name: 'บันทึกค่าใช้จ่าย' }).click()
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await page.getByRole('button', { name: 'ยกเลิก' }).click()
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3_000 })
  })

  test('expense — create new expense entry', async ({ page }: { page: Page }): Promise<void> => {
    const randomSuffix = Math.floor(Math.random() * 1000)
    const note = `Test ค่าใช้จ่าย ${randomSuffix}`
    await createExpense(page, note)
    await expect(page.locator('tbody').getByText(note, { exact: true })).toBeVisible({ timeout: 10_000 })
    await deleteEntry(page, note)
  })

  test.describe.serial('Contract / Detail / Expense / Update & Delete', () => {
    const randomSuffix = Math.floor(Math.random() * 1000)
    const name = `Test ค่าใช้จ่าย For Update ${randomSuffix}`

    test('expense — edit expense entry', async ({ page }: { page: Page }): Promise<void> => {
      await createExpense(page, name)
      await expect(page.locator('tbody').getByText(name, { exact: true })).toBeVisible({ timeout: 10_000 })
      await page.waitForLoadState('networkidle')

      await page.locator('tbody tr').filter({ hasText: name }).locator('#action-menu-trigger').click({ timeout: 5_000, delay: 100 })
      await page.getByRole('menuitem', { name: 'แก้ไข' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.waitForLoadState('networkidle')

      const noteInput = page.locator('[role="dialog"] [name="note"]')
      await noteInput.focus()
      await noteInput.clear({ timeout: 5_000, force: true })
      await page.waitForLoadState('load')
      await noteInput.fill(`Updated ${name}`, { timeout: 5_000, force: true })

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()
      await page.waitForLoadState('load')
      await page.waitForLoadState('domcontentloaded')
      await page.waitForLoadState('networkidle')
      await expect(page.locator('tbody').getByText(`Updated ${name}`, { exact: true })).toBeVisible({ timeout: 10_000 })
    })

    test('expense — delete expense entry', async ({ page }: { page: Page }): Promise<void> => {
      await deleteEntry(page, `Updated ${name}`)
    })
  })
})
