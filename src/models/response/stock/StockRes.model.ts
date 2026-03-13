import type { IEntity, TBaseModel } from '@/models/Global.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TStockStatus } from '@/enums/modules/stock/StockStatus.enum'
import type { TEstateStatus } from '@/enums/modules/estate/EstateStatus.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IStockList extends IEntity {
  assetNo: string
  contractNo: string
  receivedDate: string
  titleName: TTitleName
  firstName: string
  lastName: string
  category: string
  warehouse: string
  storageLocation: string
  status: TStockStatus
  type: string
}
export interface IStockById extends IEntity {
  status: TStockStatus
  idCard: string
  titleName: TTitleName
  firstName: string
  lastName: string
  phoneNumber: string
  phoneNumber2?: string
  birthDate: string
  workAddress: IAddressRequest
  mainAddress: IAddressRequest
  currentAddress: IAddressRequest
  email?: string
}

export interface IStockContractList extends IEntity {
  contractType: TBaseModel
  loanLimit: number
  contractStartAt?: string
  contractEndAt?: string
  contractStatus: TContractStatus
  isLate: boolean
}
export interface IStockPaymentHistoryList extends IEntity {
  paymentMethod: TBaseModel
  paymentAmount: number
}
export interface IStockContactHistoryList extends IEntity {
  contractIdNo: string
  subject: string
  detail: string
}
export interface IStockEstateList extends IEntity {
  contractIdNo: string
  estateType: TBaseModel
  storage: string
  estateStatus: TEstateStatus
}

export type TGetStockListResponse = IBasePaginationResponse<IStockList>
export type TGetStockByIdResponse = IBaseSuccessResponse<IStockById>
export type TActionStock = IBaseSuccessResponse<boolean>

export type TGetStockContractListResponse = IBasePaginationResponse<IStockContractList>
export type TGetStockPaymentHistoryListResponse = IBasePaginationResponse<IStockPaymentHistoryList>
export type TGetStockContactHistoryListResponse = IBasePaginationResponse<IStockContactHistoryList>
export type TGetStockEstateListResponse = IBasePaginationResponse<IStockEstateList>
