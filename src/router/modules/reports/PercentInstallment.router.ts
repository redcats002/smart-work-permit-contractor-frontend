import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'percent-installment'

export default {
  path: prefix,
  name: 'PercentInstallmentPage',
  redirect: { name: 'PercentInstallmentListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/percent-installment-payment/PercentInstallmentPage.vue'),
  meta: {
    title: 'รายงานรับชำระค่างวดคิดเป็นเปอร์เซ็นต์',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'PercentInstallmentListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/percent-installment-payment/pages/PercentInstallmentListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานรับชำระค่างวดคิดเป็นเปอร์เซ็นต์',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    },
    {
      path: 'print',
      name: 'PercentInstallmentPrintPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/percent-installment-payment/pages/PercentInstallmentPrintPage.vue'),
      meta: {
        auth: true,
        title: 'พิมพ์รายงานรับชำระค่างวดคิดเป็นเปอร์เซ็นต์',
        layout: 'blank',
        back: { name: 'PercentInstallmentListPage' }
      }
    }
  ]
} as RouteRecordRaw
