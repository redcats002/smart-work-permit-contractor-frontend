import type { IEntity } from '@/models/Global.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

interface ICustomerList extends IEntity {
  titleName: TTitleName
  firstName: string
  lastName: string
}

interface IContract extends IEntity {
  idNo: string
}

interface IReceipt extends IEntity {
  idNo: string
  receiptType: string
}

export interface IAccountClosureList extends IEntity {
  date: string
  receipt: IReceipt
  contract: IContract
  customer: ICustomerList
  principal: number
  interest: number
  otherExpense: number
  discountInterest: number
  discountOther: number
  totalAmount: number
  assets: string[]
}

export type TGetAccountClosureListResponse = IBasePaginationResponse<IAccountClosureList>
export type TActionAccountClosure = IBaseSuccessResponse<boolean>
