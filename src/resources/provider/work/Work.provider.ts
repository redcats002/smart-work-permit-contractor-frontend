import type { IGetNewWorkList } from '@/models/request/work/WorkReq.model'
import type { TGetNewWorkListResponse } from '@/models/response/work/WorkRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IWorkProvider {
  getWorkPaginate (query: IGetNewWorkList): Promise<TGetNewWorkListResponse>
}

class WorkProvider extends HttpRequest implements IWorkProvider {
  private urlPrefix: string = '/api/v1/work'

  public async getWorkPaginate (query: IGetNewWorkList): Promise<TGetNewWorkListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default WorkProvider
