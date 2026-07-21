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

export interface IAccountClosureList extends IEntity {
  date: string
  receipt: IContract
  contract: IContract
  customer: ICustomerList
  principal: number
  interest: number
  otherExpenses: number
  interestDiscount: number
  otherDiscount: number
  totalPayment: number
  assetCategory: string
  debtorType: string
}

export type TGetAccountClosureListResponse = IBasePaginationResponse<IAccountClosureList>
export type TActionAccountClosure = IBaseSuccessResponse<boolean>
