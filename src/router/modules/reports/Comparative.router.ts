import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/comparative'

export default {
  path: prefix,
  name: 'ComparativePage',
  redirect: { name: 'ComparativeListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/current-comparative-account/pages/Comparative.vue'),
  meta: {
    title: 'รายงาน',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'ComparativeListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/current-comparative-account/pages/list/pages/ComparativeListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานสรุปบัญชีเทียบปัจจุบัน',
        icon: 'eva:list-fill'
      }
    },
    {
      path: 'print',
      name: 'ComparativePrintPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/current-comparative-account/pages/list/pages/ComparativePrintPage.vue'),
      meta: {
        auth: true,
        title: 'พิมพ์รายงานสรุปบัญชีเทียบปัจจุบัน',
        layout: 'blank',
        back: { name: 'ComparativeListPage' }
      }
    }
  ]
} as RouteRecordRaw
