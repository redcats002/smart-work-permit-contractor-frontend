import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import AllStockRouter from './AllStock.router'
import BranchIncomeExpenseRouter from './BranchIncomeExpense.router'
import BranchSummaryRouter from './BranchSummary.router'
import ComparativeRouter from './Comparative.router'
import DailyBranchSummaryRouter from './DailyBranchSummary.router'
import DailyInstallmentPaymentRouter from './DailyInstallmentPayment.router'
import PercentInstallmentRouter from './PercentInstallment.router'
import ProfitBasedOnActualPaymentRouter from './ProfitBasedOnActualPayment.router'
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
    ProfitBasedOnActualPaymentRouter,
    ComparativeRouter,
    DailyInstallmentPaymentRouter,
    DailyBranchSummaryRouter,
    PercentInstallmentRouter,
    AllStockRouter,
    RankingLendingRouter,
    RankingLoanRouter,
    BranchSummaryRouter,
    BranchIncomeExpenseRouter

  ]
} as RouteRecordRaw
