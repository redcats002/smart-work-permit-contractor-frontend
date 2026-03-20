import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface IDailySummaryDetailItem {
  id: number
  date: string | Date
  paymentCode: string
  categoryName: string
  transactionType: 'รับ' | 'จ่าย'
  amount: number
  totalAmount: number
  installmentAmount: number
  totalInterest: number
  principalAmount: number
  currentBalance: number
}

export interface IDailySummaryDetailList extends IEntity {
  branch: string
  invoiceNo: string
  date: string | Date
  items: IDailySummaryDetailItem[]
}

export type TGetDailySummaryDetailListResponse = IBasePaginationResponse<IDailySummaryDetailList>
