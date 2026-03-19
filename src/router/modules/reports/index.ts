import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/reports'

export default {
  path: prefix,
  name: 'ReportsPage',
  redirect: { name: 'ReportListPage' },
  component: (): ComponentOptions => import('@/pages/reports/Reports.vue'),
  meta: {
    title: 'รายงาน',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'ReportListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/list/pages/ReportListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายงาน',
        icon: 'eva:list-fill'
      }
    },
    {
      path: 'dailyInstallment',
      name: 'DailyInstallmentPaymentReport',
      component: (): ComponentOptions => import('@/pages/reports/pages/daily-installment-payment/pages/ReportDailyInstallmentPaymentPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายงานรับชำระค่างวดประจำวัน',
        icon: 'mdi:file-document-outline'
      }
    },
    {
      path: 'PercentageInstallment',
      name: 'PercentageInstallmentPaymentsReceived',
      component: (): ComponentOptions => import('@/pages/reports/pages/list/pages/ReportListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายงานรับชำระค่างวดประจำวัน',
        icon: 'mdi:file-document-outline'
      }
    }
  ]
} as RouteRecordRaw
