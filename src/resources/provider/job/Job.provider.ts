import type { ICreateJobPayload, IGetJobList, IUpdateJobPayload } from '@/models/request/job/JobReq.model'
import type { TActionJob, TGetJobByIdResponse, TGetJobListResponse } from '@/models/response/job/JobRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IJobProvider {
  getJobPaginate (query: IGetJobList): Promise<TGetJobListResponse>
  createJob (payload: ICreateJobPayload): Promise<TActionJob>
  updateJob (id: TBaseParamsId, payload: IUpdateJobPayload): Promise<TActionJob>
  deleteJob (id: number): Promise<TActionJob>
  getJobFindOne (id: TBaseParamsId): Promise<TGetJobByIdResponse>
}

class JobProvider extends HttpRequest implements IJobProvider {
  private urlPrefix: string = '/api/v1/jobs'

  public async getJobPaginate (query: IGetJobList): Promise<TGetJobListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createJob (payload: ICreateJobPayload): Promise<TActionJob> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateJob (id: TBaseParamsId, payload: IUpdateJobPayload): Promise<TActionJob> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteJob (id: number): Promise<TActionJob> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getJobFindOne (id: TBaseParamsId): Promise<TGetJobByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default JobProvider
