import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'payments-for-account-closure'

export default {
  path: prefix,
  name: 'PaymentsForAccountClosurePage',
  redirect: { name: 'PaymentsForAccountListClosurePage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/payments-for-account-closure/PaymentsForAccountClosurePage.vue'),
  meta: {
    title: 'รายงานการรับชำระเงินลูกหนี้ปิดบัญชี',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'PaymentsForAccountListClosurePage',
      component: (): ComponentOptions => import('@/pages/reports/pages/payments-for-account-closure/pages/PaymentsForAccountClosureListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานการรับชำระเงินลูกหนี้ปิดบัญชี',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    },
    {
      path: 'print',
      name: 'PaymentsForAccountClosurePrintPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/payments-for-account-closure/pages/PaymentsForAccountClosurePrintPage.vue'),
      meta: {
        auth: true,
        title: 'พิมพ์รายงานการรับชำระเงินลูกหนี้ปิดบัญชี',
        layout: 'blank',
        back: { name: 'PaymentsForAccountListClosurePage' }
      }
    }
  ]
} as RouteRecordRaw
