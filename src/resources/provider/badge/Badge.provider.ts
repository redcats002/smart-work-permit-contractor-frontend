import type { TGetBadgeCountsResponse } from '@/models/response/badge/BadgeRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * The polling fallback wayfinder 109 requires: `GET /api/v1/badges` returns the exact same
 * `{ unreadNotifications, pendingReview? }` shape the realtime socket's `badge.counts` event
 * pushes, so the two transports can never disagree.
 */
export interface IBadgeProvider {
  getCounts (): Promise<TGetBadgeCountsResponse>
}

class BadgeProvider extends HttpRequest implements IBadgeProvider {
  private urlPrefix: string = '/api/v1/badges'

  public async getCounts (): Promise<TGetBadgeCountsResponse> {
    const response = await this.get(this.urlPrefix)
    return response
  }
}

export default BadgeProvider
