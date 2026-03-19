import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IAllStockList extends IEntity {
  branchName: string
  branchStock: number
  headOfficeStock: number
  executionStock: number
  totalStock: number
  movingStock: number
  totalAllStock: number
}

export type TGetAllStockListResponse = IBasePaginationResponse<IAllStockList>
export type TActionAllStockInstallment = IBaseSuccessResponse<boolean>
