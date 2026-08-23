import type {
  TDismissNotificationResponse,
  TGetNotificationListResponse
} from '@/models/response/notification/NotificationRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * The real notification endpoints (API-008). What this provider used to call —
 * `GET /notifications/check?type=WORK|ANNOUNCEMENT` — does not exist on the backend; it was the
 * app's only live network call, so it 404'd on every page load while nothing read the result.
 *
 * This endpoint takes `limit` only: no page/offset, and no pagination envelope in the response.
 */
export interface IGetNotificationListQuery {
  limit?: number
}

export interface INotificationProvider {
  list (query?: IGetNotificationListQuery): Promise<TGetNotificationListResponse>
  dismiss (id: number): Promise<TDismissNotificationResponse>
}

class NotificationProvider extends HttpRequest implements INotificationProvider {
  private urlPrefix: string = '/api/v1/notifications'

  public async list (query?: IGetNotificationListQuery): Promise<TGetNotificationListResponse> {
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  public async dismiss (id: number): Promise<TDismissNotificationResponse> {
    const response = await this.post(`${this.urlPrefix}/${id}/dismiss`)
    return response
  }
}

export default NotificationProvider
