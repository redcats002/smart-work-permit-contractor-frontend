import type { TVatType } from '@/enums/modules/Vat.enum'
import type { IUploadResponse } from '@/resources/provider/Upload.provider'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetIncomeList extends IBasePaginationRequest {}
export interface ICreateIncome {
  incomeCategoryId: number
  incomeTypeId: number
  note: string
  amount: number
  file: IUploadResponse[]
  vatType: TVatType
}
export interface IUpdateIncome extends Partial<ICreateIncome> {}
