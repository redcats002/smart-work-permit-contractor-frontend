import { expect, type Page, test } from '@playwright/test'

const URL = '/setting/customer/customer-group/list'

async function createCustomerGroup (page: Page, name: string): Promise<void> {
  await page.getByRole('button', { name: 'เพิ่มกลุ่มลูกค้าใหม่' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()

  await page.getByLabel('กลุ่มลูกค้า').fill(name)

  await page.getByRole('button', { name: 'ยืนยัน' }).click()
  await expect(page.locator('[role="dialog"]').last()).toBeVisible()
  await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

  await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
  await page.waitForLoadState('networkidle')
  await expect(page.locator('tbody').getByText(name, { exact: true })).toBeVisible({ timeout: 10_000 })
}

async function deleteItem (page: Page, name: string): Promise<void> {
  await page.goto(URL)
  await page.waitForLoadState('networkidle')
  await page.locator('tbody tr').filter({ hasText: name }).locator('#action-menu-trigger').first().click()
  await page.getByRole('menuitem', { name: 'ลบ' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()
  await page.getByTestId('confirm-button').click()
  await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
  await page.waitForLoadState('networkidle')
}

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
      const name = `Test กลุ่มลูกค้า ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      await createCustomerGroup(page, name)

      await deleteItem(page, name)
    })
  })

  test.describe('Setting / Update / Customer Group', () => {
    test('update — edit customer group', async ({ page }: { page: Page }): Promise<void> => {
      const name = `Test กลุ่มลูกค้า For Update ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      const updatedName = `Updated ${name}`
      await createCustomerGroup(page, name)

      await page.locator('tbody tr').filter({ hasText: name }).locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'แก้ไข' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      const nameInput = page.getByLabel('กลุ่มลูกค้า')
      await nameInput.clear()
      await nameInput.fill(updatedName)

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(page.locator('tbody').getByText(updatedName, { exact: true })).toBeVisible({ timeout: 10_000 })

      await deleteItem(page, updatedName)
    })
  })

  test.describe.serial('Setting / Delete / Customer Group', () => {
    let deleteName: string

    test.beforeAll(async (): Promise<void> => {
      deleteName = `Test กลุ่มลูกค้า For Delete ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
    })

    test('delete — cancel keeps row count', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(URL)
      await page.waitForLoadState('networkidle')
      await createCustomerGroup(page, deleteName)

      const rows = page.locator('tbody tr')
      const countBefore = await rows.count()

      await page.locator('tbody tr').filter({ hasText: deleteName }).locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('cancel-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(rows).toHaveCount(countBefore)
    })

    test('delete — confirm removes row', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(URL)
      await page.waitForLoadState('networkidle')

      const rows = page.locator('tbody tr')
      const countBefore = await rows.count()

      await page.locator('tbody tr').filter({ hasText: deleteName }).locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('confirm-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(rows).toHaveCount(countBefore - 1)
    })
  })
})
