import type { TVatType } from '@/enums/modules/Vat.enum'
import type { IUploadResponse } from '@/resources/provider/Upload.provider'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetExpenseList extends IBasePaginationRequest {}
export interface ICreateExpense {
  expenseCategoryId: number
  expenseTypeId: number
  amount: number
  file: IUploadResponse[]
  note: string
  vatType: TVatType
}
export interface IUpdateExpense extends Partial<ICreateExpense> {}
