import type { IGetContractSecurityDocumentReportList } from '@/models/request/report/contract-security-document/ContractSecurityDocumentReq.model'
import type { TGetContractSecurityDocumentReportListResponse } from '@/models/response/report/contract-security-document/ContractSecurityDocumentRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractSecurityDocumentProvider {
  getContractSecurityDocumentPaginate(query: IGetContractSecurityDocumentReportList): Promise<TGetContractSecurityDocumentReportListResponse>
}

class ContractSecurityDocumentProvider extends HttpRequest implements IContractSecurityDocumentProvider {
  private urlPrefix: string = '/api/v1/management/report/contract-security-document'

  public async getContractSecurityDocumentPaginate (
    query: IGetContractSecurityDocumentReportList
  ): Promise<TGetContractSecurityDocumentReportListResponse> {
    this.setLogHeaders({ menu: 'REPORT', subMenu: 'รายงานสัญญาและเอกสารหลักทรัพย์' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default ContractSecurityDocumentProvider
