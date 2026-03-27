import { ref, type Ref } from 'vue'
import { toast } from '@/plugins/toast'
import UploadProvider, {
  type IMedia,
  type IUploadProvider,
  type IUploadResponse
} from '@/resources/provider/Upload.provider'

export interface IUseUpload {
  media: Ref<IMedia[]>
  getUploadImages (_media?: IMedia[]): Promise<IMedia[]>
}

export default function useUpload (): IUseUpload {
  const storageUrl = 'https://storage.googleapis.com/mittae-siam-bucket'
  const UploadService: IUploadProvider = new UploadProvider()

  const media = ref<IMedia[]>([])

  async function getUploadImages (_images: IMedia[]): Promise<IMedia[]> {
    const actualImages = _images || media.value
    for (const i in actualImages) {
      const e = actualImages?.[i]
      if (!e) continue
      if (!e?.isNew && (e.url.startsWith(storageUrl) || e.url.startsWith('http'))) continue
      if (e?.file) {
        const data = await upload(e.file)
        if (!data?.originalName) continue
        actualImages?.splice(Number(i), 1, {
          name: data.originalName,
          url: data.fileUrl,
          path: data.filePath,
          file: e.file
        })
      }
    }
    return actualImages
  }

  async function upload (file: File): Promise<IUploadResponse> {
    try {
      const { data } = await UploadService.uploadFile(file)
      return data
    } catch (error: unknown) {
      toast.warn('ตรวจสอบ billing ของ Google Cloud Storage ด้วยครับ')
      console.error('Error uploading file:', error)
      return { fileUrl: '/assets/images/logo.png', filePath: '', fileType: 'image/jpeg', originalName: file?.name || 'unknown' }
    }
  }

  return {
    media,
    getUploadImages
  }
}
