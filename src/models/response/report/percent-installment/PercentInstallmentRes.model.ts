import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IPercentInstallmentList extends IEntity {
  branchName: string
  installmentAmount: number
  receivedInstallment: number
  salesAmount: number
  receivedPenalty: number
  trackingFee: number
  totalAmount: number
  percentage: number
}
export interface IPercentInstallmentById extends IEntity {
  name: string
  taxId: string
  openAt: string
  address: string
  district: string
  subDistrict: string
  province: string
  postCode: string
}

export type TGetPercentInstallmentListResponse = IBasePaginationResponse<IPercentInstallmentList>
export type TActionPercentInstallment = IBaseSuccessResponse<boolean>
