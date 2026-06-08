import type {
  ICreateCustomerDocumentPayload,
  ICreateCustomerPayload,
  IGetCustomerContactHistoryList,
  IGetCustomerContractList,
  IGetCustomerDocumentList,
  IGetCustomerEstateList,
  IGetCustomerList,
  IGetCustomerPaymentHistoryList,
  IUpdateCustomerDocumentPayload,
  IUpdateCustomerPayload
} from '@/models/request/customer/CustomerReq.model'
import type {
  TActionCustomer,
  TActionCustomerDocument,
  TGetCustomerAssetListResponse,
  TGetCustomerByIdResponse,
  TGetCustomerContactHistoryListResponse,
  TGetCustomerContractListResponse,
  TGetCustomerDocumentByIdResponse,
  TGetCustomerDocumentListResponse,
  TGetCustomerListResponse,
  TGetCustomerPaymentHistoryListResponse
} from '@/models/response/customer/CustomerRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface ICustomerProvider {
  getCustomerPaginate (query: IGetCustomerList): Promise<TGetCustomerListResponse>
  createCustomer (payload: ICreateCustomerPayload): Promise<TActionCustomer>
  updateCustomer (id: TBaseParamsId, payload: IUpdateCustomerPayload): Promise<TActionCustomer>
  deleteCustomer (id: number): Promise<TActionCustomer>
  getCustomerFindOne (id: TBaseParamsId): Promise<TGetCustomerByIdResponse>
  getCustomerContracts (id: TBaseParamsId, query: IGetCustomerContractList): Promise<TGetCustomerContractListResponse>
  getCustomerPaymentHistory (id: TBaseParamsId, query: IGetCustomerPaymentHistoryList): Promise<TGetCustomerPaymentHistoryListResponse>
  getCustomerContactHistory (id: TBaseParamsId, query: IGetCustomerContactHistoryList): Promise<TGetCustomerContactHistoryListResponse>
  getCustomerEstates (id: TBaseParamsId, query: IGetCustomerEstateList): Promise<TGetCustomerAssetListResponse>
  getCustomerDocumentFindOne (id: TBaseParamsId): Promise<TGetCustomerDocumentByIdResponse>
  getCustomerDocumentPaginate (query: IGetCustomerDocumentList): Promise<TGetCustomerDocumentListResponse>
  createCustomerDocument (payload: ICreateCustomerDocumentPayload): Promise<TActionCustomerDocument>
  updateCustomerDocument (id: TBaseParamsId, payload: IUpdateCustomerDocumentPayload): Promise<TActionCustomerDocument>
  deleteCustomerDocument (id: TBaseParamsId): Promise<TActionCustomerDocument>
}

class CustomerProvider extends HttpRequest implements ICustomerProvider {
  private urlPrefix: string = '/api/v1/management/customer'

  public async getCustomerPaginate (query: IGetCustomerList): Promise<TGetCustomerListResponse> {
    this.setLogHeaders({ menu: 'CUSTOMER' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createCustomer (payload: ICreateCustomerPayload): Promise<TActionCustomer> {
    this.setLogHeaders({ menu: 'CUSTOMER' })
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateCustomer (id: TBaseParamsId, payload: IUpdateCustomerPayload): Promise<TActionCustomer> {
    this.setLogHeaders({ menu: 'CUSTOMER' })
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteCustomer (id: number): Promise<TActionCustomer> {
    this.setLogHeaders({ menu: 'CUSTOMER' })
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getCustomerFindOne (id: TBaseParamsId): Promise<TGetCustomerByIdResponse> {
    this.setLogHeaders({ menu: 'CUSTOMER' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getCustomerDocumentPaginate (query: IGetCustomerDocumentList): Promise<TGetCustomerDocumentListResponse> {
    this.setLogHeaders({ menu: 'CUSTOMER', subMenu: 'เอกสารส่วนตัว' })
    const response = await this.get(`${this.urlPrefix}-document`, query)
    return response
  }

  public async getCustomerDocumentFindOne (id: TBaseParamsId): Promise<TGetCustomerDocumentByIdResponse> {
    this.setLogHeaders({ menu: 'CUSTOMER', subMenu: 'เอกสารส่วนตัว' })
    const response = await this.get(`${this.urlPrefix}-document/${id}`)
    return response
  }

  public async createCustomerDocument (payload: ICreateCustomerDocumentPayload): Promise<TActionCustomerDocument> {
    this.setLogHeaders({ menu: 'CUSTOMER', subMenu: 'เอกสารส่วนตัว' })
    const response = await this.post(`${this.urlPrefix}-document`, payload)
    return response
  }

  public async updateCustomerDocument (id: TBaseParamsId, payload: IUpdateCustomerDocumentPayload): Promise<TActionCustomerDocument> {
    this.setLogHeaders({ menu: 'CUSTOMER', subMenu: 'เอกสารส่วนตัว' })
    const response = await this.put(`${this.urlPrefix}-document/${id}`, payload)
    return response
  }

  public async deleteCustomerDocument (id: TBaseParamsId): Promise<TActionCustomerDocument> {
    this.setLogHeaders({ menu: 'CUSTOMER', subMenu: 'เอกสารส่วนตัว' })
    const response = await this.delete(`${this.urlPrefix}-document/${id}`)
    return response
  }

  public async getCustomerContracts (id: TBaseParamsId, query: IGetCustomerContractList): Promise<TGetCustomerContractListResponse> {
    this.setLogHeaders({ menu: 'CUSTOMER', subMenu: 'สัญญา' })
    const response = await this.get(`${this.urlPrefix}/${id}/contracts`, query)
    return response
  }

  public async getCustomerPaymentHistory (id: TBaseParamsId, query: IGetCustomerPaymentHistoryList): Promise<TGetCustomerPaymentHistoryListResponse> {
    this.setLogHeaders({ menu: 'CUSTOMER', subMenu: 'ประวัติการชำระเงิน' })
    const response = await this.get(`${this.urlPrefix}/${id}/receipts`, query)
    return response
  }

  public async getCustomerContactHistory (id: TBaseParamsId, query: IGetCustomerContactHistoryList): Promise<TGetCustomerContactHistoryListResponse> {
    this.setLogHeaders({ menu: 'CUSTOMER', subMenu: 'ประวัติการติดต่อ' })
    const response = await this.get(`${this.urlPrefix}/${id}/contact-histories`, query)
    return response
  }

  public async getCustomerEstates (id: TBaseParamsId, query: IGetCustomerEstateList): Promise<TGetCustomerAssetListResponse> {
    this.setLogHeaders({ menu: 'CUSTOMER', subMenu: 'หลักทรัพย์' })
    const response = await this.get(`${this.urlPrefix}/${id}/assets`, query)
    return response
  }
}

export default CustomerProvider
