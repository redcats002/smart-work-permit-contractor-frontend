import type { INotification } from '@/models/response/notification/NotificationRes.model'

/**
 * `GET /api/v1/badges` and the `badge.counts` socket event share this exact shape (wayfinder 109
 * API half) — `pendingReview` is present only for `safety_officer`, so it is always absent here;
 * the contractor app never reads it, but the field stays typed as optional rather than omitted
 * so this model matches the wire shape both transports actually send.
 */
export interface IBadgeCounts {
  unreadNotifications: number
  pendingReview?: number
}

/** The realtime socket's closed event vocabulary (wayfinder 109) — no client → server protocol exists. */
export type TRealtimeServerEvent
  = { event: 'badge.counts', data: IBadgeCounts }
    | { event: 'notification.created', data: INotification }
