import type { IEntity } from '@/models/Global.model'
import type { IEmployeeList } from '../employee/EmployeeRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IContractContactHistoryList extends IEntity {
  contactAt: string
  topic: string
  note: string
  employee: IEmployeeList
}

export interface IContractContactHistoryById extends IEntity {
  contactAt: string
  topic: string
  note: string
  employee: IEmployeeList
}

export type TGetContractHistoryListResponse = IBasePaginationResponse<IContractContactHistoryList>
export type TGetContractHistoryByIdResponse = IBaseSuccessResponse<IContractContactHistoryById>
export type TActionContractHistoryResponse = IBaseSuccessResponse<boolean>
