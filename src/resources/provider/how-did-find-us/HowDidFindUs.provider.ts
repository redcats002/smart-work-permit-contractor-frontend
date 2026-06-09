import type { ICreateHowDidFindUsPayload, IGetHowDidFindUsList, IUpdateHowDidFindUsPayload } from '@/models/request/how-did-find-us/HowDidFindUsReq.model'
import type { TActionHowDidFindUs, TGetHowDidFindUsByIdResponse, TGetHowDidFindUsListResponse } from '@/models/response/how-did-find-us/HowDidFindUsRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IHowDidFindUsProvider {
  getHowDidFindUsPaginate (query: IGetHowDidFindUsList): Promise<TGetHowDidFindUsListResponse>
  createHowDidFindUs (payload: ICreateHowDidFindUsPayload): Promise<TActionHowDidFindUs>
  updateHowDidFindUs (id: TBaseParamsId, payload: IUpdateHowDidFindUsPayload): Promise<TActionHowDidFindUs>
  deleteHowDidFindUs (id: TBaseParamsId): Promise<TActionHowDidFindUs>
  getHowDidFindUsFindOne (id: TBaseParamsId): Promise<TGetHowDidFindUsByIdResponse>
}

class HowDidFindUsProvider extends HttpRequest implements IHowDidFindUsProvider {
  private urlPrefix: string = '/api/v1/management/how-did-find-us'

  public async getHowDidFindUsPaginate (query: IGetHowDidFindUsList): Promise<TGetHowDidFindUsListResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ช่องทางการรู้จักเรา' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createHowDidFindUs (payload: ICreateHowDidFindUsPayload): Promise<TActionHowDidFindUs> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ช่องทางการรู้จักเรา' })
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateHowDidFindUs (id: TBaseParamsId, payload: IUpdateHowDidFindUsPayload): Promise<TActionHowDidFindUs> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ช่องทางการรู้จักเรา' })
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteHowDidFindUs (id: TBaseParamsId): Promise<TActionHowDidFindUs> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ช่องทางการรู้จักเรา' })
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getHowDidFindUsFindOne (id: TBaseParamsId): Promise<TGetHowDidFindUsByIdResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ช่องทางการรู้จักเรา' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default HowDidFindUsProvider
