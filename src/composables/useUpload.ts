import { ref, type Ref } from 'vue'
import UploadProvider, {
  type IUploadProvider,
  type IUploadResponse
} from '@/resources/provider/Upload.provider'

export interface IUseUpload {
  files: Ref<File[]>
  previewUrls: Ref<string[]>
  getUploadImages (): Promise<IUploadResponse[]>
}

export default function useUpload (): IUseUpload {
  const UploadService: IUploadProvider = new UploadProvider()

  const files = ref<File[]>([])
  const previewUrls = ref<string[]>([])

  async function getUploadImages (): Promise<IUploadResponse[]> {
    const uploadResults: IUploadResponse[] = []
    for (const file of files.value) {
      const response = await UploadService.uploadFile(file)
      if (response && response.data) {
        uploadResults.push(response.data)
      }
    }
    return uploadResults
  }

  return {
    files,
    previewUrls,
    getUploadImages
  }
}
