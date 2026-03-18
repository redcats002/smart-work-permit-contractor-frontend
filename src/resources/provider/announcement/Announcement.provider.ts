
import type { ICreateAnnouncementPayload, IGetAnnouncementList } from '@/models/request/announcement/AnnouncementReq.model'
import type { TActionAnnouncement, TGetAnnouncementListResponse } from '@/models/response/announcement/AnnouncementRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IAnnouncementProvider {
  getAnnouncementPaginate (query: IGetAnnouncementList): Promise<TGetAnnouncementListResponse>
  createAnnouncement(payload: ICreateAnnouncementPayload): Promise<TActionAnnouncement>
}

class AnnouncementProvider extends HttpRequest implements IAnnouncementProvider {
  private urlPrefix: string = '/api/v1/announcement'

  public async getAnnouncementPaginate (query: IGetAnnouncementList): Promise<TGetAnnouncementListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createAnnouncement (payload: ICreateAnnouncementPayload): Promise<TActionAnnouncement> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }
}

export default AnnouncementProvider
