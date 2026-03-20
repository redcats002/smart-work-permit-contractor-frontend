import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'outstanding-debtor'

export default {
  path: prefix,
  name: 'OutstandingDebtorPage',
  redirect: { name: 'OutstandingDebtorListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/outstanding-debtor/OutstandingDebtorPage.vue'),
  meta: {
    title: 'รายงานลูกหนี้คงเหลือ',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'OutstandingDebtorListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/outstanding-debtor/pages/OutstandingDebtorListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานลูกหนี้คงเหลือ',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    }
  ]
} as RouteRecordRaw
