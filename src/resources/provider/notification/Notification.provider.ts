import HttpRequest from '@/resources/HttpRequest'

export interface ICheckNotificationPayload {
  type?: 'WORK' | 'ANNOUNCEMENT'
}

export interface ICheckNotificationResponse {
  hasUnread: boolean
}

export interface INotificationProvider {
  checkNotification (payload: ICheckNotificationPayload): Promise<ICheckNotificationResponse>
}

class NotificationProvider extends HttpRequest implements INotificationProvider {
  private urlPrefix: string = '/api/v1/notifications'

  public async checkNotification (payload: ICheckNotificationPayload): Promise<ICheckNotificationResponse> {
    const response = await this.get(`${this.urlPrefix}/check`, payload)
    return response
  }
}

export default NotificationProvider
