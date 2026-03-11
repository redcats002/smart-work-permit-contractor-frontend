import type {
  ICreateEmployeePayload,
  IGetEmployeeContactHistoryList,
  IGetEmployeeContractList,
  IGetEmployeeEstateList,
  IGetEmployeeList,
  IGetEmployeePaymentHistoryList,
  IUpdateEmployeePayload
} from '@/models/request/employee/EmployeeReq.model'
import type {
  TActionEmployee,
  TGetEmployeeByIdResponse,
  TGetEmployeeContactHistoryListResponse,
  TGetEmployeeContractListResponse,
  TGetEmployeeEstateListResponse,
  TGetEmployeeListResponse,
  TGetEmployeePaymentHistoryListResponse
} from '@/models/response/employee/EmployeeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IEmployeeProvider {
  getEmployeePaginate (query: IGetEmployeeList): Promise<TGetEmployeeListResponse>
  createEmployee (payload: ICreateEmployeePayload): Promise<TActionEmployee>
  updateEmployee (id: TBaseParamsId, payload: IUpdateEmployeePayload): Promise<TActionEmployee>
  deleteEmployee (id: number): Promise<TActionEmployee>
  getEmployeeFindOne (id: TBaseParamsId): Promise<TGetEmployeeByIdResponse>
  getEmployeeContracts (id: TBaseParamsId, query: IGetEmployeeContractList): Promise<TGetEmployeeContractListResponse>
  getEmployeePaymentHistory (id: TBaseParamsId, query: IGetEmployeePaymentHistoryList): Promise<TGetEmployeePaymentHistoryListResponse>
  getEmployeeContactHistory (id: TBaseParamsId, query: IGetEmployeeContactHistoryList): Promise<TGetEmployeeContactHistoryListResponse>
  getEmployeeEstates (id: TBaseParamsId, query: IGetEmployeeEstateList): Promise<TGetEmployeeEstateListResponse>
}

class EmployeeProvider extends HttpRequest implements IEmployeeProvider {
  private urlPrefix: string = '/api/v1/employee'

  public async getEmployeePaginate (query: IGetEmployeeList): Promise<TGetEmployeeListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createEmployee (payload: ICreateEmployeePayload): Promise<TActionEmployee> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateEmployee (id: TBaseParamsId, payload: IUpdateEmployeePayload): Promise<TActionEmployee> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteEmployee (id: number): Promise<TActionEmployee> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getEmployeeFindOne (id: TBaseParamsId): Promise<TGetEmployeeByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getEmployeeContracts (id: TBaseParamsId, query: IGetEmployeeContractList): Promise<TGetEmployeeContractListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/contracts`, query)
    return response
  }

  public async getEmployeePaymentHistory (id: TBaseParamsId, query: IGetEmployeePaymentHistoryList): Promise<TGetEmployeePaymentHistoryListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/payment-history`, query)
    return response
  }

  public async getEmployeeContactHistory (id: TBaseParamsId, query: IGetEmployeeContactHistoryList): Promise<TGetEmployeeContactHistoryListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/contact-history`, query)
    return response
  }

  public async getEmployeeEstates (id: TBaseParamsId, query: IGetEmployeeEstateList): Promise<TGetEmployeeEstateListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/estates`, query)
    return response
  }
}

export default EmployeeProvider
