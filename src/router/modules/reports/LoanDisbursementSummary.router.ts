import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'loan-disbursement-summary'

export default {
  path: prefix,
  name: 'LoanDisbursementSummaryPage',
  redirect: { name: 'LoanDisbursementSummaryListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/loan-disbursement-summary/LoanDisbursementSummaryPage.vue'),
  meta: {
    title: 'รายงานสรุปการปล่อยสินเชื่อ',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'LoanDisbursementSummaryListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/loan-disbursement-summary/pages/LoanDisbursementSummaryListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานสรุปการปล่อยสินเชื่อ',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    }
  ]
} as RouteRecordRaw
