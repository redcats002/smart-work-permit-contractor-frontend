import type { IAuthor, IEntity } from '@/models/Global.model'
import type { ICloseContractFile } from '@/models/request/close-contract/CloseContractReq.model'
import type { TInstallmentStatus } from '@/enums/modules/contract/InstallmentStatus.enum'
import type { TReceiptStatus } from '@/enums/modules/finance/receipt/ReceiptStatus.enum'
import type { TReceiptType } from '@/enums/modules/finance/receipt/ReceiptType.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IQRPaymentResponse } from '@/composables/useQRPayment'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'
import type { TReceiptPaymentMethod } from './PaymentMethod.enum'

export interface IReceiptCustomer {
  id: number | null
  idNo?: string
  fullName?: string
  idCard: string
  titleName: TTitleName
  firstName: string
  lastName: string
  birthDate?: string | null
  customerGroup?: { id: number, name: string } | null
  occupation?: { id: number, name: string } | null
  phoneNumber?: string | null
  phoneNumber2?: string | null
  email?: string | null
  mainAddress?: {
    id: number
    villageNo?: string
    address?: string
    district?: string
    subDistrict?: string
    province?: string
    postCode?: string
  } | null
}

export interface IReceiptPaymentRow {
  installmentNo: number
  penalty: number
  tracking: number
  lawyer: number
  interest: number
  principal: number
  total: number
}

export interface IReceiptPaymentGroup {
  contractNo: string
  rows: IReceiptPaymentRow[]
}

export interface IReceiptList extends IEntity {
  contractId: number | null
  contractIdNo: string | null
  receiptDate: string | null
  customer: IReceiptCustomer
  totalValue: number | null
  paidAt: Date | null | string
  totalAmount: number
  receiptStatus: TReceiptStatus
  receiptType: TReceiptType
}

export interface IReceiptDetailItems {
  detail: string
  price: number
}

export interface IReceiptSummary {
  principal: number
  interest: number
  otherExpenses: number
  totalInstallment: number
  penaltyFee: number
  collectionFee: number
  legalFee: number
  discountInterest: number
  discountOther: number
  totalAmount: number
}

export interface IReceiptDetailInstallment {
  id: number
  order: number
  discountInterest: number
  discountOther: number
  discountPenaltyFee: number
  principal: number
  interest: number
  totalInstallment: number
  totalAmount: number
  penaltyFee: number
  collectionFee: number
  legalFee: number
}

export interface IReceiptDetailContract {
  id: number
  idNo: string
  installments: IReceiptDetailInstallment[]
}

export interface IReceiptOtherExpense {
  amount: number
  remark: string
  files: ICloseContractFile[]
  expenseCategory: {
    id: number
    name: string
  }
  expenseType: {
    id: number
    name: string
  }
}

export interface IReceiptById extends IEntity {
  paidAt: string
  paymentType: TReceiptPaymentMethod | null
  receivedBy: IAuthor
  customer: IReceiptCustomer
  branch: {
    id: string
    name: string
  }
  createBy: IAuthor
  receiptType?: TReceiptType | null
  contracts: IReceiptDetailContract[]
  summary: IReceiptSummary
  totalOutstandingDebt: number
  otherExpenses: IReceiptOtherExpense[]
  discountInterestMonth: number

  // Compatibility fields if needed by other components - can be marked as optional or removed if fully migrated
  contractId?: number | null
  receiptNo?: string | null
  contractNo?: string | null
  dateOfPayment?: string | null
  officer?: IReceiptCustomer
  address?: string
  subDistrict?: string
  district?: string
  province?: string
  postCode?: string
  totalValue?: number | null
  items?: IReceiptDetailItems[]
  interest?: number | null
  principal?: number | null
  outstanding?: number | null
  paymentGroups?: IReceiptPaymentGroup[]
}

export interface IReceiptInstallment extends IEntity {
  status: string
  contractNo: string
  installmentDate: string
  installmentPrice: number
  interest: number
  paid: number
  outstanding: number
}

export interface IReceiptFeeBreakdown {
  total: number
  paid: number
  outstanding: number
}

export interface IReceiptInstallmentCreate {
  id: number
  order: number
  status: TInstallmentStatus
  dueDate: string
  penaltyFee: IReceiptFeeBreakdown
  collectionFee: IReceiptFeeBreakdown
  legalFee: IReceiptFeeBreakdown
  interest: IReceiptFeeBreakdown
  principal: IReceiptFeeBreakdown
  total: IReceiptFeeBreakdown
}

export interface IReceiptContractItem {
  id: number
  idNo: string
  installments: IReceiptInstallmentCreate[]
}

export interface IReceiptReference {
  id: number
  qrImage: string
  expired: string
  receiptType: string
  normalPayload: Array<{
    id: number
    installments: Array<{
      id: number
      discountPenaltyFee: number
      amount: number
    }>
  }>
  branchId: string
  createdByEmployeeId: string
}

export interface IReceiptCustomerInfo {
  id: number
  idNo: string
  idCard: string
  firstName: string
  lastName: string
  fullName: string
  birthDate: string
  phoneNumber: string
  phoneNumber2: string
  email: string
  customerGroup: { id: number, name: string } | null
  occupation: { id: number, name: string } | null
  receiptReference?: IReceiptReference | null
}

export interface IReceiptInstallmentsByCustomer {
  customer: IReceiptCustomerInfo
  contracts: IReceiptContractItem[]
}

export type TGetReceiptListResponse = IBasePaginationResponse<IReceiptList>
export type TGetReceiptDetailResponse = IBaseSuccessResponse<IReceiptById>
export type TGetReceiptInstallmentsResponse = IBaseSuccessResponse<IReceiptInstallmentsByCustomer>
export type TActionReceipt = IBaseSuccessResponse<boolean | IQRPaymentResponse>
