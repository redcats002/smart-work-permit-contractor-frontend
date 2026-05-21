import type { IEntity } from '@/models/Global.model'
import type { TVatType } from '@/enums/modules/Vat.enum'
import type { IMedia } from '@/resources/provider/Upload.provider'
import type { IFinanceIncomeCategoryList } from '../finance-income-category/FinanceIncomeCategoryRes.model'
import type { IFinanceIncomeTypeList } from '../finance-income-type/FinanceIncomeTypeRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IContractIncomeList extends IEntity {
  date: string
  incomeCategory: IFinanceIncomeCategoryList
  incomeType: IFinanceIncomeTypeList
  note: string
  amount: number
  vatType?: TVatType
  file?: IMedia[]
}

export interface IContractIncomeById extends IEntity {
  contractId: number | null
  incomeCategory: IFinanceIncomeCategoryList
  incomeType: IFinanceIncomeTypeList
  note: string
  amount: number
  vatType: TVatType
  file: IMedia[]
}

export type TGetContractIncomeListResponse = IBasePaginationResponse<IContractIncomeList>
export type TGetContractIncomeByIdResponse = IBaseSuccessResponse<IContractIncomeById>
export type TActionContractIncomeResponse = IBaseSuccessResponse<boolean>
