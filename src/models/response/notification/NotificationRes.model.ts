export interface ICheckNotificationResponse {
  hasUnread: boolean
  message: string
}

export type TGetNotificationResponse = ICheckNotificationResponse
