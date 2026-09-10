import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * wayfinder 062 — the worker directory: "the worker shown in another tab on the contractor app,
 * to see that worker has certifications, works in which permits, and update their detail."
 * Registered in src/router/index.ts, mirroring Certificate.router.ts.
 */
const prefix = '/workers'

export default {
  path: prefix,
  component: (): ComponentOptions => import('@/pages/worker/WorkerPage.vue'),
  meta: {
    layout: 'default',
    auth: true,
    title: 'ผู้ปฏิบัติงาน'
  },
  children: [
    {
      path: '',
      name: 'WorkerListPage',
      component: (): ComponentOptions => import('@/pages/worker/pages/list/pages/WorkerListPage.vue'),
      meta: {
        title: 'ผู้ปฏิบัติงาน'
      }
    },
    {
      // Static segments before dynamic ones is enforced repo-wide, but there is only `:id` here —
      // no `/workers/create` route: registering a worker happens inline from the list (062).
      path: ':id',
      name: 'WorkerDetailPage',
      component: (): ComponentOptions => import('@/pages/worker/pages/detail/pages/WorkerDetailPage.vue'),
      meta: {
        title: 'รายละเอียดผู้ปฏิบัติงาน'
      }
    }
  ]
} as RouteRecordRaw
