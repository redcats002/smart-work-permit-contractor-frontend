import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'annual-finance-receipt'

export default {
  path: prefix,
  name: 'AnnualFinanceReceiptPage',
  redirect: { name: 'AnnualFinanceReceiptListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/annual-finance-receipt/AnnualFinanceReceiptPage.vue'),
  meta: {
    title: 'รายงานสรุปรับไฟแนนซ์ประจำปี',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'AnnualFinanceReceiptListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/annual-finance-receipt/pages/AnnualFinanceReceiptListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานสรุปรับไฟแนนซ์ประจำปี',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    }
  ]
} as RouteRecordRaw
