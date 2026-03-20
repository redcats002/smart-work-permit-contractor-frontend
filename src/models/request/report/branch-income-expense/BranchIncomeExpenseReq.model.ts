import type { TFinanceCategory } from '@/enums/modules/report/branch-income-expense/FinanceCategory.enum'
import type { TTransactionType } from '@/enums/modules/report/branch-income-expense/TransactionType.enum'
import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetBranchIncomeExpenseList extends IBasePaginationRequest {
  incomeCategoryId?: number
  expenseCategoryId?: number
  transactionType?: TTransactionType
  financeCategory?: TFinanceCategory
}
