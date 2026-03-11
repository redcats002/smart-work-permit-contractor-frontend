import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/access-log'

export default {
  path: prefix,
  name: 'AccessLogPage',
  redirect: { name: 'AccessLogListPage' },
  component: (): ComponentOptions => import('@/pages/access-log/AccessLog.vue'),
  meta: { title: 'บันทึกการเข้าถึงระบบ', auth: true, icon: 'material-symbols:history' },
  children: [
    {
      path: 'list',
      name: 'AccessLogListPage',
      component: (): ComponentOptions => import('@/pages/access-log/pages/AccessLogListPage.vue'),
      meta: { auth: true, menu: true, title: 'บันทึกการเข้าถึงระบบ', icon: 'material-symbols:history' }
    }
  ]
} as RouteRecordRaw
