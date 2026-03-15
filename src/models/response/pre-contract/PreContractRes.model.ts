import type { IBaseModel, IEntity } from '@/models/Global.model'
import type { TAssetType } from '@/enums/modules/contract/AssetType.enum'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TEvaluatorLevel } from '@/enums/modules/contract/EvaluatorLevel.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IPreContractCustomer {
  id: number
  titleName: TTitleName
  firstName: string
  lastName: string
}

export interface IPreContractCustomerDetail extends IPreContractCustomer {
  idNo: string
  idCard: string
  birthDate: string
  customerGroup: IBaseModel
  occupation: IBaseModel
  email: string
  phoneNumber: string
  phoneNumber2?: string
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
  detail: string
  address: string
  subDistrict: string
  district: string
  province: string
  postCode: string
  urlGoogleMap: string
  // vehicle-specific
  licensePlate: string
  vehicleProvince: string
  yearManufactured: number
  yearRegistered: number
  chassisNumber: string
  mileage: number
  // land-specific
  landNumber: string
  surveyPageNumber: string
  landLocation: string
  aerialPhotoNumber: string
  aerialPhotoSheet: string
  areaRai: number
  areaRgan: number
  areaTarangWa: number
  images: IPreAssetImage[]
}

export interface IPreContractLoanType {
  id: number
  name: string
}

export interface IEvaluatorList extends IEntity {
  titleName: TTitleName
  firstName: string
  lastName: string
  evaluatorLevel: TEvaluatorLevel
  loanAmount: number
}

export interface IAppraisalById extends IEntity {
  evaluatorLevel: TEvaluatorLevel
  detail: string
  evaluators: IEvaluatorList[]
}

export interface IPreContractList extends IEntity {
  contractDate: string
  startDate: string
  endDate: string
  amount: number
  status: TContractStatus
  assetStatus: TPreContractStatus
  customer: IPreContractCustomer
  loanType: IPreContractLoanType
}

export interface IPreContractById extends IEntity {
  contractDate: string
  startDate: string
  endDate: string
  amount: number
  status: TPreContractStatus
  customer: IPreContractCustomerDetail
  loanType: IPreContractLoanType
  staff?: IPreContractStaff
  assets: IAssetDetailInfo[]
  appraisals: IAppraisalById[]
}

export type TGetPreContractListResponse = IBasePaginationResponse<IPreContractList>
export type TGetPreContractByIdResponse = IBaseSuccessResponse<IPreContractById>
export type TActionPreContract = IBaseSuccessResponse<boolean>
export type TRequestReappraisalPreContract = IBaseSuccessResponse<boolean>
export type TAppraisalPricePreContract = IBaseSuccessResponse<boolean>
export type TConfirmAppraisalPreContract = IBaseSuccessResponse<boolean>
export type TConfirmMortgagePreContract = IBaseSuccessResponse<boolean>
export type TMakeAContractPreContract = IBaseSuccessResponse<boolean>
