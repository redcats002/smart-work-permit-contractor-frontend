import type { IBaseModel, IEntity } from '@/models/Global.model'
import type { TAssetType } from '@/enums/modules/contract/AssetType.enum'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IPreContractCustomer {
  id: number | null
  titleName: string | null
  firstName: string | null
  lastName: string | null
}

export interface IPreContractCustomerDetail extends IPreContractCustomer {
  idNo: string | null
  idCard: string | null
  birthDate: string | null
  customerGroup: IBaseModel | null
  occupation: IBaseModel | null
  email: string | null
  phoneNumber: string | null
  phoneNumber2: string | null
}

export interface IPreContractStaff {
  id: number
  titleName: TTitleName
  firstName: string
  lastName: string
}

export interface IPreAssetImage extends IMedia {}

export interface IAssetDetailInfo extends IEntity {
  assetType: TAssetType
  detail: string | null
  address: string | null
  subDistrict: string | null
  district: string | null
  province: string | null
  postCode: string | null
  urlGoogleMap: string | null
  // vehicle-specific
  licensePlate: string | null
  vehicleProvince: string | null
  yearManufactured: number | null
  yearRegistered: number | null
  chassisNumber: string | null
  mileage: number | null
  // land-specific
  landNumber: string | null
  surveyPageNumber: string | null
  landLocation: string | null
  aerialPhotoNumber: string | null
  aerialPhotoSheet: string | null
  areaRai: number | null
  areaRgan: number | null
  areaTarangWa: number | null
  images: IPreAssetImage[]
}

export interface IPreContractLoanType {
  id: number | null
  name: string
}

export interface IPreContractList extends IEntity {
  contractDate: string | null
  startDate: string | null
  endDate: string | null
  amount: number | null
  status: TContractStatus | null
  assetStatus: TPreContractStatus | null
  customer: IPreContractCustomer | null
  loanType: IPreContractLoanType | null
}

export interface IPreContractById extends IEntity {
  contractDate: string | null
  startDate: string | null
  endDate: string | null
  amount: number | null
  status: TPreContractStatus | null
  customer: IPreContractCustomerDetail | null
  loanType: IPreContractLoanType | null
  staff?: IPreContractStaff
  assets: IAssetDetailInfo[]
}

export type TGetPreContractListResponse = IBasePaginationResponse<IPreContractList>
export type TGetPreContractByIdResponse = IBaseSuccessResponse<IPreContractById>
export type TActionPreContract = IBaseSuccessResponse<boolean>
