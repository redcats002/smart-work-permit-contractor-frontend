import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'overdue-customer'

export default {
  path: prefix,
  name: 'OverdueCustomerPage',
  redirect: { name: 'OverdueCustomerListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/overdue-customer/OverdueCustomerPage.vue'),
  meta: {
    title: 'รายงานลูกค้าค้างชำระ',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'OverdueCustomerListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/overdue-customer/pages/OverdueCustomerListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานลูกค้าค้างชำระ',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    }
  ]
} as RouteRecordRaw
