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
    }
  ]
} as RouteRecordRaw
