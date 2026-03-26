import type { IBaseSuccessResponse } from '@/models/response/Response.model'
import HttpRequest from '../HttpRequest'

export interface IUploadResponse {
  fileUrl: string
  filePath: string
  fileType: string | null
  originalName: string
}
// export interface IUploadResponse {
//   name: string
//   url: string
//   path: string
// }


type TUploadResponse = IBaseSuccessResponse<IUploadResponse>

export interface IMedia {
  file?: File
  name: string
  url: string
  path: string
}

export interface IUploadProvider {
  uploadFile(file: File): Promise<TUploadResponse>
}

class UploadProvider extends HttpRequest implements IUploadProvider {
  private urlPrefix: string = '/api/v1/upload'

  public async uploadFile (file: File): Promise<TUploadResponse> {
    const form = new FormData()
    // const fileName= encodeURIComponent(file.name)
    form.append('file', file)
    const response = await this.post(`${this.urlPrefix}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  }
}

export default UploadProvider
