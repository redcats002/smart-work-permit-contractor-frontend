import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'daily-loan-disbursement'

export default {
  path: prefix,
  name: 'DailyLoanDisbursementPage',
  redirect: { name: 'DailyLoanDisbursementListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/daily-loan-disbursement/DailyLoanDisbursementPage.vue'),
  meta: {
    title: 'รายงานปล่อยสินเชื่อประจำวัน',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'DailyLoanDisbursementListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/daily-loan-disbursement/pages/DailyLoanDisbursementListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานปล่อยสินเชื่อประจำวัน',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    },
    {
      path: 'print',
      name: 'DailyLoanDisbursementPrintPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/daily-loan-disbursement/pages/DailyLoanDisbursementPrintPage.vue'),
      meta: {
        auth: true,
        title: 'พิมพ์รายงานปล่อยสินเชื่อประจำวัน',
        layout: 'blank',
        back: { name: 'DailyLoanDisbursementListPage' }
      }
    }
  ]
} as RouteRecordRaw
