import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'daily-branch-summary'

export default {
  path: prefix,
  name: 'DailyBranchSummaryPage',
  redirect: { name: 'DailyBranchSummaryListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/daily-branch-summary/DailyBranchSummaryPage.vue'),
  meta: {
    title: 'รายงานสรุปประจำวันรวมทุกสาขา',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'DailyBranchSummaryListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/daily-branch-summary/pages/DailyBranchSummaryListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานสรุปประจำวันรวมทุกสาขา',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    },
    {
      path: 'print',
      name: 'DailyBranchSummaryPrintPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/daily-branch-summary/pages/DailyBranchSummaryPrintPage.vue'),
      meta: {
        auth: true,
        title: 'พิมพ์รายงานสรุปประจำวันรวมทุกสาขา',
        layout: 'blank',
        back: { name: 'DailyBranchSummaryListPage' }
      }
    }
  ]
} as RouteRecordRaw
