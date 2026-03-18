import type { AnnouncementCreateAnnouncement } from '@/pages/announcement/schemas/announcement.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetAnnouncementList extends IBasePaginationRequest {
}
export interface ICreateAnnouncementPayload extends AnnouncementCreateAnnouncement {}
