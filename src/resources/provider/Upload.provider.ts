import type { IBaseSuccessResponse } from '@/models/response/Response.model'
import HttpRequest from '../HttpRequest'

export interface IUploadResponse {
  fileUrl: string
  filePath: string
  fileType: string | null
  originalName: string
}
type TUploadResponse = IBaseSuccessResponse<IUploadResponse>

export interface IMedia extends IUploadResponse {
  file?: File
}

export interface IUploadProvider {
  uploadFile(file: File): Promise<TUploadResponse>
}

class UploadProvider extends HttpRequest implements IUploadProvider {
  private urlPrefix: string = '/v1/api/storage/upload'

  public async uploadFile (file: File): Promise<TUploadResponse> {
    this.setAuthHeader()
    const form = new FormData()
    form.append('file', file, encodeURIComponent(file.name))
    const response = await this.post(`${this.urlPrefix}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  }
}

export default UploadProvider
