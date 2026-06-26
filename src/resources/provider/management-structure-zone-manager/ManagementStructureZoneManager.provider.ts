import type {
  ICreateManagementStructureZoneManagerPayload,
  IGetManagementStructureZoneManagerList,
  IUpdateManagementStructureZoneManagerPayload
} from '@/models/request/management-structure-zone-manager/ManagementStructureZoneManagerReq.model'
import type {
  TActionManagementStructureZoneManager,
  TGetManagementStructureZoneManagerByIdResponse,
  TGetManagementStructureZoneManagerListResponse
} from '@/models/response/management-structure-zone-manager/ManagementStructureZoneManagerRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IManagementStructureZoneManagerProvider {
  getManagementStructureZoneManagerPaginate (
    query: IGetManagementStructureZoneManagerList
  ): Promise<TGetManagementStructureZoneManagerListResponse>
  createManagementStructureZoneManager (
    payload: ICreateManagementStructureZoneManagerPayload
  ): Promise<TActionManagementStructureZoneManager>
  updateManagementStructureZoneManager (
    id: TBaseParamsId,
    payload: IUpdateManagementStructureZoneManagerPayload
  ): Promise<TActionManagementStructureZoneManager>
  deleteManagementStructureZoneManager (id: TBaseParamsId): Promise<TActionManagementStructureZoneManager>
  getManagementStructureZoneManagerFindOne (id: TBaseParamsId): Promise<TGetManagementStructureZoneManagerByIdResponse>
}

class ManagementStructureZoneManagerProvider extends HttpRequest implements IManagementStructureZoneManagerProvider {
  private urlPrefix: string = '/api/v1/management/zone-manager'

  public async getManagementStructureZoneManagerPaginate (
    query: IGetManagementStructureZoneManagerList
  ): Promise<TGetManagementStructureZoneManagerListResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ผู้จัดการเขต' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createManagementStructureZoneManager (
    payload: ICreateManagementStructureZoneManagerPayload
  ): Promise<TActionManagementStructureZoneManager> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ผู้จัดการเขต' })
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateManagementStructureZoneManager (
    id: TBaseParamsId,
    payload: IUpdateManagementStructureZoneManagerPayload
  ): Promise<TActionManagementStructureZoneManager> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ผู้จัดการเขต' })
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteManagementStructureZoneManager (id: TBaseParamsId): Promise<TActionManagementStructureZoneManager> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ผู้จัดการเขต' })
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getManagementStructureZoneManagerFindOne (
    id: TBaseParamsId
  ): Promise<TGetManagementStructureZoneManagerByIdResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ผู้จัดการเขต' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default ManagementStructureZoneManagerProvider
