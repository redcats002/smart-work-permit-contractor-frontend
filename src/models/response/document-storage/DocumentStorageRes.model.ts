import type { IEntity, TBaseModel } from '@/models/Global.model'
import type { TAssetType } from '@/enums/modules/contract/AssetType.enum'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TDocumentStorageAssetStatus } from '@/enums/modules/document-storage/DocumentStorageAssetStatus.enum'
import type { TDocumentStorageMovementStatus } from '@/enums/modules/document-storage/DocumentStorageMovementStatus.enum'
import type { TEstateStatus } from '@/enums/modules/estate/EstateStatus.enum'
import type { IAssetList } from '../asset/AssetRes.model'
import type { ICustomerList } from '../customer/CustomerRes.model'
import type { IEmployeeList } from '../employee/EmployeeRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'
import type { ILocationWarehouseList, IWarehouseList } from '../warehouse/WarehouseRes.model'

interface IAssetContractList extends IEntity {
  customer: ICustomerList
}
export interface IDocumentAssetList extends IEntity {
  status: TDocumentStorageAssetStatus
  type: TAssetType
  contract: IAssetContractList
  location: ILocationWarehouseList
}

export interface IDocumentMovementList extends IEntity {
  status: TDocumentStorageMovementStatus
  createdByEmployee: IEmployeeList
  receivedByEmployee: IEmployeeList
  originWarehouse: IWarehouseList
  destinationWarehouse: IWarehouseList
}

export interface IAssetMovementItem extends IEntity {
  asset: IAssetMovementList
  locationName?: string
}

export interface IAssetMovementList extends IEntity {
  type: TAssetType
  detail: string
  contract: IAssetContractList
}

export interface IDocumentMovementById extends IDocumentMovementList {
  asset: IAssetList
  reason?: string
  receiveDate?: string
  items: IAssetMovementItem[]
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
export interface IStockDocsList extends IEntity {
  docNo: string
  transferDate: string
  senderName: string
  originWarehouse: string
  receiverName: string
  destinationWarehouse: string
  status: TDocumentStorageMovementStatus
}
export interface IStockDocsById extends IEntity {
  status: TDocumentStorageMovementStatus
  docNo: string
  reason: string
  transferDate: string
  senderName: string
  receiveDate?: string
  receiverName?: string
  originWarehouse: string
  destinationWarehouse: string
}


export type TGetDocumentAssetsListResponse = IBasePaginationResponse<IDocumentAssetList>
export type TGetDocumentMovementListResponse = IBasePaginationResponse<IDocumentMovementList>
export type TGetDocumentMovementByIdResponse = IBaseSuccessResponse<IDocumentMovementById>
export type TActionDocumentMovement = IBaseSuccessResponse<boolean>
export type TGetDocumentMovementAssetsListResponse = IBasePaginationResponse<IDocumentAssetList>

export type TGetStockDocsListResponse = IBasePaginationResponse<IStockDocsList>
export type TGetStockContractListResponse = IBasePaginationResponse<IStockContractList>
export type TGetStockPaymentHistoryListResponse = IBasePaginationResponse<IStockPaymentHistoryList>
export type TGetStockContactHistoryListResponse = IBasePaginationResponse<IStockContactHistoryList>
export type TGetStockEstateListResponse = IBasePaginationResponse<IStockEstateList>
