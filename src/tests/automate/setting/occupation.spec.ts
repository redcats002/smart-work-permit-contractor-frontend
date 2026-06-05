import { expect, test } from '@playwright/test'

const URL = 'http://localhost:8080/setting/customer/occupation/list'

test.describe('Setting / Occupation', () => {
  test.beforeEach(async ({ page }: { page: any }): Promise<void> => {
    await page.goto(URL)
    await page.waitForLoadState('networkidle')
  })

  test('list — show occupation table', async ({ page }: { page: any }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
  })

  test('create — add new occupation', async ({ page }: { page: any }): Promise<void> => {
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
    await expect(page.locator('text=Test Occupation')).toBeVisible()
  })

  test('update — edit first occupation', async ({ page }: { page: any }): Promise<void> => {
    // open action menu on first row
    await page.locator('[id="action-menu-trigger"]').first().click()
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
    await expect(page.locator('text=Updated Occupation')).toBeVisible()
  })

  test('delete — remove first occupation', async ({ page }: { page: any }): Promise<void> => {
    const rows = page.locator('tbody tr')
    const countBefore = await rows.count()

    // open action menu
    await page.locator('[id="action-menu-trigger"]').first().click()
    await page.getByRole('menuitem', { name: 'ลบ' }).click()

    // DeleteModal opens — single confirm
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await page.getByRole('button', { name: 'ยืนยัน' }).click()

    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
    await expect(rows).toHaveCount(countBefore - 1)
  })
})
