import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface IDailyInstallmentPaymentList extends IEntity {
  date: string
  receiptNo: string
  contractNo: string
  customerName: string
  paymentMethod: string
  paymentType: string
  debtAmount: number
  discount: number
  netAmount: number
  totalPrincipal: number
  principal: number
  interest: number
  staffName: string
  status: string
}

export type TGetDailyInstallmentPaymentListResponse = IBasePaginationResponse<IDailyInstallmentPaymentList>
