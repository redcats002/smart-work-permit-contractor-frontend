import type { IGetActionLogList } from '@/models/request/action-log/ActionLogReq.model'
import type {
  TGetActionLogByIdResponse,
  TGetActionLogCompareResponse,
  TGetActionLogListResponse
} from '@/models/response/action-log/ActionLogRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IActionLogProvider {
  getActionLogPaginate(query: IGetActionLogList): Promise<TGetActionLogListResponse>
  getActionLogFindOne(id: TBaseParamsId): Promise<TGetActionLogByIdResponse>
  getActionLogCompare(id: TBaseParamsId): Promise<TGetActionLogCompareResponse>
}

class ActionLogProvider extends HttpRequest implements IActionLogProvider {
  private urlPrefix: string = '/api/v1/management/action-log'

  public async getActionLogPaginate (query: IGetActionLogList): Promise<TGetActionLogListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async getActionLogFindOne (id: TBaseParamsId): Promise<TGetActionLogByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getActionLogCompare (id: TBaseParamsId): Promise<TGetActionLogCompareResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/compare`)
    return response
  }
}

export default ActionLogProvider
