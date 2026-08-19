import type { IBaseSuccessResponse } from '@/models/response/Response.model'
import HttpRequest from '../HttpRequest'

export interface IUploadResponse {
  fileUrl: string
  filePath: string
  fileType: string | null
  originalName: string
}
type TUploadResponse = IBaseSuccessResponse<IUploadResponse>

// GET /api/v1/file now answers the standard envelope: { message, data: { url } }. The provider
// returns that envelope whole, like every other method here.
export interface IFileUrl {
  url: string
}

type TFileUrlResponse = IBaseSuccessResponse<IFileUrl>

export interface IMedia {
  file?: File
  isNew?: boolean
  name: string
  url: string
  path: string
}

export interface IUploadProvider {
  uploadFile(file: File): Promise<TUploadResponse>
  getFileUrl(filePath: string): Promise<TFileUrlResponse>
}

class UploadProvider extends HttpRequest implements IUploadProvider {
  private urlPrefix: string = '/api/v1/upload'

  public async uploadFile (file: File): Promise<TUploadResponse> {
    const form = new FormData()
    const fileName = encodeURIComponent(file.name)
    form.append('file', file, fileName)
    const response = await this.post(`${this.urlPrefix}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  }

  // filePath is a storage key containing slashes and often spaces — it must be encoded.
  public async getFileUrl (filePath: string): Promise<TFileUrlResponse> {
    return this.get(`/api/v1/file?filePath=${encodeURIComponent(filePath)}`)
  }
}

export default UploadProvider
