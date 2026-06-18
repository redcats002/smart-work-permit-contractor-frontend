import { expect, type Page, test } from '@playwright/test'
import { mockCrudResource } from '../../fixtures/mockApi'

const URL = '/setting/other/how-did-find-us/list'

interface IHowDidFindUsFixture {
  id: number
  name: string
}

function makeHowDidFindUsFixture (overrides: Partial<IHowDidFindUsFixture> = {}): IHowDidFindUsFixture {
  return { id: 1, name: 'Seed Channel', ...overrides }
}

async function createChannel (page: Page, name: string): Promise<void> {
  await page.getByRole('button', { name: 'เพิ่มช่องทางใหม่' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()

  await page.getByLabel('ช่องทาง').fill(name)

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

test.describe('Setting / How Did Find Us', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await mockCrudResource<IHowDidFindUsFixture>({
      page,
      basePath: '/api/v1/management/how-did-find-us',
      supportsDetail: false,
      seed: [makeHowDidFindUsFixture({ id: 1 })],
      buildCreated: (body: Record<string, unknown>, id: number): IHowDidFindUsFixture => makeHowDidFindUsFixture({ id, ...body })
    })
    await page.goto(URL)
    await page.waitForLoadState('networkidle')
  })

  test('list — show table', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
  })

  test.describe('Setting / Create / How Did Find Us', () => {
    test('create — cancel closes modal', async ({ page }: { page: Page }): Promise<void> => {
      await page.getByRole('button', { name: 'เพิ่มช่องทางใหม่' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      await page.getByRole('button', { name: 'ยกเลิก' }).click()
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3_000 })
    })

    test('create — validation error on empty submit', async ({ page }: { page: Page }): Promise<void> => {
      await page.getByRole('button', { name: 'เพิ่มช่องทางใหม่' }).click()

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[name="name"]')).toBeVisible()
    })

    test('create — add new channel', async ({ page }: { page: Page }): Promise<void> => {
      const name = `Test ช่องทาง ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      await createChannel(page, name)

      await deleteItem(page, name)
    })
  })

  test.describe('Setting / Update / How Did Find Us', () => {
    test('update — edit channel', async ({ page }: { page: Page }): Promise<void> => {
      const name = `Test ช่องทาง For Update ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
      const updatedName = `Updated ${name}`
      await createChannel(page, name)

      await page.locator('tbody tr').filter({ hasText: name }).locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'แก้ไข' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      const nameInput = page.getByLabel('ช่องทาง')
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

  test.describe.serial('Setting / Delete / How Did Find Us', () => {
    let deleteName: string

    test.beforeAll(async (): Promise<void> => {
      deleteName = `Test ช่องทาง For Delete ${Math.random().toString(36).slice(2, 7).toUpperCase()}`
    })

    test('delete — cancel keeps row count', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(URL)
      await page.waitForLoadState('networkidle')
      await createChannel(page, deleteName)

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
      // each test gets a fresh mocked store (see outer beforeEach), so this test
      // creates its own row rather than relying on the previous test's row surviving
      await page.goto(URL)
      await page.waitForLoadState('networkidle')
      await createChannel(page, deleteName)

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
