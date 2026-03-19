import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface ICurrentComparativeAccountList extends IEntity {
  branchName: string
  contractCount: number
  principalAmount: number
  principalWithInterest: number
  debtCutOff: number
  discount: number
  currentBalance: number
}

export type TGetCurrentComparativeAccountListResponse = IBasePaginationResponse<ICurrentComparativeAccountList>
