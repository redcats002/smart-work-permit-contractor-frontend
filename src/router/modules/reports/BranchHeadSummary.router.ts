import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = 'branch-head-summary'

export default {
  path: prefix,
  name: 'BranchHeadSummaryPage',
  redirect: { name: 'BranchHeadSummaryPageListPage' },
  component: (): ComponentOptions => import('@/pages/reports/pages/branch-head-summary/BranchHeadSummaryPage.vue'),
  meta: {
    title: 'รายงานหัวหน้าสาขา',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: 'list',
      name: 'BranchHeadSummaryPageListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/branch-head-summary/pages/BranchHeadSummaryListPage.vue'),
      meta: {
        auth: true,
        title: 'รายงานหัวหน้าสาขา',
        icon: 'eva:list-fill',
        back: { name: 'ReportListPage' }
      }
    }
  ]
} as RouteRecordRaw
