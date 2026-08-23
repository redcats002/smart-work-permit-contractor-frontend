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
      // PMT-014 resume route — a different entry point from 'create': it hydrates useWizard from
      // an existing permit instead of starting clean. Declared before ':id' for the same reason
      // 'create' is: a static-ish segment ahead of the bare dynamic leaf, even though the two
      // don't actually collide (this path always has a trailing segment).
      path: ':id/edit',
      name: 'PermitEditPage',
      component: (): ComponentOptions => import('@/pages/permit/pages/create/pages/PermitEditPage.vue'),
      meta: {
        title: 'แก้ไขใบอนุญาต'
      }
    },
    {
      // PMT-014 "Duplicate & Edit" — orchestrates POST /permits + PATCH client-side (no clone
      // endpoint on the wire), then hands off to PermitEditPage for the NEW draft id.
      path: ':id/duplicate',
      name: 'PermitDuplicatePage',
      component: (): ComponentOptions => import('@/pages/permit/pages/create/pages/PermitDuplicatePage.vue'),
      meta: {
        title: 'ทำสำเนาและแก้ไข'
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
