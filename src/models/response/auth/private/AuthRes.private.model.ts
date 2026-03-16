import type { IEntity } from '@/models/Global.model'
import type { TEmployeeRole } from '@/enums/modules/employee/EmployeeRole.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IAuthBranchList extends IEntity {
  name: string
  logo: string
  role?: TEmployeeRole
  status: string
}
export interface ISelectBranchResponse {
  activeOrganizationId: string
}
export interface IApproveBranchResponse extends ISelectBranchResponse {
  branches: IAuthBranchList[]
}
export interface IRejectBranchResponse extends ISelectBranchResponse {
  branches: IAuthBranchList[]
}

export type TActionLogoutResponse = IBaseSuccessResponse<boolean>
export type TActionCheckBearerTokenResponse = IBaseSuccessResponse<boolean>
export type TGetActiveBranchResponse = IBasePaginationResponse<IAuthBranchList>
export type TActionSelectBranchResponse = IBaseSuccessResponse<ISelectBranchResponse>
export type TActionApproveBranchResponse = IBaseSuccessResponse<IApproveBranchResponse>
export type TActionRejectBranchResponse = IBaseSuccessResponse<IRejectBranchResponse>
