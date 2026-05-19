import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'success-debtor'

export default {
  path: prefix,
  name: 'SuccessDebtorPage',
  redirect: { name: 'SuccessDebtorListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/success-debtor/SuccessDebtorPage.vue'),
  meta: {
    title: 'รายงานลูกหนี้ปิดบัญชี',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'SuccessDebtorListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/success-debtor/pages/SuccessDebtorListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานลูกหนี้ปิดบัญชี',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    }
  ]
} as RouteRecordRaw
