import { expect, type Page, test } from '@playwright/test'

const URL = '/setting/customer/occupation/list'

test.describe('Setting / Occupation', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.goto(URL)
    await page.waitForLoadState('networkidle')
  })

  test('list — show occupation table', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
  })

  test.describe.serial('CRUD', () => {
    test('create — add new occupation', async ({ page }: { page: Page }): Promise<void> => {
      await page.getByRole('button', { name: 'เพิ่มอาชีพใหม่' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      await page.getByLabel('อาชีพ').fill('Test Occupation')

      // step 1: click ยืนยัน in form (FormAction)
      await page.getByRole('button', { name: 'ยืนยัน' }).click()

      // step 2: click ยืนยัน in ConfirmModal
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      // modal closes, item appears in table
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.locator('tbody').getByText('Test Occupation', { exact: true })).toBeVisible({ timeout: 10_000 })
    })

    test('update — edit first occupation', async ({ page }: { page: Page }): Promise<void> => {
    // open action menu on first row
      await page.getByRole('row', { name: 'Test Occupation' }).locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'แก้ไข' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      // update field
      const nameInput = page.getByLabel('อาชีพ')
      await nameInput.clear()
      await nameInput.fill('Updated Occupation')

      // step 1: ยืนยัน in form
      await page.getByRole('button', { name: 'ยืนยัน' }).click()

      // step 2: ยืนยัน in ConfirmModal
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.locator('tbody').getByText('Updated Occupation', { exact: true })).toBeVisible({ timeout: 10_000 })
    })

    test('delete — remove first occupation', async ({ page }: { page: Page }): Promise<void> => {
      const rows = page.locator('tbody tr')
      const countBefore = await rows.count()

      // open action menu
      await page.getByRole('row', { name: 'Updated Occupation' }).locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      // DeleteModal opens — single confirm
      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('confirm-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(rows).toHaveCount(countBefore - 1)
    })
  }) // end serial CRUD
})
