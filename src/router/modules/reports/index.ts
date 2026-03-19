import type { ComponentOptions } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import ComparativeRouter from './_Comparative.router'
import AllStockRouter from './AllStock.router'
import BranchSummaryRouter from './BranchSummary.router'
import DailyBranchSummaryRouter from './DailyBranchSummary.router'
import DailyInstallmentPaymentRouter from './DailyInstallmentPayment.router'
import PercentInstallmentRouter from './PercentInstallment.router'
import ProfitBasedOnActualPaymentRouter from './ProfitBasedOnActualPayment.router'
import RankingLendingRouter from './RankingLending.router'
import RankingLoanRouter from './RankingLoan.router'
import BranchHeadSummaryRouter from './BranchHeadSummary.router'
import ContractSecurityDocumentRouter from './ContractSecurityDocument.router'
import FinancialSummaryRouter from './FinancialSummary.router'

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
    BranchHeadSummaryRouter,
    ProfitBasedOnActualPaymentRouter,
    ComparativeRouter,
    DailyInstallmentPaymentRouter,
    DailyBranchSummaryRouter,
    PercentInstallmentRouter,
    AllStockRouter,
    RankingLendingRouter,
    RankingLoanRouter,
    BranchSummaryRouter,
    ContractSecurityDocumentRouter,
    FinancialSummaryRouter

  ]
} as RouteRecordRaw
