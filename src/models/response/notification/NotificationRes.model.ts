import type { TUserRole } from '@/stores/Auth'
import type { IBasePaginationResponse } from '../Response.model'

/**
 * GET /api/v1/notifications (feat-011c) — a real `page`/`limit` pagination envelope, same
 * `CommonPaginationModel` + `CommonPaginationResponseModel` composition as `GET /certificates`:
 * `{ message, data, count, page, limit, totalPage }`. Ordering within the page is unread-first,
 * computed server-side, so a page is never re-sorted client-side.
 */
export interface INotification {
  id: number
  targetRole: TUserRole
  targetUserId: string | null
  permitId: string | null
  title: string
  createdAt: string
  read: boolean
}

export type TGetNotificationListResponse = IBasePaginationResponse<INotification>

/** POST /api/v1/notifications/:id/dismiss answers { message: 'success' } with no data key. */
export interface TDismissNotificationResponse {
  message: string
}
