import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/finance'

export default {
  path: prefix,
  name: 'FinancePage',
  redirect: { name: 'InvoiceListPage' },
  component: (): ComponentOptions => import('@/pages/finance/Finance.vue'),
  meta: { title: 'เอกสารและการเงิน', auth: true, icon: 'solar:document-medicine-bold' },
  children: [
    {
      path: 'invoice/list',
      name: 'InvoiceListPage',
      component: (): ComponentOptions => import('@/pages/finance/pages/invoice/pages/InvoiceListPage.vue'),
      meta: { auth: true, menu: true, title: 'รายการใบแจ้งหนี้', icon: 'solar:bill-list-bold' }
    },
    {
      path: 'receipt/list',
      name: 'ReceiptListPage',
      component: (): ComponentOptions => import('@/pages/finance/pages/receipt/pages/ReceiptListPage.vue'),
      meta: { auth: true, menu: true, title: 'รายการใบเสร็จรับเงิน', icon: 'solar:bill-list-bold' }
    },
    {
      path: 'expense/list',
      name: 'ExpenseListPage',
      component: (): ComponentOptions => import('@/pages/finance/pages/record/pages/RecordExpensesListPage.vue'),
      meta: { auth: true, menu: true, title: 'รายการบันทึกค่าใช้จ่าย', icon: 'solar:bill-list-bold' }
    }
  ]
} as RouteRecordRaw
