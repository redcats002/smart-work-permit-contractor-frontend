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

async function openIncomeTab (page: Page): Promise<void> {
  await page.locator('div.cursor-pointer').filter({ hasText: /^รายได้$/ }).click()
  await page.waitForLoadState('networkidle')
}

async function createIncome (page: Page, note: string): Promise<void> {
  await page.getByRole('button', { name: 'บันทึกรายได้' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()

  // Select income category (first available)
  await page.locator('[role="dialog"] [role="combobox"]').first().click()
  await page.waitForLoadState('networkidle')
  await page.getByRole('option').first().click()
  await page.waitForLoadState('networkidle')

  // Select income type (first available)
  await page.locator('[role="dialog"] [role="combobox"]').nth(1).click()
  await page.waitForLoadState('networkidle')
  await page.getByRole('option').first().click()

  // Fill note (name="note" scopes to the note field, avoiding AutoComplete inputs)
  await page.locator('[role="dialog"] [name="note"]').fill(note)

  // Fill amount
  await page.getByRole('dialog').getByRole('spinbutton').click()
  await page.getByRole('dialog').getByRole('spinbutton').fill('1000')

  // Submit
  await page.getByRole('button', { name: 'ยืนยัน' }).click()
  await expect(page.locator('[role="dialog"]').last()).toBeVisible()
  await page.getByRole('button', { name: 'ยืนยัน' }).last().click()
  await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
  await page.waitForLoadState('networkidle')
}

test.describe('Contract / Detail / Income', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await navigateToContractDetail(page)
    await openIncomeTab(page)
  })

  test('income tab — shows table and create button', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
    await expect(page.getByRole('button', { name: 'บันทึกรายได้' })).toBeVisible()
  })

  test('income — cancel create modal', async ({ page }: { page: Page }): Promise<void> => {
    await page.getByRole('button', { name: 'บันทึกรายได้' }).click()
    await expect(page.locator('[role="dialog"]')).toBeVisible()

    await page.getByRole('button', { name: 'ยกเลิก' }).click()
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3_000 })
  })

  test('income — create new income entry', async ({ page }: { page: Page }): Promise<void> => {
    await createIncome(page, 'Test รายได้')
    await expect(page.locator('tbody').getByText('Test รายได้', { exact: true })).toBeVisible({ timeout: 10_000 })
  })

  test.describe.serial('Contract / Detail / Income / Update & Delete', () => {
    test('income — edit income entry from read modal', async ({ page }: { page: Page }): Promise<void> => {
      await createIncome(page, 'Test รายได้ For Update')
      await expect(page.locator('tbody').getByText('Test รายได้ For Update', { exact: true })).toBeVisible({ timeout: 10_000 })

      // Open READ modal via action menu
      await page.locator('tbody tr').filter({ hasText: 'Test รายได้ For Update' }).locator('#action-menu-trigger').click()
      await page.getByRole('menuitem', { name: 'แก้ไข' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      // Clear and refill note
      const noteInput = page.locator('[role="dialog"] [name="note"]')
      await noteInput.clear()
      await noteInput.fill('Updated Test รายได้ For Update')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.locator('tbody').getByText('Updated Test รายได้ For Update', { exact: true })).toBeVisible({ timeout: 10_000 })
    })

    test('income — delete income entry', async ({ page }: { page: Page }): Promise<void> => {
      const rows = page.locator('tbody tr')
      const countBefore = await rows.count()

      await page.locator('tbody tr').filter({ hasText: 'Updated Test รายได้ For Update' }).locator('#action-menu-trigger').click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      // ModalIncome in DELETE mode
      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByRole('button', { name: 'ใช่, ฉันต้องการลบ' }).click()

      // Inner ConfirmModal
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await page.waitForLoadState('networkidle')
      await expect(rows).toHaveCount(countBefore - 1)
    })
  })
})
