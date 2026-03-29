import type { ICreateAnnouncementPayload } from '@/models/request/announcement/AnnouncementReq.model'
import useUpload from '@/composables/useUpload'
import type { AnnouncementCreateAnnouncement } from '../schemas/announcement.schema'

export async function usePayload (form: AnnouncementCreateAnnouncement): Promise<ICreateAnnouncementPayload> {
  const { getUploadImages } = useUpload()
  const payload: ICreateAnnouncementPayload = {
    content: form.content,
    attachments: await getUploadImages(form.attachments)
  }
  return payload
}
