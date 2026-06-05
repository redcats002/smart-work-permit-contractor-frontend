import { expect, type Page, test } from '@playwright/test'

const CREATE_URL = '/contract/pre-contract/create'

// async function selectFromModal (page: Page, placeholder: string, searchText: string): Promise<void> {
//   await page.getByPlaceholder(placeholder).click()
//   await page.getByRole('dialog').getByRole('textbox').fill(searchText)
//   await page.getByRole('dialog').getByRole('row').first().click()
// }

test.describe('Pre-Contract Create', () => {
  test.beforeEach(async ({ page }: { page: Page }): Promise<void> => {
    await page.goto(CREATE_URL)
    await page.waitForURL(`**${CREATE_URL}`)
  })

  test('show create form on load', async ({ page }: { page: Page }): Promise<void> => {
    await expect(page.getByPlaceholder('เลือกพนักงานประเมิน')).toBeVisible()
    await expect(page.getByPlaceholder('เลือกลูกค้า')).toBeVisible()
    await expect(page.getByRole('button', { name: 'ยืนยัน/สั่งงานประเมิน' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'ร่าง' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'ยกเลิก' })).toBeVisible()
  })

  // test('cancel — navigate back to contract list', async ({ page }: { page: Page }): Promise<void> => {
  //   await page.getByRole('button', { name: 'ยกเลิก' }).click()
  //   await page.waitForURL('**/contract/list')
  // })

  // test('create pre-contract as DRAFT with vehicle asset', async ({ page }: { page: Page }): Promise<void> => {
  //   const staffName = process.env?.TEST_STAFF_NAME ?? ''
  //   const customerName = process.env?.TEST_CUSTOMER_NAME ?? ''

  //   await selectFromModal(page, 'เลือกพนักงานประเมิน', staffName)
  //   await selectFromModal(page, 'เลือกลูกค้า', customerName)

  //   await page.getByRole('button', { name: 'เพิ่มหลักทรัพย์ในสัญญา' }).click()
  //   await page.getByPlaceholder('เลือกหมวดหมู่หลักทรัพย์').click()
  //   await page.getByRole('option', { name: 'รถยนต์' }).click()

  //   await page.getByPlaceholder('กรอกยี่ห้อ').fill('Toyota')
  //   await page.getByPlaceholder('กรอกรุ่น').fill('Camry')
  //   await page.getByPlaceholder('กรอกสี').fill('ขาว')
  //   await page.getByPlaceholder('กรอกเลขทะเบียนรถ').fill('กข 1234')

  //   await page.getByPlaceholder('เลือกจังหวัด').click()
  //   await page.getByRole('option').first().click()

  //   await page.getByPlaceholder('เลือกปีที่ผลิต').click()
  //   await page.getByRole('option').first().click()

  //   await page.getByPlaceholder('เลือกปีที่จดทะเบียน').click()
  //   await page.getByRole('option').first().click()

  //   await page.getByPlaceholder('กรอกหมายเลขตัวถัง').fill('VIN12345678901234')
  //   await page.getByPlaceholder('กรอกหมายเลขเครื่อง').fill('ENG1234567890')
  //   await page.getByPlaceholder('กรอกเลขไมล์').fill('50000')

  //   await page.getByRole('button', { name: 'ร่าง' }).click()

  //   await expect(page.locator('[class*="toast"]')).toContainText('ดำเนินการสำเร็จ')
  //   await page.waitForURL('**/contract/pre-contract/edit/**')
  // })

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
