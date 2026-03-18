import type { IEntity } from '@/models/Global.model'
import type { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IUploadResponse } from '@/resources/provider/Upload.provider'
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
  expensesType: ExpensesTypeEnum
  type: string
  category: string
  customer: IExpensesCustomer | null
  totalValue: number | null
}

export interface IExpensesById extends IEntity {
  expenseNo: string
  date: string
  expensesType: ExpensesTypeEnum
  type: string
  category: string
  note: string
  totalValue: number | null
  files: IUploadResponse[]
}

export type TGetExpensesListResponse = IBasePaginationResponse<IExpensesList>
export type TGetExpensesDetailResponse = IBaseSuccessResponse<IExpensesById>
export type TActionExpenses = IBaseSuccessResponse<boolean>
