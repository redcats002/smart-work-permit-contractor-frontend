import type { AnnouncementCreateAnnouncement } from '../schemas/announcement.schema'
import type { ICreateAnnouncementPayload } from '@/models/request/announcement/AnnouncementReq.model'

export function usePayload (form: AnnouncementCreateAnnouncement): ICreateAnnouncementPayload {
  return {
    ...form
  }
}
