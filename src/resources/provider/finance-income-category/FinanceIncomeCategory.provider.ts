import type {
  ICreateFinanceIncomeTypePayload,
  IGetFinanceIncomeTypeList,
  IUpdateFinanceIncomeTypePayload
} from '@/models/request/finance-income-type/FinanceIncomeTypeReq.model'
import type {
  TActionFinanceIncomeCategory,
  TGetFinanceIncomeCategoryByIdResponse,
  TGetFinanceIncomeCategoryListResponse
} from '@/models/response/finance-income-category/FinanceIncomeCategoryRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IFinanceIncomeCategoryProvider {
  getFinanceIncomeCategoryPaginate (query: IGetFinanceIncomeTypeList): Promise<TGetFinanceIncomeCategoryListResponse>
  createFinanceIncomeCategory (payload: ICreateFinanceIncomeTypePayload): Promise<TActionFinanceIncomeCategory>
  updateFinanceIncomeCategory (id: TBaseParamsId, payload: IUpdateFinanceIncomeTypePayload): Promise<TActionFinanceIncomeCategory>
  deleteFinanceIncomeCategory (id: number): Promise<TActionFinanceIncomeCategory>
  getFinanceIncomeCategoryFindOne (id: TBaseParamsId): Promise<TGetFinanceIncomeCategoryByIdResponse>
}

class FinanceIncomeCategoryProvider extends HttpRequest implements IFinanceIncomeCategoryProvider {
  private urlPrefix: string = '/api/v1/finance-income-category'

  public async getFinanceIncomeCategoryPaginate (query: IGetFinanceIncomeTypeList): Promise<TGetFinanceIncomeCategoryListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createFinanceIncomeCategory (payload: ICreateFinanceIncomeTypePayload): Promise<TActionFinanceIncomeCategory> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateFinanceIncomeCategory (id: TBaseParamsId, payload: IUpdateFinanceIncomeTypePayload): Promise<TActionFinanceIncomeCategory> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteFinanceIncomeCategory (id: number): Promise<TActionFinanceIncomeCategory> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getFinanceIncomeCategoryFindOne (id: TBaseParamsId): Promise<TGetFinanceIncomeCategoryByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default FinanceIncomeCategoryProvider
