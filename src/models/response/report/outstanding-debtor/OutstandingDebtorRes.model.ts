import type { IEntity } from '@/models/Global.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

interface IOutstandingContractDebtor {
  id: number
  idNo: string
}

interface IOutstandingCustomer {
  id: number
  titleName: TTitleName
  firstName: string
  lastName: string
}

export interface IOutstandingDebtorList extends IEntity {
  contract: IOutstandingContractDebtor
  customer: IOutstandingCustomer
  type: string
  createdAt: string
  contractExpirationDate: string
  totalAmount: number
  period: number
  totalAmountNet: number
  netPeriod: number
  paid: number
  outstanding: number
  lastPaymentDate: string
  latestPaymentAmount: number
}

export interface IOutStandingDebtorSummary {
  customer: number
  totalAmount: number
  totalAmountNet: number
  paid: number
  outstanding: number
  latestPaymentAmount: number
}

export interface IOutstandingDebtorById extends IEntity {
  name: string
  taxId: string
  openAt: string
  address: string
  district: string
  subDistrict: string
  province: string
  postCode: string
}

export type TGetOutstandingDebtorListResponse = IBasePaginationResponse<IOutstandingDebtorList>
export type TActionOutstandingDebtor = IBaseSuccessResponse<boolean>
