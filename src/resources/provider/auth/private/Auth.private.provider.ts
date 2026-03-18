import type { IApproveBranchPayload, IRejectBranchPayload, ISelectBranchPayload } from '@/models/request/auth/private/AuthReq.private.model'
import type {
  TActionApproveBranchResponse,
  TActionCheckBearerTokenResponse,
  TActionLogoutResponse,
  TActionRejectBranchResponse,
  TActionSelectBranchResponse,
  TGetActiveBranchResponse
} from '@/models/response/auth/private/AuthRes.private.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IAuthPrivateProvider {
  logout (): Promise<TActionLogoutResponse>
  checkBearerToken (): Promise<TActionCheckBearerTokenResponse>
  getBranch (): Promise<TGetActiveBranchResponse>
  selectBranch (payload: ISelectBranchPayload): Promise<TActionSelectBranchResponse>
  approveBranch (payload: IApproveBranchPayload): Promise<TActionApproveBranchResponse>
  rejectBranch (payload: IRejectBranchPayload): Promise<TActionRejectBranchResponse>
}

class AuthPrivateProvider extends HttpRequest implements IAuthPrivateProvider {
  private urlPrefix: string = '/api/v1/auth'

  public async logout (): Promise<TActionLogoutResponse> {
    const response = await this.post(`${this.urlPrefix}/logout`)
    return response
  }

  public async checkBearerToken (): Promise<TActionCheckBearerTokenResponse> {
    const response = await this.get(`${this.urlPrefix}/check-bearer/user`)
    return response
  }

  public async getBranch (): Promise<TGetActiveBranchResponse> {
    const response = await this.get(`${this.urlPrefix}/active-branches`)
    return response
  }

  public async selectBranch (payload: ISelectBranchPayload): Promise<TActionSelectBranchResponse> {
    const response = await this.post(`${this.urlPrefix}/select-active-branch`, payload)
    return response
  }

  public async approveBranch (payload: IApproveBranchPayload): Promise<TActionApproveBranchResponse> {
    const response = await this.post(`${this.urlPrefix}/approve-branch`, payload)
    return response
  }

  public async rejectBranch (payload: IRejectBranchPayload): Promise<TActionRejectBranchResponse> {
    const response = await this.post(`${this.urlPrefix}/reject-branch`, payload)
    return response
  }
}

export default AuthPrivateProvider
