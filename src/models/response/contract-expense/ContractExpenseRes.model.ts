import type { IEntity } from '@/models/Global.model'
import type { TVatType } from '@/enums/modules/Vat.enum'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { IFinanceExpenseCategoryList } from '../finance-expense-category/FinanceExpenseCategoryRes.model'
import type { IFinanceExpenseTypeList } from '../finance-expense-type/FinanceExpenseTypeRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IContractExpenseList extends IEntity {
  date: string
  expenseCategory: IFinanceExpenseCategoryList
  expenseType: IFinanceExpenseTypeList
  note: string
  amount: number
  vatType?: TVatType
  file?: IMedia[]
}

export interface IContractExpenseById extends IEntity {
  contractId: number | null
  expenseCategory: IFinanceExpenseCategoryList
  expenseType: IFinanceExpenseTypeList
  note: string
  amount: number
  vatType: TVatType
  file: IMedia[]
}

export type TGetContractExpenseListResponse = IBasePaginationResponse<IContractExpenseList>
export type TGetContractExpenseByIdResponse = IBaseSuccessResponse<IContractExpenseById>
export type TActionContractExpenseResponse = IBaseSuccessResponse<boolean>
