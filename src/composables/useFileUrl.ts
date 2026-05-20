import { ref, type Ref, watch } from 'vue'
import UploadProvider, { type IUploadProvider } from '@/resources/provider/Upload.provider'

export interface IUseFileUrl {
  url: Ref<string | null>
  loading: Ref<boolean>
}

export default function useFileUrl (filePath: Ref<string | null | undefined>): IUseFileUrl {
  const UploadService: IUploadProvider = new UploadProvider()
  const url = ref<string | null>(null)
  const loading = ref<boolean>(false)

  watch(filePath, async (path: string | null | undefined): Promise<void> => {
    if (!path) {
      url.value = null
      return
    }
    loading.value = true
    try {
      const res = await UploadService.getFileUrl(path)
      url.value = res?.url
    } catch (error: unknown) {
      console.error('Failed to resolve file URL:', error)
      url.value = null
    } finally {
      loading.value = false
    }
  }, { immediate: true })

  return { url, loading }
}
