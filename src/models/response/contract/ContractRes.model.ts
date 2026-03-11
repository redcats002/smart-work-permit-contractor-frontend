import type { IEntity } from '@/models/Global.model'
import type { TCollateralAssessmentStatus } from '@/enums/modules/contract/CollateralAssessmentStatus.enum'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IContractCustomer {
  id: number | null
  titleName: string | null
  firstName: string | null
  lastName: string | null
}

export interface IContractLoanType {
  id: number | null
  name: string
}

export interface IContractList extends IEntity {
  contractDate: string | null
  startDate: string | null
  endDate: string | null
  amount: number | null
  status: TContractStatus | null
  collateralStatus: TCollateralAssessmentStatus | null
  customer: IContractCustomer | null
  loanType: IContractLoanType | null
}

export interface IContractById extends IContractList {}

export type TGetContractListResponse = IBasePaginationResponse<IContractList>
export type TGetContractByIdResponse = IBaseSuccessResponse<IContractById>
export type TActionContract = IBaseSuccessResponse<boolean>
