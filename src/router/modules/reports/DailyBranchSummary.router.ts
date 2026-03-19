import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const prefix = '/daily-branch-summary'

export default {
  path: prefix,
  name: 'DailyBranchSummaryPage',
  redirect: { name: 'DailyBranchSummaryPage' },
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
      component: (): ComponentOptions => import('@/pages/reports/pages/percent-installment-payment/page/PercentInstallmentListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายงานสรุปประจำวันรวมทุกสาขา',
        icon: 'eva:list-fill'
      }
    }
  ]
} as RouteRecordRaw
