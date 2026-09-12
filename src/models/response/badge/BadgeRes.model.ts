import type { IBadgeCounts } from '@/models/modules/realtime/Realtime.model'
import type { IBaseSuccessResponse } from '../Response.model'

/** GET /api/v1/badges (wayfinder 109) — the polling fallback; identical shape to `badge.counts`. */
export type TGetBadgeCountsResponse = IBaseSuccessResponse<IBadgeCounts>
