import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'daily-summary'

export default {
  path: prefix,
  name: 'DailySummaryPage',
  redirect: { name: 'DailySummaryListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/daily-summary/DailySummaryPage.vue'),
  meta: {
    title: 'รายงานสรุปประจำวัน',
    auth: true,
    icon: 'mdi:file-document-outline'
  },
  children: [
    {
      path: 'list',
      name: 'DailySummaryListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/daily-summary/pages/list/page/DailySummaryListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานสรุปประจำวัน',
        icon: 'mdi:file-document-outline'
      }
    },
    {
      path: 'create',
      name: 'DailySummaryCreatePage',
      component: (): ComponentOptions => import('@/pages/reports/pages/daily-summary/pages/create/page/DailySummaryCreatePage.vue'),
      meta: {
        auth: true,
        title: 'สร้างรายงานสรุปประจำวัน',
        icon: 'mdi:file-document-outline'
      }
    },
    {
      path: 'detail/:id',
      name: 'DailySummaryDetailListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/daily-summary/pages/detail/page/DailySummaryDetailListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานสรุปประจำวัน',
        icon: 'mdi:file-document-outline'
      }
    }
  ]
} as RouteRecordRaw
