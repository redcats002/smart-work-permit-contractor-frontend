import { expect, type Page, test } from '@playwright/test'
import { mockCrudResource } from '../../fixtures/mockApi'

const URL = '/setting/customer/occupation/list'

interface IOccupationFixture {
  id: number
  name: string
}

function makeOccupationFixture (overrides: Partial<IOccupationFixture> = {}): IOccupationFixture {
  return { id: 1, name: 'Seed Occupation', ...overrides }
}

test.describe('Setting / Occupation', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await mockCrudResource<IOccupationFixture>({
      page,
      basePath: '/api/v1/management/customer-occupation',
      supportsDetail: false,
      seed: [makeOccupationFixture({ id: 1 })],
      buildCreated: (body: Record<string, unknown>, id: number): IOccupationFixture => makeOccupationFixture({ id, ...body })
    })
    await page.goto(URL)
    await page.waitForLoadState('networkidle')
  })

  test('list — show occupation table', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.locator('table')).toBeVisible()
  })

  // create/update/delete act on the same row across one continuous flow (mocked store
  // is fresh per test, so these can't be split into separate serial tests like the
  // original real-backend version — kept as one test to preserve the create-then-edit-then-delete sequence)
  test('CRUD — create, update, then delete an occupation', async ({ page }: { page: Page }): Promise<void> => {
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

    // open action menu on the created row
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

    const rows = page.locator('tbody tr')
    const countBefore = await rows.count()

    // open action menu on the updated row
    await page.getByRole('row', { name: 'Updated Occupation' }).locator('#action-menu-trigger').first().click()
    await page.getByRole('menuitem', { name: 'ลบ' }).click()

    // DeleteModal opens — single confirm
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await page.getByTestId('confirm-button').click()

    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
    await expect(rows).toHaveCount(countBefore - 1)
  })
})
