import type { IEntity } from '@/models/Global.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBranchList } from '../branch/BranchRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

interface IEmployee { // TODO: remove it after api employee done
  id: number
  idNo: string
  titleName: TTitleName
  firstName: string
  lastName: string
}

export interface IAccessLogList extends IEntity {
  employee: IEmployee
  menuName: string
  accessType: 'CREATE' | 'UPDATE' | 'READ' | 'DELETE'
  document?: IEntity
  branch: IBranchList
}
export interface IAccessLogById extends IEntity {}

export type TGetAccessLogListResponse = IBasePaginationResponse<IAccessLogList>
export type TGetAccessLogByIdResponse = IBaseSuccessResponse<IAccessLogById>
export type TActionAccessLog = IBaseSuccessResponse<boolean>
