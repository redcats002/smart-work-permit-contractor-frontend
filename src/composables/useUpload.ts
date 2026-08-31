import { ref, type Ref } from 'vue'
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
  // Not renamed with the product (e-safework, 2026-08-31): a bucket name is an address and
  // objects do not follow a rename. This URL is also legacy — production storage is MinIO
  // behind storage.e-safework.com, not GCS. Fix the provider before fixing the name.
  const storageUrl = 'https://storage.googleapis.com/smart-work-permit-bucket'
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
    const { data } = await UploadService.uploadFile(file)
    return data
  }

  return {
    media,
    getUploadImages
  }
}
