import type { IUpdateMyProfilePayload } from '@/models/request/user/UserReq.model'
import type { TGetMyProfileResponse, TUpdateMyProfileResponse } from '@/models/response/user/UserRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * Self-service profile only. This app never manages other people's accounts — the account
 * register lives in the Safety Officer app, behind a `safety_officer` guard.
 *
 * The success envelope is passed through whole in this repo (see src/resources/Interceptors.ts),
 * so callers read `.data`. The sibling Safety/Inspector app unwraps instead; that difference is
 * deliberate.
 */
export interface IUserProvider {
  me (): Promise<TGetMyProfileResponse>
  updateMe (payload: IUpdateMyProfilePayload): Promise<TUpdateMyProfileResponse>
}

class UserProvider extends HttpRequest implements IUserProvider {
  private urlPrefix: string = '/api/v1/users'

  public async me (): Promise<TGetMyProfileResponse> {
    const response = await this.get(`${this.urlPrefix}/me`)
    return response
  }

  public async updateMe (payload: IUpdateMyProfilePayload): Promise<TUpdateMyProfileResponse> {
    const response = await this.patch(`${this.urlPrefix}/me`, payload)
    return response
  }
}

export default UserProvider
