import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'all-stock'

export default {
  path: prefix,
  name: 'AllStockPage',
  redirect: { name: 'AllStockListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/all-stock/AllStockPage.vue'),
  meta: {
    title: 'รายงานสรุปสต็อกสินค้ารวม',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'AllStockListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/all-stock/page/AllStockListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานสรุปสต็อกสินค้ารวม',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    }
  ]
} as RouteRecordRaw
