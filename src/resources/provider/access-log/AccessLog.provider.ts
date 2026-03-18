import type { IGetAccessLogList } from '@/models/request/access-log/AccessLogReq.model'
import type { TGetAccessLogByIdResponse, TGetAccessLogListResponse } from '@/models/response/access-log/AccessLogRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IAccessLogProvider {
  getAccessLogPaginate(query: IGetAccessLogList): Promise<TGetAccessLogListResponse>
  getAccessLogFindOne(id: TBaseParamsId): Promise<TGetAccessLogByIdResponse>
}

class AccessLogProvider extends HttpRequest implements IAccessLogProvider {
  private urlPrefix: string = '/api/v1/access-log'

  public async getAccessLogPaginate (query: IGetAccessLogList): Promise<TGetAccessLogListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async getAccessLogFindOne (id: TBaseParamsId): Promise<TGetAccessLogByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default AccessLogProvider
