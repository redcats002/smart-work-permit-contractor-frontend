import type {
  ICreateManagementPositionPayload,
  IGetManagementPositionList,
  IUpdateManagementPositionPayload
} from '@/models/request/management-position/ManagementPositionReq.model'
import type {
  TActionManagementPosition,
  TGetManagementPositionByIdResponse,
  TGetManagementPositionListResponse
} from '@/models/response/management-position/ManagementPositionRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IManagementPositionProvider {
  getManagementPositionPaginate (
    query: IGetManagementPositionList
  ): Promise<TGetManagementPositionListResponse>
  createManagementPosition (
    payload: ICreateManagementPositionPayload
  ): Promise<TActionManagementPosition>
  updateManagementPosition (
    id: TBaseParamsId,
    payload: IUpdateManagementPositionPayload
  ): Promise<TActionManagementPosition>
  deleteManagementPosition (id: TBaseParamsId): Promise<TActionManagementPosition>
  getManagementPositionFindOne (id: TBaseParamsId): Promise<TGetManagementPositionByIdResponse>
}

class ManagementPositionProvider extends HttpRequest implements IManagementPositionProvider {
  private urlPrefix: string = '/api/v1/management/management-position'

  public async getManagementPositionPaginate (
    query: IGetManagementPositionList
  ): Promise<TGetManagementPositionListResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ผังบริหาร' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createManagementPosition (
    payload: ICreateManagementPositionPayload
  ): Promise<TActionManagementPosition> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ผังบริหาร' })
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateManagementPosition (
    id: TBaseParamsId,
    payload: IUpdateManagementPositionPayload
  ): Promise<TActionManagementPosition> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ผังบริหาร' })
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteManagementPosition (id: TBaseParamsId): Promise<TActionManagementPosition> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ผังบริหาร' })
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getManagementPositionFindOne (
    id: TBaseParamsId
  ): Promise<TGetManagementPositionByIdResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ผังบริหาร' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default ManagementPositionProvider
