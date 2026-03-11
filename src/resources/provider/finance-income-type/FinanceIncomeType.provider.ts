import type {
  ICreateFinanceIncomeCategoryPayload,
  IGetFinanceIncomeCategoryList,
  IUpdateFinanceIncomeCategoryPayload
} from '@/models/request/finance-income-category/FinanceIncomeCategoryReq.model'
import type {
  TActionFinanceIncomeType,
  TGetFinanceIncomeTypeByIdResponse,
  TGetFinanceIncomeTypeListResponse
} from '@/models/response/finance-income-type/FinanceIncomeTypeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IFinanceIncomeTypeProvider {
  getFinanceIncomeTypePaginate (query: IGetFinanceIncomeCategoryList): Promise<TGetFinanceIncomeTypeListResponse>
  createFinanceIncomeType (payload: ICreateFinanceIncomeCategoryPayload): Promise<TActionFinanceIncomeType>
  updateFinanceIncomeType (id: TBaseParamsId, payload: IUpdateFinanceIncomeCategoryPayload): Promise<TActionFinanceIncomeType>
  deleteFinanceIncomeType (id: number): Promise<TActionFinanceIncomeType>
  getFinanceIncomeTypeFindOne (id: TBaseParamsId): Promise<TGetFinanceIncomeTypeByIdResponse>
}

class FinanceIncomeTypeProvider extends HttpRequest implements IFinanceIncomeTypeProvider {
  private urlPrefix: string = '/api/v1/finance-income-type'

  public async getFinanceIncomeTypePaginate (query: IGetFinanceIncomeCategoryList): Promise<TGetFinanceIncomeTypeListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createFinanceIncomeType (payload: ICreateFinanceIncomeCategoryPayload): Promise<TActionFinanceIncomeType> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateFinanceIncomeType (id: TBaseParamsId, payload: IUpdateFinanceIncomeCategoryPayload): Promise<TActionFinanceIncomeType> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteFinanceIncomeType (id: number): Promise<TActionFinanceIncomeType> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getFinanceIncomeTypeFindOne (id: TBaseParamsId): Promise<TGetFinanceIncomeTypeByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default FinanceIncomeTypeProvider
