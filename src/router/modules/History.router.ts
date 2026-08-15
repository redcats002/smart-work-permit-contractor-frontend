import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * NOT yet registered in src/router/index.ts — that file is owned by the
 * orchestrator during this wave (see HST-001 task notes). Wire this module in
 * there once available; also flip `AppDrawer`'s inert guard for this nav item.
 */
const prefix = '/history'

export default {
  path: prefix,
  name: 'HistoryListPage',
  component: (): ComponentOptions => import('@/pages/history/pages/list/pages/HistoryListPage.vue'),
  meta: {
    layout: 'default',
    auth: true,
    title: 'ประวัติใบอนุญาต'
  }
} as RouteRecordRaw
