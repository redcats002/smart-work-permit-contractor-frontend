import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'branch-summary'

export default {
  path: prefix,
  name: 'BranchSummaryPage',
  redirect: { name: 'BranchSummaryPageListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/branch-summary/BranchSummaryReportPage.vue'),
  meta: {
    title: 'รายงานสาขา',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'BranchSummaryPageListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/branch-summary/page/BranchSummaryReportListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานสาขา',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    },
    {
      path: 'print',
      name: 'BranchSummaryPrintPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/branch-summary/page/BranchSummaryReportPrintPage.vue'),
      meta: {
        auth: true,
        title: 'พิมพ์รายงานสาขา',
        layout: 'blank',
        back: { name: 'BranchSummaryPageListPage' }
      }
    }
  ]
} as RouteRecordRaw
