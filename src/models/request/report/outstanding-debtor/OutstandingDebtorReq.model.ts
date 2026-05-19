import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TInterestType } from '@/enums/modules/contract/InterestType.enum'
import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetOutstandingDebtorList extends IBasePaginationRequest {
  branchId?: number
  status?: TContractStatus
  interestType?: TInterestType
  startDateOfCreatedAt?: string
  endDateOfCreatedAt?: string
  startDateOfFinalInstallmentDate?: string
  endDateOfFinalInstallmentDate?: string
}
