import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/daily-installment'

export default {
  path: prefix,
  name: 'DailyInstallmentPage',
  redirect: { name: 'ReportListPage' },
  component: (): ComponentOptions => import('@/pages/reports/Reports.vue'),
  meta: {
    title: 'รายงาน',
    auth: true,
    icon: 'mdi:file-document-outline'
  },
  children: [
    {
      path: 'list',
      name: 'DailyInstallmentList',
      component: (): ComponentOptions => import('@/pages/reports/pages/daily-installment-payment/pages/ReportDailyInstallmentPaymentPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายงานรับชำระค่างวดประจำวัน',
        icon: 'mdi:file-document-outline'
      }
    }
  ]
} as RouteRecordRaw
