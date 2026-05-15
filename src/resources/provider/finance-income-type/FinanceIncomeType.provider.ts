import type {
  ICreateFinanceIncomeTypePayload,
  IGetFinanceIncomeTypeList,
  IUpdateFinanceIncomeTypePayload
} from '@/models/request/finance-income-type/FinanceIncomeTypeReq.model'
import type {
  TActionFinanceIncomeType,
  TGetFinanceIncomeTypeByIdResponse,
  TGetFinanceIncomeTypeListResponse
} from '@/models/response/finance-income-type/FinanceIncomeTypeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IFinanceIncomeTypeProvider {
  getFinanceIncomeTypePaginate (query: IGetFinanceIncomeTypeList): Promise<TGetFinanceIncomeTypeListResponse>
  createFinanceIncomeType (payload: ICreateFinanceIncomeTypePayload): Promise<TActionFinanceIncomeType>
  updateFinanceIncomeType (id: TBaseParamsId, payload: IUpdateFinanceIncomeTypePayload): Promise<TActionFinanceIncomeType>
  deleteFinanceIncomeType (id: TBaseParamsId): Promise<TActionFinanceIncomeType>
  getFinanceIncomeTypeFindOne (id: TBaseParamsId): Promise<TGetFinanceIncomeTypeByIdResponse>
}

class FinanceIncomeTypeProvider extends HttpRequest implements IFinanceIncomeTypeProvider {
  private urlPrefix: string = '/api/v1/management/finance-income-type'

  public async getFinanceIncomeTypePaginate (query: IGetFinanceIncomeTypeList): Promise<TGetFinanceIncomeTypeListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createFinanceIncomeType (payload: ICreateFinanceIncomeTypePayload): Promise<TActionFinanceIncomeType> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateFinanceIncomeType (id: TBaseParamsId, payload: IUpdateFinanceIncomeTypePayload): Promise<TActionFinanceIncomeType> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteFinanceIncomeType (id: TBaseParamsId): Promise<TActionFinanceIncomeType> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getFinanceIncomeTypeFindOne (id: TBaseParamsId): Promise<TGetFinanceIncomeTypeByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default FinanceIncomeTypeProvider
