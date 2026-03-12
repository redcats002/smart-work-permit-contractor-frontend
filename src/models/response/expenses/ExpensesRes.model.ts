import type { IEntity } from '@/models/Global.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IExpensesCustomer {
  id: number | null
  titleName: TTitleName | null
  firstName: string | null
  lastName: string | null
}

export interface IExpensesList extends IEntity {
  contractId: number | null
  contractIdNo: string | null
  expensesDate: string | null
  expensesType: string // Maybe enum
  type: string
  category: string
  customer: IExpensesCustomer | null
  totalValue: number | null
}

export type TGetExpensesListResponse = IBasePaginationResponse<IExpensesList>
export type TActionExpenses = IBaseSuccessResponse<boolean>
