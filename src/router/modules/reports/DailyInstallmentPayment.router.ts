import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'daily-installment'

export default {
  path: prefix,
  name: 'DailyInstallmentPage',
  redirect: { name: 'DailyInstallmentList' },
  component: (): ComponentOptions => import('@/pages/reports/pages/daily-installment-payment/ReportDailyInstallmentPaymentPage.vue'),
  meta: {
    title: 'รายงาน',
    auth: true,
    icon: 'mdi:file-document-outline'
  },
  children: [
    {
      path: 'list',
      name: 'DailyInstallmentListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/daily-installment-payment/pages/ReportDailyInstallmentPaymentListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานรับชำระค่างวดประจำวัน',
        icon: 'mdi:file-document-outline'
      }
    },
    {
      path: 'print',
      name: 'DailyInstallmentPrintPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/daily-installment-payment/pages/ReportDailyInstallmentPaymentPrintPage.vue'),
      meta: {
        auth: true,
        title: 'พิมพ์รายงานรับชำระค่างวดประจำวัน',
        layout: 'blank',
        back: { name: 'DailyInstallmentListPage' }
      }
    }
  ]
} as RouteRecordRaw
