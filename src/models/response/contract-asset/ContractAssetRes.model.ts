import type { IEntity } from '@/models/Global.model'
import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TDocumentStorageMovementStatus } from '@/enums/modules/document-storage/DocumentStorageMovementStatus.enum'
import type { IBasePaginationResponse } from '../Response.model'

// --- List ---
export interface IContractAssetCustomer extends IEntity {
  idNo: string
  firstName: string
  lastName: string
  fullName: string
}

export interface IContractAssetListContract extends IEntity {
  idNo: string
  customer: IContractAssetCustomer
}

export interface IContractAssetList extends IEntity {
  idNo: string
  type: TAssetType
  detail?: string
  status: TAssetStatus
  contract: IContractAssetListContract
}

export type TGetContractAssetListResponse = IBasePaginationResponse<IContractAssetList>

// --- Detail ---
export interface IContractAssetFile {
  name: string
  url: string
  path: string
}

export interface IContractAssetLocation extends IEntity {
  name: string
}

export interface IContractAssetDetailSellMan {
  id: string
  idNo: string
  firstName: string
  lastName: string
  fullName: string
}

export interface IContractAssetDetailContract extends IEntity {
  idNo: string
  contractedAt: string
  status: TContractStatus
  loanAmount: number
  sellMan: IContractAssetDetailSellMan
}

export interface IContractAssetRealEstateForm extends IEntity {
  landNo: string
  surveyNo: string
  address: string
  subDistrict: string
  district: string
  province: string
  postCode: string
  urlGoogleMap: string
  aerialPhotoMapNo: string
  aerialPhotoSheet: string
  landAreaRai: number
  landAreaNgan: number
  landAreaSquareWah: number
}

export interface IContractAssetVehicleForm extends IEntity {
  brand: string
  model: string
  color: string
  plateNo: string
  province: string
  manufactureYear: string
  registrationYear: string
  vehicleIdentificationNo: string
  engineNumber: string
  mileage: number
}

export interface IContractAssetApartmentForm extends IEntity {
  landNo: string
  unitNumber: string
  floorNumber: string
  buildingNumber: string
  buildingName: string
  buildingRegistrationNumber: string
  roomAreaSquareMeter: number
  roomHeightMeter: number
  commonPropertyOwnershipRatio: string
}

export interface IContractAssetDetail extends IEntity {
  idNo: string
  type: TAssetType
  status: TAssetStatus
  detail: string
  salePrice: number | null
  saleDate: string | null
  images: IContractAssetFile[]
  files: IContractAssetFile[]
  location: IContractAssetLocation | null
  contract: IContractAssetDetailContract
  realEstateForm: IContractAssetRealEstateForm | null
  vehicleForm: IContractAssetVehicleForm | null
  apartmentForm: IContractAssetApartmentForm | null
}

export interface IGetContractAssetDetailResponse {
  message: string
  data: IContractAssetDetail
}

export interface IActionContractAssetResponse {
  message: string
}

// --- Document Movement ---
export interface IDocumentMovementItem extends IEntity {
  date: string
  origin: string
  destination: string
  sentBy: string
  receivedBy: string
  status: TDocumentStorageMovementStatus
}

export type TGetDocumentMovementListResponse = IBasePaginationResponse<IDocumentMovementItem>
