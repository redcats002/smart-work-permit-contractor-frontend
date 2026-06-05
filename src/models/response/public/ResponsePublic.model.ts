export type TResponsePublicGatewayType = 'ANNOUNCEMENT' | 'WORK'
export type TPublicGatewayCallback = (e: IPublicGatewayResponse) => void | Promise<void>

export interface IPublicGatewayResponse {
  type: TResponsePublicGatewayType
  timestamp: string
}
