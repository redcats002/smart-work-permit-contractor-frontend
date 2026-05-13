import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/action-log'

export default {
  path: prefix,
  name: 'ActionLogPage',
  redirect: { name: 'ActionLogListPage' },
  component: (): ComponentOptions => import('@/pages/action-log/ActionLog.vue'),
  meta: { title: 'บันทึกการเข้าถึงระบบ', auth: true, icon: 'streamline-flex:search-history-browser' },
  children: [
    {
      path: 'list',
      name: 'ActionLogListPage',
      component: (): ComponentOptions => import('@/pages/action-log/pages/ActionLogListPage.vue'),
      meta: { auth: true, menu: true, title: 'บันทึกการเข้าถึงระบบ', icon: 'streamline-flex:search-history-browser' }
    }
  ]
} as RouteRecordRaw
