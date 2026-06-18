import { expect, type Page, test } from '@playwright/test'
import { actionResponse, mockRoute, paginatedResponse } from '../../fixtures/mockApi'

const CREATE_URL = '/contract/pre-contract/create'

async function selectFromModal (page: Page, placeholder: string, searchText: string): Promise<void> {
  const input = page.getByRole('textbox', { name: `${placeholder}*` })
  await expect(input).toBeVisible({ timeout: 5_000 })
  await input.click()
  await page.waitForLoadState('networkidle')
  await page.getByRole('dialog').getByRole('textbox').fill(searchText).then(() => page.getByRole('dialog').getByRole('textbox').press('Enter'))
  await page.waitForLoadState('networkidle')
  const rows = page.getByRole('dialog').getByRole('row')
  await expect(rows.first()).toBeVisible({ timeout: 5_000 })
  await rows.locator(`:scope:has-text("${searchText}")`).first().click()
  await page.waitForLoadState('networkidle')
}

async function fillVehicleForm (page: Page): Promise<void> {
  const staffName = 'Nonthakorn'
  const customerName = 'กันต์'

  await selectFromModal(page, 'พนักงานประเมิน', staffName)
  await selectFromModal(page, 'ลูกค้า', customerName)

  await page.getByRole('combobox', { name: 'เลือกหมวดหมู่หลักทรัพย์' }).click()
  await page.getByRole('option', { name: 'ยานพาหนะ - รถยนต์' }).click()
  await page.getByRole('textbox', { name: 'ยี่ห้อ*' }).fill('Toyota')

  await page.getByRole('textbox', { name: 'รุ่น*' }).click()
  await page.getByRole('textbox', { name: 'รุ่น*' }).fill('Camry')

  await page.getByRole('textbox', { name: 'สี*' }).click()
  await page.getByRole('textbox', { name: 'สี*' }).fill('ขาว')

  await page.getByRole('textbox', { name: 'เลขทะเบียนรถ*' }).click()
  await page.getByRole('textbox', { name: 'เลขทะเบียนรถ*' }).fill('กข 1234')

  await page.getByRole('combobox', { name: 'เลือกจังหวัด' }).click()
  await page.getByText('กรุงเทพมหานคร').click()

  await page.getByRole('combobox', { name: 'เลือกปีที่ผลิต' }).click()
  await page.getByRole('listbox').getByRole('option', { name: '2021' }).click()
  await expect(page.getByRole('listbox')).toHaveCount(0, { timeout: 3_000 })

  await page.getByRole('combobox', { name: 'เลือกปีที่จดทะเบียน' }).click()
  await page.getByRole('listbox').getByRole('option', { name: '2022' }).click()

  await page.getByRole('textbox', { name: 'หมายเลขตัวถัง*' }).click()
  await page.getByRole('textbox', { name: 'หมายเลขตัวถัง*' }).fill('VIN12345678901234')

  await page.getByRole('textbox', { name: 'หมายเลขเครื่อง*' }).click()
  await page.getByRole('textbox', { name: 'หมายเลขเครื่อง*' }).fill('ENG1234567890')

  await page.getByRole('spinbutton', { name: 'กรอกเลขไมล์' }).click()
  await page.getByRole('spinbutton', { name: 'กรอกเลขไมล์' }).fill('5000').then(() => page.getByRole('spinbutton', { name: 'กรอกเลขไมล์' }).press('Enter'))
}

