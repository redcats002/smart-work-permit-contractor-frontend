import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'profit-based-on-actual-payment'

export default {
  path: prefix,
  name: 'ProfitBasedOnActualPaymentPage',
  redirect: { name: 'ProfitBasedOnActualPaymentListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/profit-based-on-actual-payment/ProfitBasedOnActualPaymentPage.vue'),
  meta: {
    title: 'รายงานกำไรตามการรับชำระจริง',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'ProfitBasedOnActualPaymentListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/profit-based-on-actual-payment/pages/ProfitBasedOnActualPaymentListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานกำไรตามการรับชำระจริง',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    }
  ]
} as RouteRecordRaw
