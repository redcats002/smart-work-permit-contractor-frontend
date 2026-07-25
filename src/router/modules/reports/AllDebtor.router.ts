import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'all-debtor'

export default {
  path: prefix,
  name: 'AllDebtorPage',
  redirect: { name: 'AllDebtorListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/all-debtor/AllDebtorPage.vue'),
  meta: {
    title: 'รายงานลูกหนี้ทั้งหมด',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'AllDebtorListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/all-debtor/pages/AllDebtorListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานลูกหนี้ทั้งหมด',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    },
    {
      path: 'print',
      name: 'AllDebtorPrintPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/all-debtor/pages/AllDebtorPrintPage.vue'),
      meta: {
        auth: true,
        layout: 'blank',
        title: 'พิมพ์รายงานลูกหนี้ทั้งหมด'
      }
    }
  ]
} as RouteRecordRaw
