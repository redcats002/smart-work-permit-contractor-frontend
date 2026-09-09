import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * Registered in src/router/index.ts, and `AppDrawer` has a live nav entry for it. (The comment
 * that used to sit here claimed neither was done, left over from the HST-001 wave — wayfinder 057.)
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
