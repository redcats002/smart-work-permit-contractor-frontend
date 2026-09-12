import type { IGetGasLogListResponse } from '@/models/response/gas-log/GasLogRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * wayfinder 112. Read only — this app never records a gas reading, that is the inspector app's
 * job. Mirrors the safety app's `GasLog.provider.ts` class/interface/method name for parity, but
 * follows THIS repo's transport convention: `HttpRequest.get()` returns the raw envelope
 * unmodified, so `list()` hands back `{ message, data, overdue }` as-is rather than unwrapping it
 * the way the safety app's provider does.
 */
export interface IGasLogProvider {
  list (permitId: string): Promise<IGetGasLogListResponse>
}

class GasLogProvider extends HttpRequest implements IGasLogProvider {
  private urlPrefix: string = '/api/v1/permits'

  public async list (permitId: string): Promise<IGetGasLogListResponse> {
    const response = await this.get(`${this.urlPrefix}/${permitId}/gas-log`)
    return response
  }
}

export default GasLogProvider
