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

export interface IItemsAccountClosure {
  paymentMethod: string
  cutBalance: number
  discount: number
  total: number
}
export interface IAccountClosureList extends IEntity {
  date: string
  receipt: IContract
  contract: IContract
  customer: ICustomerList
  items: IItemsAccountClosure[]
  interest: number
  category: string
}

export type TGetAccountClosureListResponse = IBasePaginationResponse<IAccountClosureList>
export type TActionAccountClosure = IBaseSuccessResponse<boolean>
