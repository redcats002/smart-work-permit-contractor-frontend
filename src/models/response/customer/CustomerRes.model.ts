import type { IEntity, TBaseOption } from '@/models/Global.model'
import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface ICustomerList extends IEntity {
  titleName: TTitleName
  firstName: string
  lastName: string
  phoneNumber: string
  phoneNumber2?: string
  customerGroup: TBaseOption
  customerStatus: TCustomerStatus
}
export interface ICustomerById {}

export type TGetCustomerListResponse = IBasePaginationResponse<ICustomerList>
export type TGetCustomerByIdResponse = IBaseSuccessResponse<ICustomerById>
export type TActionCustomer = IBaseSuccessResponse<boolean>
