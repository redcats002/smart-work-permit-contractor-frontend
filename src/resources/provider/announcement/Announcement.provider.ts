import type { ICreateAnnouncementPayload, IGetAnnouncementList, IUpdateAnnouncementPayload } from '@/models/request/announcement/AnnouncementReq.model'
import type { TActionAnnouncement, TGetAnnouncementListResponse } from '@/models/response/announcement/AnnouncementRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IAnnouncementProvider {
  getAnnouncementPaginate (query: IGetAnnouncementList): Promise<TGetAnnouncementListResponse>
  createAnnouncement(payload: ICreateAnnouncementPayload): Promise<TActionAnnouncement>
  updateAnnouncement(id: number, payload: IUpdateAnnouncementPayload): Promise<TActionAnnouncement>
  deleteAnnouncement(id: number): Promise<TActionAnnouncement>
}

class AnnouncementProvider extends HttpRequest implements IAnnouncementProvider {
  private urlPrefix: string = '/api/v1/management/announcement'

  public async getAnnouncementPaginate (query: IGetAnnouncementList): Promise<TGetAnnouncementListResponse> {
    this.setLogHeaders({ menu: 'ANNOUNCEMENT' })
    return this.get(this.urlPrefix, query)
  }

  public async createAnnouncement (payload: ICreateAnnouncementPayload): Promise<TActionAnnouncement> {
    this.setLogHeaders({ menu: 'ANNOUNCEMENT' })
    return this.post(this.urlPrefix, payload)
  }

  public async updateAnnouncement (id: number, payload: IUpdateAnnouncementPayload): Promise<TActionAnnouncement> {
    this.setLogHeaders({ menu: 'ANNOUNCEMENT' })
    return this.put(`${this.urlPrefix}/${id}`, payload)
  }

  public async deleteAnnouncement (id: number): Promise<TActionAnnouncement> {
    this.setLogHeaders({ menu: 'ANNOUNCEMENT' })
    return this.delete(`${this.urlPrefix}/${id}`)
  }
}

export default AnnouncementProvider
