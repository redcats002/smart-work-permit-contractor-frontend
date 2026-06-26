import type { IEntity } from '@/models/Global.model'
import type { IBranchTime } from '@/models/modules/branch/BranchTime.model'
import type { TBranchStatus } from '@/enums/modules/branch/BranchStatus.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IBranchList extends IEntity {
  name: string
  status: TBranchStatus
}
export interface IBranchById extends IEntity {
  status: TBranchStatus
  name: string
  taxId: string
  openAt: string
  address: string
  district: string
  subDistrict: string
  province: string
  postCode: string
  branchTimes: IBranchTime[]
  lineHead?: string
}

export type TGetBranchListResponse = IBasePaginationResponse<IBranchList>
export type TGetBranchByIdResponse = IBaseSuccessResponse<IBranchById>
export type TActionBranch = IBaseSuccessResponse<boolean>
