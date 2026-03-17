import { type Ref } from 'vue'
import UploadProvider, { type IMedia } from '@/resources/provider/Upload.provider'

export interface IUseUpload {
  uploadAndReplaceImages (images: Ref<IMedia[]>): Promise<Ref<IMedia[]>>
  getUploadImages (images: IMedia[]): Promise<IMedia[]>
}

export default function useUpload (): IUseUpload {
  const UploadService = new UploadProvider()

  async function uploadAndReplaceImages (images: Ref<IMedia[]>): Promise<Ref<IMedia[]>> {
    for (const i in images.value) {
      const image = images.value?.[i]
      if (!image) continue
      if (image?.file) {
        const response = await UploadService.uploadFile(image.file)
        if (!response?.data?.url) continue
        images.value?.splice(Number(i), 1, { ...image, ...response.data })
      }
    }
    return images
  }


  async function getUploadImages (images: IMedia[]): Promise<IMedia[]> {
    for (const i in images) {
      const image = images?.[i]
      if (!image) continue
      if (image?.file) {
        const response = await UploadService.uploadFile(image.file as any)
        if (!response.data?.name) continue
        images?.splice(Number(i), 1, { ...image, ...response.data })
      }
    }
    return images
  }

  return {
    uploadAndReplaceImages,
    getUploadImages
  }
}
