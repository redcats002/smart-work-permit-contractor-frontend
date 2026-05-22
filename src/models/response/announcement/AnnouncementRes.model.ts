import type { IEntity } from '@/models/Global.model'
import type { TEmployeeRole } from '@/enums/modules/employee/EmployeeRole.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IAttachments extends IEntity {
  name: string
  url: string
  path: string
}
export interface IAuthor extends IEntity {
  name: string
  image: string | null
  role: TEmployeeRole
}
export interface IAnnouncementList extends IEntity {
  content: string
  createdAt: string
  author: IAuthor
  attachments: IAttachments[]
}


export interface TGetAnnouncementListResponse extends IBasePaginationResponse<IAnnouncementList> {}
export interface TActionAnnouncement extends IBaseSuccessResponse<boolean> {}
