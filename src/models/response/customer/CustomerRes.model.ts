import type { IEntity, TBaseOption } from '@/models/Global.model'
import type { IAddressRequest, ICurrentAddressRequest, IWorkAddressRequest } from '@/models/request/AddressReq.model'
import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { ICustomerGroupList } from '../customer-group/CustomerGroupRes.model'
import type { IJobList } from '../job/JobRes.model'
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
export interface ICustomerById extends ICurrentAddressRequest, IAddressRequest, IWorkAddressRequest {
  customerStatus: TCustomerStatus
  citizenId: string
  titleName: TTitleName
  firstName: string
  lastName: string
  phoneNumber: string
  phoneNumber2?: string
  birthDate: string
  customerGroup?: ICustomerGroupList
  job?: IJobList
  email?: string
}

export type TGetCustomerListResponse = IBasePaginationResponse<ICustomerList>
export type TGetCustomerByIdResponse = IBaseSuccessResponse<ICustomerById>
export type TActionCustomer = IBaseSuccessResponse<boolean>