test.describe('Pre-Contract Create', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await mockRoute(page, '**/api/v1/user**', {
      method: 'GET',
      body: paginatedResponse([{ id: 1, idNo: 'EMP-1', firstName: 'Nonthakorn', lastName: 'Mock', status: 'ACTIVE' }])
    })
    await mockRoute(page, '**/api/v1/management/customer**', {
      method: 'GET',
      body: paginatedResponse([{ id: 1, idNo: 'CUS-1', firstName: 'กันต์', lastName: 'Mock', phoneNumber: '0800000000', status: 'ACTIVE' }])
    })
    await mockRoute(page, '**/api/v1/management/customer/1', {
      method: 'GET',
      body: actionResponse({ id: 1, idNo: 'CUS-1', firstName: 'กันต์', lastName: 'Mock', phoneNumber: '0800000000', status: 'ACTIVE' })
    })
    // createContract's real response is the bare entity (no {data} envelope) — see useInit.ts useSubmit() reading `response?.id` directly
    await mockRoute(page, '**/api/v1/management/pre-contract', {
      method: 'POST',
      body: { id: 999 }
    })
    await mockRoute(page, '**/api/v1/management/pre-contract/999', {
      method: 'GET',
      body: actionResponse({
        id: 999,
        status: 'DRAFT',
        preAssets: [],
        customer: { id: 1 },
        sellMan: { id: 1 }
      })
    })
    await mockRoute(page, '**/api/v1/management/pre-contract/cancelled/999', {
      method: 'PATCH',
      body: actionResponse(true)
    })
    await page.goto(CREATE_URL)
    await page.waitForURL(`**${CREATE_URL}`)
  })

  test('show create form on load', async ({ page }: { page: Page }): Promise<void> => {
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('textbox', { name: 'พนักงานประเมิน*' })).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('textbox', { name: 'ลูกค้า*' })).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('button', { name: 'ยืนยัน/สั่งงานประเมิน' })).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('button', { name: 'ร่าง' })).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('button', { name: 'ยกเลิก' })).toBeVisible({ timeout: 5_000 })
  })

  test('cancel — calls cancel API and navigates to contract list', async ({ page }: { page: Page }): Promise<void> => {
    await fillVehicleForm(page)

    await page.getByRole('button', { name: 'ร่าง' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForURL('**/contract/pre-contract/edit/**')

    await page.getByRole('button', { name: 'ยกเลิก' }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'ยืนยัน' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForURL('**/contract/list?tab=preContract')
  })

  test('create pre-contract as DRAFT with vehicle asset', async ({ page }: { page: Page }): Promise<void> => {
    await fillVehicleForm(page)

    await page.getByRole('button', { name: 'ร่าง' }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForURL('**/contract/pre-contract/edit/**')
  })

  // test('create pre-contract as PENDING_EVALUATION with vehicle asset', async ({ page }: { page: Page }): Promise<void> => {
  //   const staffName = process.env?.TEST_STAFF_NAME ?? ''
  //   const customerName = process.env?.TEST_CUSTOMER_NAME ?? ''

  //   await selectFromModal(page, 'เลือกพนักงานประเมิน', staffName)
  //   await selectFromModal(page, 'เลือกลูกค้า', customerName)

  //   await page.getByRole('button', { name: 'เพิ่มหลักทรัพย์ในสัญญา' }).click()
  //   await page.getByPlaceholder('เลือกหมวดหมู่หลักทรัพย์').click()
  //   await page.getByRole('option', { name: 'รถยนต์' }).click()

  //   await page.getByPlaceholder('กรอกยี่ห้อ').fill('Honda')
  //   await page.getByPlaceholder('กรอกรุ่น').fill('Civic')
  //   await page.getByPlaceholder('กรอกสี').fill('ดำ')
  //   await page.getByPlaceholder('กรอกเลขทะเบียนรถ').fill('งจ 5678')

  //   await page.getByPlaceholder('เลือกจังหวัด').click()
  //   await page.getByRole('option').first().click()

  //   await page.getByPlaceholder('เลือกปีที่ผลิต').click()
  //   await page.getByRole('option').first().click()

  //   await page.getByPlaceholder('เลือกปีที่จดทะเบียน').click()
  //   await page.getByRole('option').first().click()

  //   await page.getByPlaceholder('กรอกหมายเลขตัวถัง').fill('VIN98765432109876')
  //   await page.getByPlaceholder('กรอกหมายเลขเครื่อง').fill('ENG9876543210')
  //   await page.getByPlaceholder('กรอกเลขไมล์').fill('30000')

  //   await page.getByRole('button', { name: 'ยืนยัน/สั่งงานประเมิน' }).click()
  //   await page.getByRole('dialog').getByRole('button', { name: 'ยืนยัน' }).click()

  //   await expect(page.locator('[class*="toast"]')).toContainText('ดำเนินการสำเร็จ')
  //   await page.waitForURL('**/contract/pre-contract/**')
  // })
})
