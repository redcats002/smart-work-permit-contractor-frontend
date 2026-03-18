import type { IBaseModel, IEntity } from '@/models/Global.model'
import type { IBorrowerList } from '@/models/modules/pre-contract/Borrower.model'
import type { IEvaluateGroupList } from '@/models/modules/pre-contract/Evaluator.model'
import type { IGuarantorList } from '@/models/modules/pre-contract/Guarantor.model'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { TInterestType } from '@/enums/modules/contract/InterestType.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IContractLoanPurposeList } from '../contract-loan-purpose/ContractLoanPurposeRes.model'
import type { IContractLoanTypeList } from '../contract-loan-type/ContractLoanTypeRes.model'
import type { ICustomerById } from '../customer/CustomerRes.model'
import type { IEmployeeList } from '../employee/EmployeeRes.model'
import type { IHowDidFindUsList } from '../how-did-find-us/HowDidFindUsRes.model'
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


export interface IPreContractLoanType {
  id: number
  name: string
}
export interface IPreContractList extends IEntity {
  contractDate: string
  startDate: string
  endDate: string
  amount: number
  status: TPreContractStatus
  customer: IPreContractCustomer
  loanType: IPreContractLoanType
}

export interface IPreContractById extends Omit<IEntity, 'status'> {
  status: TPreContractStatus
  contractedAt: string
  loanAmount: number
  installmentCount: number
  interestType: TInterestType
  annualInterestRate: number
  lateFee: number
  contractLoanPurpose: IContractLoanPurposeList
  contractLoanType: IContractLoanTypeList
  howDidFindUs: IHowDidFindUsList
  sellMan: IEmployeeList
  customer: ICustomerById
  borrowers: IBorrowerList[]
  guarantors: IGuarantorList[]
  evaluateGroups: IEvaluateGroupList[]
  preAssets: IPreAssetList[]
}

export type TGetPreContractListResponse = IBasePaginationResponse<IPreContractList>
export type TGetPreContractByIdResponse = IBaseSuccessResponse<IPreContractById>
export type TActionPreContract = IBaseSuccessResponse<boolean>
export type TUpdatePreAssetPreContract = IBaseSuccessResponse<boolean>
export type TRequestReappraisalPreContract = IBaseSuccessResponse<boolean>
export type TAppraisalPricePreContract = IBaseSuccessResponse<boolean>
export type TConfirmAppraisalPreContract = IBaseSuccessResponse<boolean>
export type TConfirmMortgagePreContract = IBaseSuccessResponse<boolean>
export type TMakeAContractPreContract = IBaseSuccessResponse<boolean>
