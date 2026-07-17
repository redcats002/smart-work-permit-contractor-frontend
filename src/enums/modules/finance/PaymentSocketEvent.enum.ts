export enum EPaymentSocketEvent {
  'callback-payment-qrcode' = 'callback-payment-qrcode'
}

export type TPaymentSocketEvent = keyof typeof EPaymentSocketEvent
