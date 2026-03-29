import { schema } from '@/utils/Schema'
import { z } from 'zod'

export const AnnouncementSchema = z.object({
  content: z.string(),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const CreateAnnouncementSchema = z.object({
  content: z.string().min(1),
  attachments: z.array(schema.media).optional()
})

export type AnnouncementFormValues = z.infer<typeof AnnouncementSchema>
export type AnnouncementCreateAnnouncement = z.infer<typeof CreateAnnouncementSchema>
