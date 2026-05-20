import type { IDashboardDonutData, IDashboardSummaryCard } from '@/models/modules/dashboard/Dashboard.model'

export interface IDashboardData {
  summaryCards: IDashboardSummaryCard[]
  statCards: IDashboardSummaryCard[]
  marketing: IDashboardDonutData
  loanSummary: IDashboardDonutData
}
