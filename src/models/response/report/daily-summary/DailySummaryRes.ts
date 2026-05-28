import type { IBasePaginationResponse } from '../../Response.model'

export interface IDailySummaryListItem {
  id: number
  date: string
  openBalance: number
  closingBalance: number
}

export type TGetDailySummaryListResponse = IBasePaginationResponse<IDailySummaryListItem>

export interface IDailySummarySummaries {
  openBalance: number
  installmentReceive: number
  continuedReceive: number
  otherReceive: number
  loanAmount: number
  sumReceive: number
  sumPay: number
  closingBalance: number
}

export interface IDailySummaryDetailItem {
  code: string
  category: string
  type: 'RECEIVE' | 'PAY'
  amount: number
}

export interface IDailySummaryDetailItemWithId extends IDailySummaryDetailItem {
  id: number
}

export interface IDailySummaryFind {
  branchName: string
  date: string
  createdBy: string
  summaries: IDailySummarySummaries
  detail: IDailySummaryDetailItem[]
}

export interface IDailySummaryById {
  id: number
  idNo?: string
  date: string
  branchId: string
  branchName: string
  createdBy?: string
  openBalance: number
  installmentReceive: number
  continuedReceive: number
  otherReceive: number
  loanAmount: number
  sumReceive: number
  sumPay: number
  closingBalance: number
  reason: string
  createdAt: string
  items: IDailySummaryDetailItemWithId[]
}
