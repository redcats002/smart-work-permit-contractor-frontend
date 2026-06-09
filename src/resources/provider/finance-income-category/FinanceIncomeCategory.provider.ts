import type {
  ICreateFinanceIncomeCategoryPayload,
  IGetFinanceIncomeCategoryList,
  IUpdateFinanceIncomeCategoryPayload
} from '@/models/request/finance-income-category/FinanceIncomeCategoryReq.model'
import type {
  TActionFinanceIncomeCategory,
  TGetFinanceIncomeCategoryByIdResponse,
  TGetFinanceIncomeCategoryListResponse
} from '@/models/response/finance-income-category/FinanceIncomeCategoryRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IFinanceIncomeCategoryProvider {
  getFinanceIncomeCategoryPaginate (query: IGetFinanceIncomeCategoryList): Promise<TGetFinanceIncomeCategoryListResponse>
  createFinanceIncomeCategory (payload: ICreateFinanceIncomeCategoryPayload): Promise<TActionFinanceIncomeCategory>
  updateFinanceIncomeCategory (id: TBaseParamsId, payload: IUpdateFinanceIncomeCategoryPayload): Promise<TActionFinanceIncomeCategory>
  deleteFinanceIncomeCategory (id: TBaseParamsId): Promise<TActionFinanceIncomeCategory>
  getFinanceIncomeCategoryFindOne (id: TBaseParamsId): Promise<TGetFinanceIncomeCategoryByIdResponse>
}

class FinanceIncomeCategoryProvider extends HttpRequest implements IFinanceIncomeCategoryProvider {
  private urlPrefix: string = '/api/v1/management/finance-income-category'

  public async getFinanceIncomeCategoryPaginate (query: IGetFinanceIncomeCategoryList): Promise<TGetFinanceIncomeCategoryListResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'หมวดหมู่รายได้' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createFinanceIncomeCategory (payload: ICreateFinanceIncomeCategoryPayload): Promise<TActionFinanceIncomeCategory> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'หมวดหมู่รายได้' })
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateFinanceIncomeCategory (id: TBaseParamsId, payload: IUpdateFinanceIncomeCategoryPayload): Promise<TActionFinanceIncomeCategory> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'หมวดหมู่รายได้' })
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteFinanceIncomeCategory (id: TBaseParamsId): Promise<TActionFinanceIncomeCategory> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'หมวดหมู่รายได้' })
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getFinanceIncomeCategoryFindOne (id: TBaseParamsId): Promise<TGetFinanceIncomeCategoryByIdResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'หมวดหมู่รายได้' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default FinanceIncomeCategoryProvider
