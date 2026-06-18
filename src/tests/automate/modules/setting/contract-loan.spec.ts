import { expect, type Page, test } from '@playwright/test'
import { mockCrudResource } from '../../fixtures/mockApi'

const SETTING_LIST_URL = `/setting/list`
const CONTRACT_LOAN_TYPE_URL = `/setting/contract/contract-loan-type/list`

interface IContractLoanTypeFixture {
  id: number
  name: string
}

function makeContractLoanTypeFixture (overrides: Partial<IContractLoanTypeFixture> = {}): IContractLoanTypeFixture {
  return { id: 1, name: 'Seed Loan Type', ...overrides }
}

async function createLoanType (page: Page, name: string): Promise<void> {
  await page.getByRole('button', { name: 'เพิ่มประเภทเงินกู้ใหม่' }).click()
  await expect(page.locator('[role="dialog"]')).toBeVisible()

  await page.getByLabel('ประเภทเงินกู้').fill(name)

  await page.getByRole('button', { name: 'ยืนยัน' }).click()
  await expect(page.locator('[role="dialog"]').last()).toBeVisible()
  await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

  await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
  await page.waitForLoadState('networkidle')
  await expect(page.getByText(name, { exact: true })).toBeVisible({ timeout: 5_000 })
}

test.describe('Setting / Contract Loan Type', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await mockCrudResource<IContractLoanTypeFixture>({
      page,
      basePath: '/api/v1/management/contract-loan-type',
      supportsDetail: false,
      seed: [makeContractLoanTypeFixture({ id: 1 })],
      buildCreated: (body: Record<string, unknown>, id: number): IContractLoanTypeFixture => makeContractLoanTypeFixture({ id, ...body })
    })
    await page.goto(CONTRACT_LOAN_TYPE_URL)
    await page.waitForLoadState('networkidle')
  })

  test.describe('Setting List', () => {
    test('navigate to contract-loan-type from setting list', async ({ page }: { page: Page }): Promise<void> => {
      await page.goto(SETTING_LIST_URL)
      await page.waitForLoadState('networkidle')

      await expect(page.getByRole('link', { name: 'ประเภทเงินกู้' })).toBeVisible()
      await page.getByRole('link', { name: 'ประเภทเงินกู้' }).click()
      await expect(page).toHaveURL(/contract-loan-type/, { timeout: 5_000 })
    })

    test('list — show table', async ({ page }: { page: Page }): Promise<void> => {
      await expect(page.locator('table')).toBeVisible()
    })
  })

  test.describe('Setting / Create / Contract Loan Type', () => {
    test('create — cancel closes modal', async ({ page }: { page: Page }): Promise<void> => {
      await page.getByRole('button', { name: 'เพิ่มประเภทเงินกู้ใหม่' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      await page.getByRole('button', { name: 'ยกเลิก' }).click()
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 3_000 })
    })

    test('create — validation error on empty submit', async ({ page }: { page: Page }): Promise<void> => {
      await page.getByRole('button', { name: 'เพิ่มประเภทเงินกู้ใหม่' }).click()

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[name="name"]')).toBeVisible()
    })

    test('create — add new loan type', async ({ page }: { page: Page }): Promise<void> => {
      await page.getByRole('button', { name: 'เพิ่มประเภทเงินกู้ใหม่' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      await page.getByLabel('ประเภทเงินกู้').fill('Test สินเชื่อเบื่อบ้าน')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(page.getByText('Test สินเชื่อเบื่อบ้าน', { exact: true })).toBeVisible()
    })
  })

  test.describe('Setting / Update / Contract Loan Type', () => {
    test('update — edit first loan type', async ({ page }: { page: Page }): Promise<void> => {
      // CREATE BEFORE UPDATE
      await page.getByRole('button', { name: 'เพิ่มประเภทเงินกู้ใหม่' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      await page.getByLabel('ประเภทเงินกู้').fill('Test สินเชื่อเบื่อบ้าน For Update')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(page.getByText('Test สินเชื่อเบื่อบ้าน For Update', { exact: true })).toBeVisible()

      // UPDATE
      await page.locator('[id="action-menu-trigger-0"]').first().click()
      await page.getByRole('menuitem', { name: 'แก้ไข' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      const nameInput = page.getByLabel('ประเภทเงินกู้')
      await nameInput.clear()
      await nameInput.fill('Updated Test สินเชื่อเบื่อบ้าน For Update')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(page.getByText('Updated Test สินเชื่อเบื่อบ้าน For Update', { exact: true })).toBeVisible()
    })
  })

  test.describe.serial('Setting / Delete / Contract Loan Type', () => {
    test('delete — cancel keeps row count', async ({ page }: { page: Page }): Promise<void> => {
      await page.getByRole('button', { name: 'เพิ่มประเภทเงินกู้ใหม่' }).click()
      await expect(page.locator('[role="dialog"]')).toBeVisible()

      await page.getByLabel('ประเภทเงินกู้').fill('Test สินเชื่อเบื่อบ้าน For Update')

      await page.getByRole('button', { name: 'ยืนยัน' }).click()
      await expect(page.locator('[role="dialog"]').last()).toBeVisible()
      await page.getByRole('button', { name: 'ยืนยัน' }).last().click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await page.waitForLoadState('networkidle')
      await expect(page.getByText('Test สินเชื่อเบื่อบ้าน For Update', { exact: true })).toBeVisible({ timeout: 5_000 })

      const rows = page.locator('tbody tr')
      const countBefore = await rows.count()

      await page.getByRole('row', { name: 'Test สินเชื่อเบื่อบ้าน For Update' }).locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('cancel-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(rows).toHaveCount(countBefore)
    })

    test('delete — confirm removes row', async ({ page }: { page: Page }): Promise<void> => {
      // each test gets a fresh mocked store (see outer beforeEach), so this test
      // creates its own row rather than relying on the previous test's row surviving
      await createLoanType(page, 'Test สินเชื่อเบื่อบ้าน For Update')

      const rows = page.locator('tbody tr')
      const countBefore = await rows.count()

      await page.getByRole('row', { name: 'Test สินเชื่อเบื่อบ้าน For Update' }).locator('#action-menu-trigger').first().click()
      await page.getByRole('menuitem', { name: 'ลบ' }).click()

      await expect(page.locator('[role="dialog"]')).toBeVisible()
      await page.getByTestId('confirm-button').click()

      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5_000 })
      await expect(rows).toHaveCount(countBefore - 1)
    })
  })
})
