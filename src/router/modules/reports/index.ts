import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import AllStockRouter from './AllStock.router'
import BranchSummaryRouter from './BranchSummary.router'
import PercentInstallmentRouter from './PercentInstallment.router'
import RankingLendingRouter from './RankingLending.router'
import RankingLoanRouter from './RankingLoan.router'

const prefix = '/reports'

export default {
  path: prefix,
  name: 'ReportsPage',
  redirect: { name: 'ReportListPage' },
  component: (): ComponentOptions => import('@/pages/reports/Reports.vue'),
  meta: {
    title: 'รายงาน',
    auth: true,
    icon: 'eva:list-fill'
  },
  children: [
    {
      path: '',
      name: 'ReportListPage',
      component: (): ComponentOptions => import('@/pages/reports/pages/list/pages/ReportListPage.vue'),
      meta: {
        auth: true,
        menu: true,
        title: 'รายงาน',
        icon: 'eva:list-fill'
      }
    },
    PercentInstallmentRouter,
    AllStockRouter,
    RankingLendingRouter,
    RankingLoanRouter,
    BranchSummaryRouter

  ]
} as RouteRecordRaw
