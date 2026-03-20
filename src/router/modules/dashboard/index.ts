import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/dashboard'

export default {
  history: prefix,
  path: prefix,
  name: 'DashboardPage',
  redirect: { name: 'DashboardListPage' },
  component: (): ComponentOptions => import('@/pages/dashboard/Dashboard.vue'),
  meta: {
    title: 'แดชบอร์ด',
    auth: true,
    icon: 'solar:widget-4-linear'
  },
  children: [
    {
      path: 'list',
      name: 'DashboardListPage',
      component: (): ComponentOptions => import('@/pages/dashboard/pages/list/pages/DashboardListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'แดชบอร์ด',
        icon: 'solar:widget-4-linear'
      }
    }
  ]
} as RouteRecordRaw
