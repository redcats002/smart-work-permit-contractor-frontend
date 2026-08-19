import type { TUserRole } from '@/stores/Auth'
import type { IBaseSuccessResponse } from '../Response.model'

/** GET /api/v1/notifications — limit-only, NO pagination envelope, unread first. */
export interface INotification {
  id: number
  targetRole: TUserRole
  targetUserId: string | null
  permitId: string | null
  title: string
  createdAt: string
  read: boolean
}

export type TGetNotificationListResponse = IBaseSuccessResponse<INotification[]>

/** POST /api/v1/notifications/:id/dismiss answers { message: 'success' } with no data key. */
export interface TDismissNotificationResponse {
  message: string
}
