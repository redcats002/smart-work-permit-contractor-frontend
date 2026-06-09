import { expect, type Page, test } from '@playwright/test'

const URL = '/setting/customer/customer-group/list'

test.describe('Setting / Customer Group', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.goto(URL)
    await page.waitForLoadState('networkidle')
  })

  test('list — show table', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
  })

  test.describe('Setting / Create / Customer Group', () => {
    test('create — cancel closes modal', async ({ page }: { page: Page }): Promise<void> => {
      await page.getByRole('button', { name: 'เพิ่มกลุ่มลูกค้าใหม่' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      await page.getByRole('button', { name: 'ยกเลิก' }).click()
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3_000 })
    })

    test('create — validation error on empty submit', async ({ page }: { page: Page }): Promise<void> => {
      await page.getByRole('button', { name: 'เพิ่มกลุ่มลูกค้าใหม่' }).click()

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[name="name"]')).toBeVisible()
    })

    test('create — add new customer group', async ({ page }: { page: Page }): Promise<void> => {
      await page.getByRole('button', { name: 'เพิ่มกลุ่มลูกค้าใหม่' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      await page.getByLabel('กลุ่มลูกค้า').fill('Test กลุ่มลูกค้า')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.locator('tbody').getByText('Test กลุ่มลูกค้า', { exact: true })).toBeVisible({ timeout: 10_000 })
    })
  })

  test.describe('Setting / Update / Customer Group', () => {
    test('update — edit customer group', async ({ page }: { page: Page }): Promise<void> => {
      await page.getByRole('button', { name: 'เพิ่มกลุ่มลูกค้าใหม่' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      await page.getByLabel('กลุ่มลูกค้า').fill('Test กลุ่มลูกค้า For Update')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(page.locator('tbody').getByText('Test กลุ่มลูกค้า For Update', { exact: true })).toBeVisible({ timeout: 10_000 })

      await page.getByRole('row', { name: 'Test กลุ่มลูกค้า For Update' }).locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'แก้ไข' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      const nameInput = page.getByLabel('กลุ่มลูกค้า')
      await nameInput.clear()
      await nameInput.fill('Updated Test กลุ่มลูกค้า For Update')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(page.locator('tbody').getByText('Updated Test กลุ่มลูกค้า For Update', { exact: true })).toBeVisible({ timeout: 10_000 })
    })
  })

  test.describe.serial('Setting / Delete / Customer Group', () => {
    test('delete — cancel keeps row count', async ({ page }: { page: Page }): Promise<void> => {
      await page.getByRole('button', { name: 'เพิ่มกลุ่มลูกค้าใหม่' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      await page.getByLabel('กลุ่มลูกค้า').fill('Test กลุ่มลูกค้า For Delete')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.locator('tbody').getByText('Test กลุ่มลูกค้า For Delete', { exact: true })).toBeVisible({ timeout: 10_000 })

      const rows = page.locator('tbody tr')
      const countBefore = await rows.count()

      await page.getByRole('row', { name: 'Test กลุ่มลูกค้า For Delete' }).locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('cancel-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(rows).toHaveCount(countBefore)
    })

    test('delete — confirm removes row', async ({ page }: { page: Page }): Promise<void> => {
      const rows = page.locator('tbody tr')
      const countBefore = await rows.count()

      await page.getByRole('row', { name: 'Test กลุ่มลูกค้า For Delete' }).locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('confirm-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(rows).toHaveCount(countBefore - 1)
    })
  })
})
