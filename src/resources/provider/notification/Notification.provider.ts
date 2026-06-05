import type { ICheckNotification } from '@/models/request/notification/NotificationReq.model'
import type { TGetNotificationResponse } from '@/models/response/notification/NotificationRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface INotificationProvider {
  checkNotification(query: ICheckNotification): Promise<TGetNotificationResponse>
}

class NotificationProvider extends HttpRequest implements INotificationProvider {
  private urlPrefix: string = '/api/v1/management/Notification'

  public async checkNotification (query: ICheckNotification): Promise<TGetNotificationResponse> {
    return this.get(this.urlPrefix, query)
  }
}

export default NotificationProvider
