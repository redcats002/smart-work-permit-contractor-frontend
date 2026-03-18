import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'


export interface IAttachments extends IEntity {
  name: string
  url: string
  path: string
}
export interface IAuthor extends IEntity {
  name: string
  image: string | null
  role: string
}
export interface IAnnouncementList extends IEntity {
  content: string
  createdAt: string
  author: IAuthor
  attachments: IAttachments[]
}


export type TGetAnnouncementListResponse = IBasePaginationResponse<IAnnouncementList>
export type TActionAnnouncement = IBaseSuccessResponse<boolean>
