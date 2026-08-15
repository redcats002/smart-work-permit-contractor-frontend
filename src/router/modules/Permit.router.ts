import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * NOT yet registered in src/router/index.ts — that file is owned by another agent
 * during this wave (see PMT-002 task notes). Wire this module in there once available.
 */
const prefix = '/permits'

export default {
  path: prefix,
  component: (): ComponentOptions => import('@/pages/permit/PermitPage.vue'),
  meta: {
    layout: 'default',
    auth: true,
    title: 'ใบอนุญาตของฉัน'
  },
  children: [
    {
      // Route order matters: 'create' must be declared before ':id' or it is
      // swallowed as an id param.
      path: '',
      name: 'PermitListPage',
      component: (): ComponentOptions => import('@/pages/permit/pages/list/pages/PermitListPage.vue'),
      meta: {
        title: 'ใบอนุญาตของฉัน'
      }
    },
    {
      path: 'create',
      name: 'PermitCreatePage',
      component: (): ComponentOptions => import('@/pages/permit/pages/create/pages/PermitCreatePage.vue'),
      meta: {
        title: 'สร้างใบอนุญาตใหม่'
      }
    },
    {
      path: ':id',
      name: 'PermitDetailPage',
      component: (): ComponentOptions => import('@/pages/permit/pages/detail/pages/PermitDetailPage.vue'),
      meta: {
        title: 'รายละเอียดใบอนุญาต'
      }
    }
  ]
} as RouteRecordRaw
