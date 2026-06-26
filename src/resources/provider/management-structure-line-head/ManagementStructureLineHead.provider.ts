import type {
  ICreateManagementStructureLineHeadPayload,
  IGetManagementStructureLineHeadList,
  IUpdateManagementStructureLineHeadPayload
} from '@/models/request/management-structure-line-head/ManagementStructureLineHeadReq.model'
import type {
  TActionManagementStructureLineHead,
  TGetManagementStructureLineHeadByIdResponse,
  TGetManagementStructureLineHeadListResponse
} from '@/models/response/management-structure-line-head/ManagementStructureLineHeadRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IManagementStructureLineHeadProvider {
  getManagementStructureLineHeadPaginate (
    query: IGetManagementStructureLineHeadList
  ): Promise<TGetManagementStructureLineHeadListResponse>
  createManagementStructureLineHead (
    payload: ICreateManagementStructureLineHeadPayload
  ): Promise<TActionManagementStructureLineHead>
  updateManagementStructureLineHead (
    id: TBaseParamsId,
    payload: IUpdateManagementStructureLineHeadPayload
  ): Promise<TActionManagementStructureLineHead>
  deleteManagementStructureLineHead (id: TBaseParamsId): Promise<TActionManagementStructureLineHead>
  getManagementStructureLineHeadFindOne (id: TBaseParamsId): Promise<TGetManagementStructureLineHeadByIdResponse>
}

class ManagementStructureLineHeadProvider extends HttpRequest implements IManagementStructureLineHeadProvider {
  private urlPrefix: string = '/api/v1/management/line-head'

  public async getManagementStructureLineHeadPaginate (
    query: IGetManagementStructureLineHeadList
  ): Promise<TGetManagementStructureLineHeadListResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'หัวหน้าสาย' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createManagementStructureLineHead (
    payload: ICreateManagementStructureLineHeadPayload
  ): Promise<TActionManagementStructureLineHead> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'หัวหน้าสาย' })
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateManagementStructureLineHead (
    id: TBaseParamsId,
    payload: IUpdateManagementStructureLineHeadPayload
  ): Promise<TActionManagementStructureLineHead> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'หัวหน้าสาย' })
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteManagementStructureLineHead (id: TBaseParamsId): Promise<TActionManagementStructureLineHead> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'หัวหน้าสาย' })
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getManagementStructureLineHeadFindOne (
    id: TBaseParamsId
  ): Promise<TGetManagementStructureLineHeadByIdResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'หัวหน้าสาย' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default ManagementStructureLineHeadProvider
